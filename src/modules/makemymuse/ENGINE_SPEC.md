# MakeMyMuse Identity Transformation Engine — Engineering Specification

Version: 0.1 (execution baseline)
Status: Prototype implementation target; generation provider/model settings remain environment-controlled and must be verified before paid integration.

## Product objective
Create a reusable, fictional fashion-model Muse inspired by a user-authorized reference. The product balances user-directed resemblance with creative transformation and records the creation process. It must not promise global uniqueness, copyright ownership, or patent protection.

## Pipeline
1. Reference upload: validate file type/size, private storage, ownership metadata, explicit authorization/consent.
2. Identity Blueprint: show the user's reference image with a visual creative-reference overlay. No fake biometric measurements or claims of automated facial analysis.
3. Creative Direction: Female/Male/Androgynous; apparent age 18–60; skin appearance direction; transformation intensity/creative direction.
4. Prompt Assembly: versioned structured brief and deterministic prompt compiler. Preserve user-selected constraints and record prompt version/hash. Use no ethnicity/nationality stereotypes or candidate labels that prescribe race/ethnicity.
5. Generation: one provider request for a 4x2 collage, exactly eight equal cells, consistent framing/background. Provider/model are explicit configuration; no silent fallback.
6. Candidate extraction: validate dimensions and crop eight equal cells with calibrated safe inset; persist original collage and each crop privately; candidate numbering is deterministic.
7. Candidate QA: verify image load, dimensions, one portrait per cell, face present, no grid bleed, and consistency with selected presentation. Automated checks are QA signals only, not biometric identity or legal uniqueness proof. Failed candidates must be marked and shown as failures; never broken-image placeholders.
8. Selection: persist chosen candidate, candidate ID and timestamp.
9. Refinement: build a new prompt from selected candidate + structured options; generate an actual preview; preserve original and all previews; explicit apply/reject.
10. Approval: user explicitly approves a candidate or accepted refinement. Persist immutable approval event.
11. Body/model generation: selected face is the reference; body direction and composition are controlled. Keep face identity reference locked in the request. Preserve generation asset IDs and prompt version.
12. Reveal/name/save: save final Muse asset, session state, and creation record.
13. Certificate/provenance export: create a user-facing record of the creation history, assets, timestamps, prompt version, generation model/provider, approvals and hashes. Describe hashes as integrity evidence, not uniqueness/copyright proof.

## Prompt compilation
Inputs: source asset ID (never client-trusted URL), genderPresentation, ageAppearance, skinDirection, transformationDirection, refinement options, promptVersion, outputLayout.
Output: prompt text plus structured prompt manifest.
The prompt compiler must:
- state the task as creating a fictional fashion model inspired by authorized reference;
- preserve broad, user-selected resemblance anchors without claiming biometric measurements;
- make gender presentation and apparent age explicit for all eight cells;
- apply a consistent shared instruction to every cell;
- ask for eight distinct creative interpretations, not unrelated identities or repeated variants;
- define each cell's creative variation as an attribute axis (feature balance, expression, styling, hair, editorial direction) without assigning race/ethnicity/nationality;
- enforce frontal head-and-shoulders framing, one face/cell, consistent scale, neutral background, no text/logo/watermark;
- include a strict 4-column x 2-row layout and clean cell separation;
- include negative constraints: no mixed/merged faces, no extra faces, no text, no grid decoration, no cropped heads, no duplicate candidates, no under-18 appearance;
- be versioned and hashable.

## Provenance manifest
Record creation/session ID, user ID, reference asset ID/hash, consent version/text, user creative choices, prompt version/hash, provider/model/endpoint, generation request ID, generation timestamp, collage asset ID/hash, candidate IDs/hashes and QA states, selection event, refinement option sets and preview asset IDs/hashes, approval event, final model assets and hashes, license record version. Append-only event history where feasible.

## Privacy/security
Private assets by default. Server verifies reference ownership. Consent must be explicit and versioned. No public gallery by default. No training consent by default. Use authenticated/private Cloudinary assets or signed URLs. Apply rate/cost guardrails. Delete/retention workflows must remove related assets and provenance according to policy. Never store raw secrets in prompt manifests or logs.

## Implementation boundary
MakeMyMuse product logic remains in src/modules/makemymuse. Reuse only infrastructure adapters (auth, provider client, Cloudinary, queues, logging) behind interfaces. Do not import MagicReel product generation workflows, credit rules or business logic.

## Acceptance gates
- Type/build pass.
- Reference upload and ownership/consent checks.
- Prompt preview/manifest visible to user/admin (no secrets).
- Eight candidates extracted and privately stored, all image URLs load.
- Selected presentation/age controls honored in all eight.
- Refinement Preview generates a distinct actual image and does not overwrite original.
- Approval persists and is reproducible from history.
- Final model uses selected/approved face reference.
- Provenance record export exists and claims are legally careful.
- No production MagicReel endpoints, tables, or credits changed by MakeMyMuse work.
