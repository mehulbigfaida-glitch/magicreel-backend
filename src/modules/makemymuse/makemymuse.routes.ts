import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import jwt from "jsonwebtoken";
import axios from "axios";
import { fal } from "@fal-ai/client";
import sharp from "sharp";
import { cloudinary } from "../../config/cloudinary";
import { prisma } from "../../magicreel/db/prisma";
import { buildEightFacePrompt, buildRefinementPrompt } from "./promptBuilder";
import { MuseCreativeBrief } from "./types";
import { sha256Buffer, sha256Text, differenceHash, hashDistance } from "./provenance";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 }, fileFilter: (_req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  cb(allowed.includes(file.mimetype) ? null : new Error("Only JPG, PNG or WEBP images are accepted."), allowed.includes(file.mimetype));
}});
const MODEL_ENDPOINT = process.env.MAKEMYMUSE_IMAGE_MODEL || "openai/gpt-image-2.5/sunburst/edit";
const MODEL_NAME = process.env.MAKEMYMUSE_MODEL_NAME || "GPT Image 2.5 Sunburst Edit";
const PROVIDER = "fal.ai";
const CONSENT_VERSION = "makemymuse-consent-v2";
const CONSENT_TEXT = "I confirm the person shown is an adult, I own this reference image or have permission and consent to use it, and I authorize its processing by the AI image-generation provider and private asset storage for synthetic fashion identity creation. I understand generated identities may not be globally unique and this process does not guarantee copyright or patent protection.";
fal.config({ credentials: process.env.FAL_KEY! });

type AuthRequest = Request & { user?: { id: string } };
function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.slice(7).trim() : "";
  if (!token) return res.status(401).json({ success: false, message: "Authentication required." });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as jwt.JwtPayload;
    const id = decoded.id || decoded.userId;
    if (!id) return res.status(401).json({ success: false, message: "Invalid token." });
    (req as AuthRequest).user = { id: String(id) };
    next();
  } catch { return res.status(401).json({ success: false, message: "Invalid or expired token." }); }
}
function userId(req: AuthRequest) { return req.user?.id || ""; }
function privateUrl(publicId: string) { return cloudinary.url(publicId, { secure: true, type: "authenticated", sign_url: true }); }
function parseBrief(body: any): MuseCreativeBrief {
  const genderPresentation = body.genderPresentation;
  const apparentAge = Number(body.apparentAge);
  const skinDirection = body.skinDirection || "reference";
  if (!["female", "male", "androgynous"].includes(genderPresentation)) throw new Error("Choose Female, Male or Androgynous.");
  if (!Number.isInteger(apparentAge) || apparentAge < 18 || apparentAge > 60) throw new Error("Apparent age must be between 18 and 60.");
  if (!["reference", "warm", "cool", "neutral", "explore"].includes(skinDirection)) throw new Error("Invalid skin direction.");
  return {
    genderPresentation,
    apparentAge,
    skinDirection,
    transformationDirection: typeof body.transformationDirection === "string" ? body.transformationDirection.slice(0, 300) : undefined,
    refinement: body.refinement || undefined,
  };
}
async function uploadPrivateBuffer(buffer: Buffer, folder: string, context: Record<string,string>) {
  return new Promise<any>((resolve, reject) => {
    cloudinary.uploader.upload_stream({ folder, resource_type: "image", type: "authenticated", format: "png", context, tags: ["makemymuse"] }, (err, result) => {
      if (err || !result) return reject(err || new Error("Cloudinary upload failed."));
      resolve(result);
    }).end(buffer);
  });
}
async function generateImage(prompt: string, referenceUrl: string, size: {width:number;height:number}) {
  const result = await fal.subscribe(MODEL_ENDPOINT, { input: { prompt, image_urls: [referenceUrl], num_images: 1, output_format: "png", quality: "medium", image_size: size }, logs: true });
  const data = result.data as { images?: Array<{url:string;width?:number;height?:number}> };
  const image = data.images?.[0];
  if (!image?.url) throw new Error("Generation provider returned no image.");
  const response = await axios.get<ArrayBuffer>(image.url, { responseType: "arraybuffer", timeout: 90000, maxContentLength: 30 * 1024 * 1024 });
  return { buffer: Buffer.from(response.data), width: image.width || size.width, height: image.height || size.height, requestId: (result as any).requestId || null };
}
async function ownsReference(publicId: string, uid: string, expectedHash?: string) {
  if (!publicId.startsWith("makemymuse/references/")) return false;
  const asset = await cloudinary.api.resource(publicId, { resource_type: "image", type: "authenticated", context: true });
  const custom=asset.context?.custom||{};
  if(custom.owner_id!==uid)return false;
  if(expectedHash && custom.source_sha256!==expectedHash)return false;
  return true;
}

