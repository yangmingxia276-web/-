
export type PetCategory = 'Bedding' | 'Toys' | 'Feeding' | 'Walking' | 'Grooming';
export type AmazonSite = 'US' | 'EU' | 'JP' | 'UK';

export type ImageType = 
  | 'MAIN_WHITE' 
  | 'SCENE_LIVING_ROOM' 
  | 'SCENE_OUTDOOR' 
  | 'DETAIL_MATERIAL' 
  | 'DETAIL_SAFETY' 
  | 'SIZE_CHART' 
  | 'FUNCTION_DEMO';

export interface GeneratedImage {
  id: string;
  url: string;
  type: ImageType;
  label: string;
  isCompliant: boolean;
  complianceNotes: string[];
}

export interface GenerationConfig {
  site: AmazonSite;
  category: PetCategory;
  keepPetModel: boolean;
}
