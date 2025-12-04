import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Recipe, GroceryItem } from '@/types/recipe';
import { v4 as uuidv4 } from 'uuid';

interface RecipeContextType {
  recipes: Recipe[];
  groceryList: GroceryItem[];
  addRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRecipe: (id: string, recipe: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  toggleFavorite: (id: string) => void;
  addToGroceryList: (recipe: Recipe) => void;
  removeFromGroceryList: (id: string) => void;
  toggleGroceryItem: (id: string) => void;
  clearGroceryList: () => void;
  clearCheckedItems: () => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

const SAMPLE_RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Classic Spaghetti Carbonara',
    description: 'A creamy Italian pasta dish with eggs, cheese, and pancetta',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800',
    ingredients: [
      { id: '1', name: 'Spaghetti', quantity: 400, unit: 'g' },
      { id: '2', name: 'Pancetta', quantity: 200, unit: 'g' },
      { id: '3', name: 'Eggs', quantity: 4, unit: 'piece' },
      { id: '4', name: 'Parmesan cheese', quantity: 100, unit: 'g' },
      { id: '5', name: 'Black pepper', quantity: 1, unit: 'tsp' },
    ],
    steps: [
      { id: '1', order: 1, instruction: 'Bring a large pot of salted water to boil and cook spaghetti according to package directions.' },
      { id: '2', order: 2, instruction: 'While pasta cooks, cut pancetta into small cubes and fry until crispy.' },
      { id: '3', order: 3, instruction: 'Whisk eggs with grated Parmesan and black pepper in a bowl.' },
      { id: '4', order: 4, instruction: 'Drain pasta, reserving 1 cup of pasta water. Immediately toss with pancetta.' },
      { id: '5', order: 5, instruction: 'Remove from heat and quickly stir in egg mixture, adding pasta water as needed.' },
    ],
    tags: ['Dinner', 'Italian', 'Comfort Food'],
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    difficulty: 'Medium',
    isFavorite: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Avocado Toast with Poached Eggs',
    description: 'A simple yet delicious breakfast that never disappoints',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800',
    ingredients: [
      { id: '1', name: 'Sourdough bread', quantity: 2, unit: 'slice' },
      { id: '2', name: 'Ripe avocado', quantity: 1, unit: 'piece' },
      { id: '3', name: 'Eggs', quantity: 2, unit: 'piece' },
      { id: '4', name: 'Cherry tomatoes', quantity: 6, unit: 'piece' },
      { id: '5', name: 'Red pepper flakes', quantity: 1, unit: 'pinch' },
    ],
    steps: [
      { id: '1', order: 1, instruction: 'Toast the sourdough bread until golden and crispy.' },
      { id: '2', order: 2, instruction: 'Mash avocado with a fork, season with salt and pepper.' },
      { id: '3', order: 3, instruction: 'Poach eggs in simmering water with a splash of vinegar for 3-4 minutes.' },
      { id: '4', order: 4, instruction: 'Spread mashed avocado on toast, top with poached eggs.' },
      { id: '5', order: 5, instruction: 'Garnish with halved cherry tomatoes and red pepper flakes.' },
    ],
    tags: ['Breakfast', 'Healthy', 'Quick Meal', 'Vegetarian'],
    prepTime: 5,
    cookTime: 10,
    servings: 1,
    difficulty: 'Easy',
    isFavorite: false,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '3',
    title: 'Thai Green Curry',
    description: 'Aromatic and spicy Thai curry with vegetables and coconut milk',
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800',
    ingredients: [
      { id: '1', name: 'Chicken breast', quantity: 500, unit: 'g' },
      { id: '2', name: 'Coconut milk', quantity: 400, unit: 'ml' },
      { id: '3', name: 'Green curry paste', quantity: 3, unit: 'tbsp' },
      { id: '4', name: 'Thai basil', quantity: 1, unit: 'cup' },
      { id: '5', name: 'Bell peppers', quantity: 2, unit: 'piece' },
    ],
    steps: [
      { id: '1', order: 1, instruction: 'Cut chicken into bite-sized pieces and slice bell peppers.' },
      { id: '2', order: 2, instruction: 'Heat oil in a wok, fry curry paste until fragrant.' },
      { id: '3', order: 3, instruction: 'Add coconut milk and bring to a simmer.' },
      { id: '4', order: 4, instruction: 'Add chicken and vegetables, cook for 15 minutes.' },
      { id: '5', order: 5, instruction: 'Stir in Thai basil and serve over jasmine rice.' },
    ],
    tags: ['Dinner', 'Asian', 'Gluten-Free'],
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    difficulty: 'Medium',
    isFavorite: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
];

export function RecipeProvider({ children }: { children: ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem('recipes');
    return saved ? JSON.parse(saved) : SAMPLE_RECIPES;
  });

  const [groceryList, setGroceryList] = useState<GroceryItem[]>(() => {
    const saved = localStorage.getItem('groceryList');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('recipes', JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem('groceryList', JSON.stringify(groceryList));
  }, [groceryList]);

  const addRecipe = (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRecipe: Recipe = {
      ...recipe,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setRecipes(prev => [newRecipe, ...prev]);
  };

  const updateRecipe = (id: string, updates: Partial<Recipe>) => {
    setRecipes(prev =>
      prev.map(recipe =>
        recipe.id === id
          ? { ...recipe, ...updates, updatedAt: new Date() }
          : recipe
      )
    );
  };

  const deleteRecipe = (id: string) => {
    setRecipes(prev => prev.filter(recipe => recipe.id !== id));
  };

  const toggleFavorite = (id: string) => {
    setRecipes(prev =>
      prev.map(recipe =>
        recipe.id === id
          ? { ...recipe, isFavorite: !recipe.isFavorite }
          : recipe
      )
    );
  };

  const addToGroceryList = (recipe: Recipe) => {
    const newItems: GroceryItem[] = recipe.ingredients.map(ing => ({
      id: uuidv4(),
      name: ing.name,
      quantity: ing.quantity,
      unit: ing.unit,
      checked: false,
      recipeId: recipe.id,
      recipeName: recipe.title,
    }));
    setGroceryList(prev => [...prev, ...newItems]);
  };

  const removeFromGroceryList = (id: string) => {
    setGroceryList(prev => prev.filter(item => item.id !== id));
  };

  const toggleGroceryItem = (id: string) => {
    setGroceryList(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const clearGroceryList = () => {
    setGroceryList([]);
  };

  const clearCheckedItems = () => {
    setGroceryList(prev => prev.filter(item => !item.checked));
  };

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        groceryList,
        addRecipe,
        updateRecipe,
        deleteRecipe,
        toggleFavorite,
        addToGroceryList,
        removeFromGroceryList,
        toggleGroceryItem,
        clearGroceryList,
        clearCheckedItems,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipes() {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
}