function validateRefinement(value: any) {
  const allowed: Record<string,string[]> = {
    eyes:["natural","almond","soft-round","defined","lifted"],
    faceShape:["soft-oval","heart","round","defined","long"],
    hair:["long-waves","straight","soft-curls","short","layered"],
    lips:["balanced","fuller","soft","defined"],
  };
  const clean: Record<string,string> = {};
  for(const key of Object.keys(allowed)){
    if(value?.[key]!==undefined){
      if(!allowed[key].includes(String(value[key]))) throw new Error("Invalid refinement option for "+key+".");
      clean[key]=String(value[key]);
    }
  }
  return clean;
}

async function history(sessionId: string, event: string, data: unknown) {
  await prisma.$executeRawUnsafe("INSERT INTO makemymuse.creation_history (session_id, event_type, event_data) VALUES ($1, $2, $3::jsonb)", sessionId, event, JSON.stringify(data));
}

router.post("/reference", auth, upload.single("reference"), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ success:false, message:"Reference image required." });
    const uid = userId(req);
    const asset = await uploadPrivateBuffer(req.file.buffer, "makemymuse/references", { owner_id: uid, source_sha256: sha256Buffer(req.file.buffer) });
    return res.status(201).json({ success:true, data:{ publicId: asset.public_id, imageUrl: privateUrl(asset.public_id), sourceHash: sha256Buffer(req.file.buffer) } });
  } catch (e:any) { return res.status(500).json({success:false,message:e?.message || "Reference upload failed."}); }
});

router.post("/sessions", auth, async (req: AuthRequest, res: Response) => {
  try {
    const uid=userId(req); const publicId=req.body?.referencePublicId; const sourceHash=String(req.body?.sourceHash||""); const consent=req.body?.consent;
    if(consent!==true) return res.status(400).json({success:false,message:"Explicit reference-use consent is required."});
    if (typeof publicId!=="string" || !(await ownsReference(publicId,uid,sourceHash))) return res.status(403).json({success:false,message:"Reference asset not found or not owned by this account."});
    const result=await prisma.$queryRawUnsafe<any[]>("INSERT INTO makemymuse.creation_sessions (user_id, reference_public_id, reference_image_url, status) VALUES ($1, $2, $3, 'REFERENCE_UPLOADED') RETURNING id",uid,publicId,privateUrl(publicId));
    const id=result[0].id;
    await prisma.$executeRawUnsafe("INSERT INTO makemymuse.identity_blueprints (session_id,preview_image_url,preview_public_id,anchor_summary) VALUES ($1,$2,$3,$4::jsonb)",id,privateUrl(publicId),publicId,JSON.stringify({type:"visual creative reference",analysisStatus:"NOT_AUTOMATICALLY_ANALYZED",note:"The Blueprint overlay is a visual UI treatment, not biometric measurement."}));
    await history(id,"IDENTITY_BLUEPRINT_PRESENTED",{referencePublicId:publicId,blueprintType:"visual creative-reference overlay",biometricAnalysis:false});
    await history(id,"REFERENCE_UPLOADED",{referencePublicId:publicId,referenceSha256:sourceHash,consentVersion:CONSENT_VERSION,consentText:CONSENT_TEXT});
    await prisma.$executeRawUnsafe("INSERT INTO makemymuse.consent_records (user_id, session_id, consent_type, consent_version, consent_text, reference_public_id) VALUES ($1, $2, 'REFERENCE_USE', $3, $4, $5)",uid,id,CONSENT_VERSION,CONSENT_TEXT,publicId);
    return res.status(201).json({success:true,data:{sessionId:id}});
  } catch(e:any){return res.status(500).json({success:false,message:e?.message||"Session creation failed."});}
});

router.post("/sessions/:id/prompt-preview", auth, async (req: AuthRequest, res: Response) => {
  try {
    const uid=userId(req); const id=req.params.id;
    const session=await prisma.$queryRawUnsafe<any[]>("SELECT id, reference_public_id FROM makemymuse.creation_sessions WHERE id=$1 AND user_id=$2",id,uid);
    if(!session.length) return res.status(404).json({success:false,message:"Session not found."});
    const build=buildEightFacePrompt(parseBrief(req.body));
    return res.json({success:true,data:{promptVersion:build.promptVersion,prompt:build.prompt,manifest:build.manifest}});
  } catch(e:any){return res.status(400).json({success:false,message:e?.message||"Prompt preview failed."});}
});

