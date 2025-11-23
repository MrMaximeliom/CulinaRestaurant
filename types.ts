export interface Ingredient {
  name: string;
  amount?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prepTime: string;
  calories: number;
  ingredients: string[];
  missingIngredients: string[];
  steps: string[];
  tags: string[];
}

export interface AnalysisResult {
  identifiedIngredients: string[];
  recipes: Recipe[];
}

export type DietaryFilterType = 'None' | 'Vegetarian' | 'Vegan' | 'Keto' | 'Gluten-Free' | 'Paleo';

export type ViewState = 'upload' | 'analyzing' | 'recipes' | 'cooking' | 'shopping';