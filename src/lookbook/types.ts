export interface LookbookCreateInput {
  jobId: string;
  category: string;
  hasBackImage: boolean;

  // NEW — mandatory for lookbook
  anchorImagePath: string; // temp path or cloudinary URL
}