router.post("/sessions/:id/generate-candidates", auth, async (req: AuthRequest, res: Response) => {
  try {
    const uid=userId(req); const id=req.params.id;
    const session=await prisma.$queryRawUnsafe<any[]>("SELECT id, reference_public_id, status FROM makemymuse.creation_sessions WHERE id=$1 AND user_id=$2",id,uid);
    if(!session.length) return res.status(404).json({success:false,message:"Session not found."});
    if(session[0].status==="GENERATING") return res.status(409).json({success:false,message:"Candidate generation is already in progress."});
    if(session[0].status==="CANDIDATES_READY") {
      const prior=await prisma.$queryRawUnsafe<any[]>("SELECT b.id AS batch_id,b.collage_url,b.collage_public_id,c.candidate_number,c.image_url,c.cloudinary_public_id FROM makemymuse.face_generation_batches b JOIN makemymuse.face_candidates c ON c.batch_id=b.id WHERE b.session_id=$1 ORDER BY c.candidate_number",id);
      if(prior.length===8) { const priorEvent=await prisma.$queryRawUnsafe<any[]>("SELECT event_data FROM makemymuse.creation_history WHERE session_id=$1 AND event_type='CANDIDATES_GENERATED' ORDER BY created_at DESC LIMIT 1",id); return res.json({success:true,data:{batchId:prior[0].batch_id,candidateCount:8,layout:"4x2",collage:{publicId:prior[0].collage_public_id,imageUrl:prior[0].collage_url},candidates:prior.map((p:any)=>({candidateNumber:p.candidate_number,publicId:p.cloudinary_public_id,imageUrl:p.image_url})),candidateScreening:priorEvent[0]?.event_data?.candidateScreening||{method:"unavailable",thresholdHammingDistance:5,withinBatchNearDuplicates:[],catalogNearDuplicateFlags:[],interpretation:"Screening record unavailable."},cached:true}}); }
    }
    const claimed=await prisma.$executeRawUnsafe("UPDATE makemymuse.creation_sessions SET status='GENERATING',updated_at=now() WHERE id=$1 AND user_id=$2 AND status<>'GENERATING'",id,uid);
    if(!claimed) return res.status(409).json({success:false,message:"This session is not ready for generation. Refresh and retry."});
    const brief=parseBrief(req.body); const build=buildEightFacePrompt(brief);
    const referencePublicId=session[0].reference_public_id;
    if(!(await ownsReference(referencePublicId,uid))) return res.status(403).json({success:false,message:"Reference authorization failed."});
    const collage=await generateImage(build.prompt,privateUrl(referencePublicId),{width:2048,height:1024});
    const collageAsset=await uploadPrivateBuffer(collage.buffer,"makemymuse/collages",{owner_id:uid,session_id:id,prompt_version:build.promptVersion,prompt_hash:sha256Text(build.prompt),reference_public_id:referencePublicId});
    const collageBuffer=await axios.get<ArrayBuffer>(privateUrl(collageAsset.public_id),{responseType:"arraybuffer",timeout:60000});
    const buffer=Buffer.from(collageBuffer.data); const meta=await sharp(buffer).metadata();
    if(!meta.width||!meta.height||meta.width<4||meta.height<2) throw new Error("Collage dimensions invalid.");
    const cellW=Math.floor(meta.width/4),cellH=Math.floor(meta.height/2);
    const crops=await Promise.all(Array.from({length:8},async(_,index)=>{
      const row=Math.floor(index/4),col=index%4; const left=col*cellW,top=row*cellH;
      const inset=Math.max(2,Math.round(Math.min(cellW,cellH)*0.005));
      const crop={left:left+inset,top:top+inset,width:Math.max(1,Math.min(cellW-inset*2,meta.width-left-inset)),height:Math.max(1,Math.min(cellH-inset*2,meta.height-top-inset))};
      const candidateBuffer=await sharp(buffer).extract(crop).png().toBuffer();
      const perceptualHash=await differenceHash(candidateBuffer);
      const asset=await uploadPrivateBuffer(candidateBuffer,"makemymuse/candidates",{owner_id:uid,session_id:id,batch_public_id:collageAsset.public_id,candidate_number:String(index+1),prompt_version:build.promptVersion});
      return {candidateNumber:index+1,publicId:asset.public_id,imageUrl:privateUrl(asset.public_id),width:asset.width,height:asset.height,sha256:sha256Buffer(candidateBuffer),perceptualHash};
    }));
    const previousEvents=await prisma.$queryRawUnsafe<any[]>("SELECT session_id,event_data FROM makemymuse.creation_history WHERE event_type='CANDIDATES_GENERATED'");
    const priorHashes=previousEvents.flatMap((e:any)=>(e.event_data?.candidateAssets||[]).filter((a:any)=>a.perceptualHash).map((a:any)=>({sessionId:e.session_id,hash:a.perceptualHash})));
    const batchPairs:any[]=[];
    for(let i=0;i<crops.length;i++)for(let j=i+1;j<crops.length;j++){const distance=hashDistance(crops[i].perceptualHash,crops[j].perceptualHash);if(distance<=5)batchPairs.push({candidateNumbers:[i+1,j+1],distance});}
    const catalogFlags=crops.map((candidate:any)=>({candidateNumber:candidate.candidateNumber,similarPriorAssets:priorHashes.filter((p:any)=>hashDistance(candidate.perceptualHash,p.hash)<=5).map((p:any)=>({priorSessionId:p.sessionId,distance:hashDistance(candidate.perceptualHash,p.hash)}))}));
    const candidateScreening={method:"64-bit dHash over full candidate image (not facial recognition)",thresholdHammingDistance:5,withinBatchNearDuplicates:batchPairs,catalogNearDuplicateFlags:catalogFlags,interpretation:"Visual near-duplicate screen only; does not prove face uniqueness or copyright."};
    const batch=await prisma.$queryRawUnsafe<any[]>("INSERT INTO makemymuse.face_generation_batches (session_id, age_appearance, gender_presentation, collage_url, collage_public_id, provider, model_name, status) VALUES ($1,$2,$3,$4,$5,$6,$7,'COMPLETED') RETURNING id",id,brief.apparentAge,brief.genderPresentation,privateUrl(collageAsset.public_id),collageAsset.public_id,PROVIDER,MODEL_NAME);
    const batchId=batch[0].id;
    for(const candidate of crops) await prisma.$executeRawUnsafe("INSERT INTO makemymuse.face_candidates (batch_id,candidate_number,image_url,cloudinary_public_id) VALUES ($1,$2,$3,$4)",batchId,candidate.candidateNumber,candidate.imageUrl,candidate.publicId);
    await prisma.$executeRawUnsafe("UPDATE makemymuse.creation_sessions SET status='CANDIDATES_READY', gender_presentation=$2, age_appearance=$3, skin_direction=$4, updated_at=now() WHERE id=$1",id,brief.genderPresentation,brief.apparentAge,brief.skinDirection);
    await history(id,"CANDIDATES_GENERATED",{batchId,provider:PROVIDER,model:MODEL_NAME,endpoint:MODEL_ENDPOINT,providerRequestId:collage.requestId,promptVersion:build.promptVersion,promptHash:sha256Text(build.prompt),promptText:build.prompt,brief,requestConfig:{numImages:1,outputFormat:"png",quality:"medium",imageSize:{width:2048,height:1024},layout:"4x2"},collagePublicId:collageAsset.public_id,candidateAssets:crops,candidateScreening,automatedQa:{collageDownloadVerified:true,dimensionsVerified:true,eightCropsExtracted:true,visualFaceQa:"NOT_AUTOMATED"}});
    return res.status(201).json({success:true,data:{batchId,candidateCount:8,layout:"4x2",collage:{publicId:collageAsset.public_id,imageUrl:privateUrl(collageAsset.public_id),width:meta.width,height:meta.height},candidates:crops,candidateScreening,promptVersion:build.promptVersion,promptHash:sha256Text(build.prompt)}});
  }catch(e:any){console.error("[MakeMyMuse] candidate generation error",e?.message);await prisma.$executeRawUnsafe("UPDATE makemymuse.creation_sessions SET status='GENERATION_FAILED',updated_at=now() WHERE id=$1 AND status='GENERATING'",req.params.id).catch(()=>{});return res.status(502).json({success:false,message:e?.message||"Candidate generation failed."});}
});

