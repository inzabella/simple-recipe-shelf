export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface RecipeStep {
  id: string;
  order: number;
  instruction: string;
}

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  image?: string;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  tags: string[];
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  notes?: string;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
  recipeId?: string;
  recipeName?: string;
}

export const UNIT_OPTIONS = [
  'tsp', 'tbsp', 'cup', 'oz', 'lb', 'g', 'kg', 'ml', 'L',
  'pinch', 'dash', 'piece', 'slice', 'clove', 'can', 'package'
] as const;

export const TAG_OPTIONS = [
  'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack',
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free',
  'Quick Meal', 'Comfort Food', 'Healthy', 'Keto',
  'Italian', 'Mexican', 'Asian', 'American', 'Mediterranean'
] as const;

export const DIFFICULTY_OPTIONS = ['Easy', 'Medium', 'Hard'] as const;
