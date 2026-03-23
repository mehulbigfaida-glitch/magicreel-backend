export type AvatarGender = "male" | "female" | "kids";
export type BodyType = "AVERAGE" | "PLUS";

export type AvatarEntry = {
  gender: AvatarGender;
  bodyType: BodyType;
  front: string;
  back: string;
  placeholder: string;
};

export const AVATAR_REGISTRY: Record<string, AvatarEntry> = {
  // ======================
  // MALE – AVERAGE
  // ======================

  RAHUL: {
    gender: "male",
    bodyType: "AVERAGE",
    front: "https://res.cloudinary.com/duaqfspwa/image/upload/v1770791269/Rahul_face.png",
    back: "https://res.cloudinary.com/duaqfspwa/image/upload/v1771216710/Rahul_bsck_face_gkgbbn.png",
    placeholder: "https://res.cloudinary.com/duaqfspwa/image/upload/v1768820608/Rahul_placeholder_drgqjf.png"
  },

  VIJAY: {
    gender: "male",
    bodyType: "AVERAGE",
    front: "https://res.cloudinary.com/duaqfspwa/image/upload/v1771258177/Vijay_face_ffivjk.png",
    back: "https://res.cloudinary.com/duaqfspwa/image/upload/v1771258176/Vijay_back_face_agqjk2.png",
    placeholder: "https://res.cloudinary.com/duaqfspwa/image/upload/v1771258180/Vijay_face_placeholder_xafqyc.png"
  },

  // ======================
  // FEMALE – AVERAGE
  // ======================

  RIYA: {
    gender: "female",
    bodyType: "AVERAGE",
    front: "https://res.cloudinary.com/duaqfspwa/image/upload/v1768821500/Riya_face.png",
    back: "https://res.cloudinary.com/duaqfspwa/image/upload/v1768821501/Riya_back.png",
    placeholder: "https://res.cloudinary.com/duaqfspwa/image/upload/v1768821502/Riya_placeholder.png"
  },

  SHANAYA: {
    gender: "female",
    bodyType: "AVERAGE",
    front: "https://res.cloudinary.com/duaqfspwa/image/upload/v1771245612/Shanaya_face_zmcu8k.png",
    back: "https://res.cloudinary.com/duaqfspwa/image/upload/v1771245612/Shanaya_back_face_npsr0b.png",
    placeholder: "https://res.cloudinary.com/duaqfspwa/image/upload/v1771245614/Shanaya_face_placeholder_s8ulmz.png"
  },

  SHARON: {
    gender: "female",
    bodyType: "AVERAGE",
    front: "https://res.cloudinary.com/duaqfspwa/image/upload/v1771245619/Sharon_face_rdxlou.png",
    back: "https://res.cloudinary.com/duaqfspwa/image/upload/v1771245615/Sharon_back_face_syvsm8.png",
    placeholder: "https://res.cloudinary.com/duaqfspwa/image/upload/v1771245621/Sharon_face_placeholder_frxcvq.png"
  },

  // ======================
  // FEMALE – PLUS
  // ======================

  TANVI_PLUS: {
    gender: "female",
    bodyType: "PLUS",
    front: "https://res.cloudinary.com/duaqfspwa/image/upload/v1768821822/Tanvi_plus_face_cg1urs.png",
    back: "https://res.cloudinary.com/duaqfspwa/image/upload/v1771230801/Tanvi_plus_back_paryyg.png",
    placeholder: "https://res.cloudinary.com/duaqfspwa/image/upload/v1768821608/Tanvi_plus_placeholder_z5uhay.png"
  },

  DOLLY_PLUS: {
    gender: "female",
    bodyType: "PLUS",
    front: "https://res.cloudinary.com/duaqfspwa/image/upload/v1771245471/Dolly_plus_face_ebdhul.png",
    back: "https://res.cloudinary.com/duaqfspwa/image/upload/v1771245609/Dolly_plus_back_hkhbr0.png",
    placeholder: "https://res.cloudinary.com/duaqfspwa/image/upload/v1771245472/Dolly_plus_placeholder_mmy7p3.png"
  }
};