router.post("/sessions/:id/refine-preview", auth, async (req: AuthRequest, res: Response) => {
  try {
    const uid=userId(req);const id=req.params.id;const candidatePublicId=req.body?.candidatePublicId;
    const previewCount=await prisma.$queryRawUnsafe<any[]>("SELECT count(*)::int AS count FROM makemymuse.creation_history WHERE session_id=$1 AND event_type='REFINEMENT_PREVIEW_GENERATED'",id);
    if(Number(previewCount[0]?.count||0)>=3)return res.status(429).json({success:false,message:"You have reached the three-preview limit for this creation session. Approve a face or start a new creation."});
    const owned=await prisma.$queryRawUnsafe<any[]>("SELECT s.id,c.id AS candidate_id,c.cloudinary_public_id FROM makemymuse.creation_sessions s JOIN makemymuse.face_generation_batches b ON b.session_id=s.id JOIN makemymuse.face_candidates c ON c.batch_id=b.id WHERE s.id=$1 AND s.user_id=$2 AND c.cloudinary_public_id=$3",id,uid,candidatePublicId);
    if(!owned.length) return res.status(403).json({success:false,message:"Selected candidate is not part of this session."});
    const refinement=validateRefinement(req.body?.refinement||{});const prompt=buildRefinementPrompt(refinement);
    const preview=await generateImage(prompt,privateUrl(candidatePublicId),{width:1024,height:1536});
    const asset=await uploadPrivateBuffer(preview.buffer,"makemymuse/refinements",{owner_id:uid,session_id:id,candidate_public_id:candidatePublicId,refinement_hash:sha256Text(JSON.stringify(refinement))});
    const url=privateUrl(asset.public_id);
    const rows=await prisma.$queryRawUnsafe<any[]>("INSERT INTO makemymuse.face_refinements (candidate_id,refinement_options,preview_image_url,preview_public_id,is_applied) VALUES ($1,$2::jsonb,$3,$4,false) RETURNING id",owned[0].candidate_id,JSON.stringify(refinement),url,asset.public_id);
    await history(id,"REFINEMENT_PREVIEW_GENERATED",{refinementId:rows[0].id,candidatePublicId,previewPublicId:asset.public_id,refinement,promptHash:sha256Text(prompt)});
    return res.status(201).json({success:true,data:{refinementId:rows[0].id,previewPublicId:asset.public_id,previewImageUrl:url,sha256:sha256Buffer(preview.buffer)}});
  }catch(e:any){console.error("[MakeMyMuse] refinement preview error",e?.message);return res.status(502).json({success:false,message:e?.message||"Refinement preview failed."});}
});

