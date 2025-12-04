import { useRecipes } from '@/context/RecipeContext';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Plus, ChefHat, Search, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Index = () => {
  const { recipes } = useRecipes();
  const favoriteRecipes = recipes.filter(r => r.isFavorite);
  const recentRecipes = recipes.slice(0, 4);

  return (
    <AppLayout>
      <div className="px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <p className="text-sm text-muted-foreground">Welcome back</p>
            <h1 className="text-2xl font-display font-bold text-foreground">
              What's cooking today?
            </h1>
          </div>
          <Link to="/search">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Search className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3 mb-8"
        >
          <Link to="/create">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="gradient-warm p-4 rounded-2xl flex items-center gap-3 shadow-card-hover"
            >
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Plus className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-primary-foreground">New Recipe</p>
                <p className="text-xs text-primary-foreground/80">Create your own</p>
              </div>
            </motion.div>
          </Link>
          <Link to="/recipes">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="gradient-sage p-4 rounded-2xl flex items-center gap-3 shadow-card"
            >
              <div className="w-10 h-10 rounded-full bg-secondary-foreground/10 flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-secondary-foreground">My Recipes</p>
                <p className="text-xs text-secondary-foreground/70">{recipes.length} saved</p>
              </div>
            </motion.div>
          </Link>
        </motion.div>

        {/* Favorites Section */}
        {favoriteRecipes.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-display font-semibold text-foreground">
                  Favorites
                </h2>
              </div>
              <Link to="/recipes?filter=favorites">
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  See all
                </Button>
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {favoriteRecipes.slice(0, 5).map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} variant="featured" />
              ))}
            </div>
          </motion.section>
        )}

        {/* Recent Recipes */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display font-semibold text-foreground">
              Recent Recipes
            </h2>
            <Link to="/recipes">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                See all
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {recentRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} variant="compact" />
            ))}
          </div>

          {recipes.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <ChefHat className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                No recipes yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Start by creating your first recipe
              </p>
              <Link to="/create">
                <Button className="gradient-warm border-0 text-primary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Recipe
                </Button>
              </Link>
            </div>
          )}
        </motion.section>
      </div>
    </AppLayout>
  );
};

export default Index;
