
import { ImageType } from './types';

export const PET_IMAGE_PACK: { type: ImageType; label: string; prompt: string }[] = [
  {
    type: 'MAIN_WHITE',
    label: 'Main Image (White BG)',
    prompt: 'Professional Amazon main image. Pure white background (RGB 255,255,255). Product centered, 85% frame coverage. NO pet models, NO extra props. Studio lighting, soft shadows, 4k sharp.'
  },
  {
    type: 'SCENE_LIVING_ROOM',
    label: 'Lifestyle (Indoor)',
    prompt: 'Lifestyle shot in a bright, modern cozy living room. A happy pet (cat or dog depending on size) is naturally using the product. Soft natural window light, photorealistic, 8k.'
  },
  {
    type: 'SCENE_OUTDOOR',
    label: 'Lifestyle (Outdoor)',
    prompt: 'Outdoor scene in a lush green garden or park during golden hour. Cinematic lighting. If it is a walking gear, show it in use. Professional pet photography.'
  },
  {
    type: 'DETAIL_MATERIAL',
    label: 'Material Detail',
    prompt: 'Macro close-up shot focusing on the texture and premium fabric/material of the pet product. Show high-quality stitching and durability. Bokeh background.'
  },
  {
    type: 'DETAIL_SAFETY',
    label: 'Safety Feature',
    prompt: 'Close-up of safety buckles, non-slip bottom, or reinforced parts. Highlighting "Safe for pets" design. Clean studio setting.'
  },
  {
    type: 'SIZE_CHART',
    label: 'Size Comparison',
    prompt: 'The product placed next to a common object (like a smartphone or a standard breed of pet) to show relative size. Minimalist background with clean layout.'
  }
];

export const PET_CATEGORIES: string[] = ['Bedding', 'Toys', 'Feeding', 'Walking', 'Grooming', 'Apparel'];
export const AMAZON_SITES: string[] = ['US', 'EU', 'JP', 'UK', 'DE'];