router.post("/sessions/:id/approve-face", auth, async (req: AuthRequest, res: Response) => {
  try {
    const uid=userId(req);const id=req.params.id;const candidatePublicId=req.body?.candidatePublicId;const refinementId=req.body?.refinementId||null;
    const rows=await prisma.$queryRawUnsafe<any[]>("SELECT s.id,c.id AS candidate_id,c.image_url,c.cloudinary_public_id,r.preview_image_url,r.preview_public_id FROM makemymuse.creation_sessions s JOIN makemymuse.face_generation_batches b ON b.session_id=s.id JOIN makemymuse.face_candidates c ON c.batch_id=b.id LEFT JOIN makemymuse.face_refinements r ON r.candidate_id=c.id AND r.id=$4 WHERE s.id=$1 AND s.user_id=$2 AND c.cloudinary_public_id=$3",id,uid,candidatePublicId,refinementId);
    if(!rows.length)return res.status(403).json({success:false,message:"Candidate or refinement not found for this session."});
    const selectedUrl=refinementId?rows[0].preview_image_url:rows[0].image_url;
    const selectedPublicId=refinementId?rows[0].preview_public_id:rows[0].cloudinary_public_id;
    if(!selectedUrl||!selectedPublicId)return res.status(400).json({success:false,message:"Approved asset missing."});
    await prisma.$executeRawUnsafe("UPDATE makemymuse.face_candidates SET is_selected=(id=$1) WHERE batch_id=(SELECT id FROM makemymuse.face_generation_batches WHERE session_id=$2)",rows[0].candidate_id,id);
    await prisma.$executeRawUnsafe("INSERT INTO makemymuse.face_approvals (session_id,candidate_id,approved_image_url,approved_public_id) VALUES ($1,$2,$3,$4) ON CONFLICT(session_id) DO UPDATE SET candidate_id=EXCLUDED.candidate_id,approved_image_url=EXCLUDED.approved_image_url,approved_public_id=EXCLUDED.approved_public_id,approved_at=now()",id,rows[0].candidate_id,selectedUrl,selectedPublicId);
    if(refinementId) await prisma.$executeRawUnsafe("UPDATE makemymuse.face_refinements SET is_applied=true WHERE id=$1",refinementId);
    await prisma.$executeRawUnsafe("UPDATE makemymuse.creation_sessions SET selected_candidate_id=$2,status='FACE_APPROVED',updated_at=now() WHERE id=$1",id,rows[0].candidate_id);
    await history(id,"FACE_APPROVED",{candidatePublicId,refinementId,approvedPublicId:selectedPublicId});
    return res.json({success:true,data:{approvedImageUrl:selectedUrl,approvedPublicId:selectedPublicId}});
  }catch(e:any){return res.status(500).json({success:false,message:e?.message||"Approval failed."});}
});

