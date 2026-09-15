export type SubjectId = 'biology' | 'physics' | 'chemistry';

export type ResourceTypeId = 
  | 'short-notes' 
  | 'revision-material' 
  | 'mind-map' 
  | 'study-plan' 
  | 'formula-sheet'
  | 'question-bank'
  | 'video';

export type FileFormat = 'pdf' | 'link' | 'image' | 'video';

export interface NEETResource {
  id: string;
  title: string;
  subject: SubjectId;
  subCategory?: string; // e.g. "Botany", "Zoology", "Physical Chemistry", "Mechanics"
  classLevel: 11 | 12;
  chapter: string;
  unitName: string;
  type: ResourceTypeId;
  description: string;
  url: string; // Cloudflare R2 direct URL
  fileType: FileFormat;
  fileSize?: string;
  pageCount?: number;
  readTimeMinutes?: number;
  isHighYield?: boolean;
  isNCERTVerified?: boolean;
  tags: string[];
  updatedAt: string;
  status: 'active' | 'archived';
}

export interface SubjectMeta {
  id: SubjectId;
  name: string;
  tagline: string;
  accentColor: {
    light: string;
    dark: string;
  };
  ncertUnits: string[];
}
