import { useParams, useNavigate } from 'react-router-dom';
import { useRecipes } from '@/context/RecipeContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Clock, Users, ChefHat, Share2, ShoppingCart, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { recipes, toggleFavorite, addToGroceryList, deleteRecipe } = useRecipes();

  const recipe = recipes.find(r => r.id === id);

  if (!recipe) {
    return (
      <AppLayout>
        <div className="px-4 py-6 text-center">
          <p className="text-muted-foreground">Recipe not found</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            Go Home
          </Button>
        </div>
      </AppLayout>
    );
  }

  const handleShare = async () => {
    const text = `${recipe.title}\n\nIngredients:\n${recipe.ingredients
      .map(i => `• ${i.quantity} ${i.unit} ${i.name}`)
      .join('\n')}\n\nInstructions:\n${recipe.steps
      .map(s => `${s.order}. ${s.instruction}`)
      .join('\n')}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: recipe.title, text });
      } catch (err) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast.success('Recipe copied to clipboard!');
    }
  };

  const handleAddToGrocery = () => {
    addToGroceryList(recipe);
    toast.success('Added ingredients to grocery list!');
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this recipe?')) {
      deleteRecipe(recipe.id);
      toast.success('Recipe deleted');
      navigate('/recipes');
    }
  };

  return (
    <AppLayout>
      <div className="pb-24">
        {/* Hero Image */}
        <div className="relative h-64 bg-muted">
          {recipe.image ? (
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-8xl gradient-warm">
              🍽️
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          
          {/* Navigation */}
          <div className="absolute top-4 left-4 right-4 flex justify-between">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full bg-card/80 backdrop-blur-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={handleShare}
                className="rounded-full bg-card/80 backdrop-blur-sm"
              >
                <Share2 className="w-5 h-5" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => toggleFavorite(recipe.id)}
                className="rounded-full bg-card/80 backdrop-blur-sm"
              >
                <Heart
                  className={cn(
                    'w-5 h-5',
                    recipe.isFavorite && 'fill-primary text-primary'
                  )}
                />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 -mt-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl shadow-elevated p-5"
          >
            {/* Title & Tags */}
            <h1 className="text-2xl font-display font-bold text-foreground mb-2">
              {recipe.title}
            </h1>
            {recipe.description && (
              <p className="text-muted-foreground mb-4">{recipe.description}</p>
            )}
            
            {/* Tags */}
            {recipe.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {recipe.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 bg-secondary rounded-full text-xs font-medium text-secondary-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{recipe.prepTime + recipe.cookTime} min</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>{recipe.servings} servings</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ChefHat className="w-4 h-4" />
                <span>{recipe.difficulty}</span>
              </div>
            </div>
          </motion.div>

          {/* Ingredients */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-semibold text-foreground">
                Ingredients
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddToGrocery}
                className="gap-1.5"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to List
              </Button>
            </div>
            <div className="bg-card rounded-xl shadow-card p-4">
              <ul className="space-y-2">
                {recipe.ingredients.map((ing) => (
                  <li key={ing.id} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-foreground">
                      <span className="font-medium">{ing.quantity} {ing.unit}</span>{' '}
                      {ing.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>

          {/* Instructions */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6"
          >
            <h2 className="text-lg font-display font-semibold text-foreground mb-4">
              Instructions
            </h2>
            <div className="space-y-4">
              {recipe.steps.map((step, index) => (
                <div key={step.id} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-foreground pt-1 flex-1">{step.instruction}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Notes */}
          {recipe.notes && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6"
            >
              <h2 className="text-lg font-display font-semibold text-foreground mb-3">
                Notes
              </h2>
              <div className="bg-secondary/50 rounded-xl p-4">
                <p className="text-foreground">{recipe.notes}</p>
              </div>
            </motion.section>
          )}

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex gap-3"
          >
            <Button
              variant="outline"
              onClick={handleDelete}
              className="flex-1 text-destructive border-destructive/30 hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
            <Button
              onClick={handleAddToGrocery}
              className="flex-1 gradient-warm border-0 text-primary-foreground"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Grocery
            </Button>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