router.post("/sessions/:id/generate-final", auth, async (req: AuthRequest, res: Response) => {
  try {
    const uid=userId(req);const id=req.params.id;const bodyType=String(req.body?.bodyType||"").slice(0,50);
    if(!["Petite","Slim","Athletic","Curvy"].includes(bodyType))return res.status(400).json({success:false,message:"Choose a valid body type."});
    const existing=await prisma.$queryRawUnsafe<any[]>("SELECT final_model_url,final_model_public_id,selected_body_type FROM makemymuse.creation_sessions WHERE id=$1 AND user_id=$2 AND status='MODEL_GENERATED'",id,uid);
    if(existing.length)return res.json({success:true,data:{imageUrl:existing[0].final_model_url,publicId:existing[0].final_model_public_id,bodyType:existing[0].selected_body_type,cached:true}});
    const rows=await prisma.$queryRawUnsafe<any[]>("SELECT s.id,a.approved_image_url,a.approved_public_id FROM makemymuse.creation_sessions s JOIN makemymuse.face_approvals a ON a.session_id=s.id WHERE s.id=$1 AND s.user_id=$2",id,uid);
    if(!rows.length)return res.status(409).json({success:false,message:"Approve a face before generating the final model."});
    const claimed=await prisma.$executeRawUnsafe("UPDATE makemymuse.creation_sessions SET status='MODEL_GENERATING',updated_at=now() WHERE id=$1 AND user_id=$2 AND status='FACE_APPROVED'",id,uid);
    if(!claimed)return res.status(409).json({success:false,message:"Final model generation is already in progress or this session is not ready."});
    const prompt="Create a full-length adult fashion model using the attached approved face identity as the identity reference. Preserve the approved face and broad facial proportions. Body silhouette direction: "+bodyType+". Photorealistic, neutral studio, standing natural fashion pose, simple fitted neutral clothing, full body visible, no text, no logos, no watermark. This is a synthetic fashion model, clearly adult.";
    const final=await generateImage(prompt,privateUrl(rows[0].approved_public_id),{width:1024,height:1536});
    const asset=await uploadPrivateBuffer(final.buffer,"makemymuse/final-models",{owner_id:uid,session_id:id,body_type:bodyType,approved_face_public_id:rows[0].approved_public_id});
    const url=privateUrl(asset.public_id);
    await prisma.$executeRawUnsafe("INSERT INTO makemymuse.model_assets (session_id,asset_type,image_url,cloudinary_public_id,metadata) VALUES ($1,'final-model',$2,$3,$4::jsonb)",id,url,asset.public_id,JSON.stringify({bodyType,model:MODEL_NAME,provider:PROVIDER,endpoint:MODEL_ENDPOINT,promptHash:sha256Text(prompt)}));
    await prisma.$executeRawUnsafe("UPDATE makemymuse.creation_sessions SET selected_body_type=$2,final_model_url=$3,final_model_public_id=$4,status='MODEL_GENERATED',updated_at=now() WHERE id=$1",id,bodyType,url,asset.public_id);
    await history(id,"FINAL_MODEL_GENERATED",{bodyType,finalPublicId:asset.public_id,finalImageSha256:sha256Buffer(final.buffer),promptHash:sha256Text(prompt)});
    return res.status(201).json({success:true,data:{imageUrl:url,publicId:asset.public_id,bodyType}});
  }catch(e:any){console.error("[MakeMyMuse] final model generation error",e?.message);await prisma.$executeRawUnsafe("UPDATE makemymuse.creation_sessions SET status='FACE_APPROVED',updated_at=now() WHERE id=$1 AND status='MODEL_GENERATING'",req.params.id).catch(()=>{});return res.status(502).json({success:false,message:e?.message||"Final model generation failed."});}
});

router.post("/sessions/:id/save", auth, async (req: AuthRequest, res: Response) => {
  try{
    const uid=userId(req);const id=req.params.id;const name=String(req.body?.name||"My Muse").trim().slice(0,40);
    const rows=await prisma.$queryRawUnsafe<any[]>("UPDATE makemymuse.creation_sessions SET muse_name=$2,status='SAVED',updated_at=now() WHERE id=$1 AND user_id=$3 AND final_model_public_id IS NOT NULL RETURNING id,final_model_url,final_model_public_id",id,name,uid);
    if(!rows.length)return res.status(409).json({success:false,message:"Generate the final model before saving."});
    await history(id,"MUSE_SAVED",{name,finalPublicId:rows[0].final_model_public_id});
    return res.json({success:true,data:{sessionId:id,name,imageUrl:rows[0].final_model_url,publicId:rows[0].final_model_public_id}});
  }catch(e:any){return res.status(500).json({success:false,message:e?.message||"Save failed."});}
});

router.get("/sessions/:id/history", auth, async (req: AuthRequest, res: Response) => {
  try{
    const uid=userId(req);const id=req.params.id;
    const owned=await prisma.$queryRawUnsafe<any[]>("SELECT id FROM makemymuse.creation_sessions WHERE id=$1 AND user_id=$2",id,uid);
    if(!owned.length)return res.status(404).json({success:false,message:"Session not found."});
    const events=await prisma.$queryRawUnsafe<any[]>("SELECT event_type,event_data,created_at FROM makemymuse.creation_history WHERE session_id=$1 ORDER BY created_at ASC",id);
    return res.json({success:true,data:{sessionId:id,events}});
  }catch(e:any){return res.status(500).json({success:false,message:e?.message||"History retrieval failed."});}
});



router.delete("/sessions/:id", auth, async (req: AuthRequest, res: Response) => {
  try {
    const uid=userId(req);const id=req.params.id;
    const session=await prisma.$queryRawUnsafe<any[]>("SELECT id,reference_public_id,final_model_public_id FROM makemymuse.creation_sessions WHERE id=$1 AND user_id=$2",id,uid);
    if(!session.length)return res.status(404).json({success:false,message:"Muse session not found."});
    const assets=await prisma.$queryRawUnsafe<any[]>("SELECT collage_public_id AS cloudinary_public_id FROM makemymuse.face_generation_batches WHERE session_id=$1 UNION SELECT cloudinary_public_id FROM makemymuse.face_candidates c JOIN makemymuse.face_generation_batches b ON b.id=c.batch_id WHERE b.session_id=$1 UNION SELECT preview_public_id FROM makemymuse.face_refinements r JOIN makemymuse.face_candidates c ON c.id=r.candidate_id JOIN makemymuse.face_generation_batches b ON b.id=c.batch_id WHERE b.session_id=$1 UNION SELECT cloudinary_public_id FROM makemymuse.model_assets WHERE session_id=$1",id);
    const ids=[session[0].reference_public_id,session[0].final_model_public_id,...assets.map((a:any)=>a.cloudinary_public_id)].filter(Boolean);
    const unique=[...new Set(ids)];
    const results=await Promise.all(unique.map(async (publicId:string)=>{
      try{return await cloudinary.uploader.destroy(publicId,{resource_type:"image",type:"authenticated"});}
      catch(error:any){return {result:"error",error:error?.message||"Cloudinary delete failed",publicId};}
    }));
    const failures=results.filter((r:any)=>r.result!=="ok"&&r.result!=="not found");
    if(failures.length)return res.status(502).json({success:false,message:"Some private assets could not be deleted. Session retained so deletion can be retried.",failures});
    await prisma.$executeRawUnsafe("DELETE FROM makemymuse.creation_sessions WHERE id=$1 AND user_id=$2",id,uid);
    return res.json({success:true,data:{deleted:true,assetCount:unique.length}});
  }catch(e:any){return res.status(500).json({success:false,message:e?.message||"Muse deletion failed."});}
});

router.get("/muses", auth, async (req: AuthRequest, res: Response) => {
  try {
    const uid=userId(req);
    const rows=await prisma.$queryRawUnsafe<any[]>("SELECT id,muse_name,final_model_url,selected_body_type,created_at,updated_at FROM makemymuse.creation_sessions WHERE user_id=$1 AND status='SAVED' ORDER BY created_at DESC",uid);
    return res.json({success:true,data:{muses:rows.map((r:any)=>({id:r.id,name:r.muse_name,image:r.final_model_url,body:r.selected_body_type,created:r.created_at,updatedAt:r.updated_at}))}});
  }catch(e:any){return res.status(500).json({success:false,message:e?.message||"Muse collection retrieval failed."});}
});

router.get("/sessions/:id/certificate", auth, async (req: AuthRequest, res: Response) => {
  try {
    const uid=userId(req);const id=req.params.id;
    const sessions=await prisma.$queryRawUnsafe<any[]>("SELECT id,user_id,muse_name,status,created_at,updated_at,reference_public_id FROM makemymuse.creation_sessions WHERE id=$1 AND user_id=$2",id,uid);
    if(!sessions.length)return res.status(404).json({success:false,message:"Session not found."});
    const events=await prisma.$queryRawUnsafe<any[]>("SELECT event_type,event_data,created_at FROM makemymuse.creation_history WHERE session_id=$1 ORDER BY created_at ASC",id);
    const candidates=await prisma.$queryRawUnsafe<any[]>("SELECT b.id AS batch_id,b.provider,b.model_name,b.age_appearance,b.gender_presentation,b.collage_public_id,c.candidate_number,c.cloudinary_public_id,c.is_selected FROM makemymuse.face_generation_batches b JOIN makemymuse.face_candidates c ON c.batch_id=b.id WHERE b.session_id=$1 ORDER BY b.created_at ASC,c.candidate_number ASC",id);
    const assets=await prisma.$queryRawUnsafe<any[]>("SELECT asset_type,cloudinary_public_id,metadata,created_at FROM makemymuse.model_assets WHERE session_id=$1 ORDER BY created_at ASC",id);
    const session=sessions[0];
    const manifest={
      schemaVersion:"makemymuse-certificate-v1",
      product:"MakeMyMuse",
      creationId:session.id,
      creatorAccountId:session.user_id,
      museName:session.muse_name,
      status:session.status,
      createdAt:session.created_at,
      lastUpdatedAt:session.updated_at,
      referenceAssetId:session.reference_public_id,
      referenceSha256:events.find((e:any)=>e.event_type==="REFERENCE_UPLOADED")?.event_data?.referenceSha256||null,
      consentVersion:events.find((e:any)=>e.event_type==="REFERENCE_UPLOADED")?.event_data?.consentVersion||null,
      generationBatches:candidates.length?Array.from(new Set(candidates.map((c:any)=>c.batch_id))).map(batchId=>{
        const rows=candidates.filter((c:any)=>c.batch_id===batchId);
        const event=events.find((e:any)=>e.event_type==="CANDIDATES_GENERATED"&&e.event_data?.batchId===batchId);
        return {batchId,provider:rows[0]?.provider,model:rows[0]?.model_name,genderPresentation:rows[0]?.gender_presentation,apparentAge:rows[0]?.age_appearance,collageAssetId:rows[0]?.collage_public_id,candidates:rows.map((r:any)=>({number:r.candidate_number,assetId:r.cloudinary_public_id,selected:r.is_selected,sha256:event?.event_data?.candidateAssets?.find((a:any)=>a.candidateNumber===r.candidate_number)?.sha256||null})),promptVersion:event?.event_data?.promptVersion||null,promptHash:event?.event_data?.promptHash||null}):[],
      refinementEvents:events.filter((e:any)=>e.event_type==="REFINEMENT_PREVIEW_GENERATED").map((e:any)=>e.event_data),
      approvalEvents:events.filter((e:any)=>e.event_type==="FACE_APPROVED").map((e:any)=>e.event_data),
      finalAssets:assets,
      creationEvents:events.map((e:any)=>({type:e.event_type,createdAt:e.created_at,data:e.event_data})),
      licenseStatus:"CREATION_RECORD_ONLY_LICENSE_TERMS_PENDING",licenseNote:"This record documents the creation process and stored assets. It is not a guarantee of global uniqueness, copyright ownership, or patent protection. Exclusive license terms are not issued until legally reviewed terms are approved and accepted."
    };
    const manifestHash=sha256Text(JSON.stringify(manifest));
    const signature=signCertificateHash(manifestHash);
    return res.json({success:true,data:{manifest,manifestHash,...signature}});
  }catch(e:any){return res.status(500).json({success:false,message:e?.message||"Certificate generation failed."});}
});

export default router;
