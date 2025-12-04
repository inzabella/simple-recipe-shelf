import { Recipe } from '@/types/recipe';
import { Heart, Clock, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useRecipes } from '@/context/RecipeContext';
import { Link } from 'react-router-dom';

interface RecipeCardProps {
  recipe: Recipe;
  variant?: 'default' | 'compact' | 'featured';
}

export function RecipeCard({ recipe, variant = 'default' }: RecipeCardProps) {
  const { toggleFavorite } = useRecipes();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(recipe.id);
  };

  if (variant === 'compact') {
    return (
      <Link to={`/recipe/${recipe.id}`}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 p-3 bg-card rounded-xl shadow-card hover:shadow-card-hover transition-shadow"
        >
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
            {recipe.image ? (
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">
                🍽️
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-foreground truncate">
              {recipe.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <Clock className="w-3 h-3" />
              <span>{recipe.prepTime + recipe.cookTime} min</span>
              <span>•</span>
              <span>{recipe.difficulty}</span>
            </div>
          </div>
          <button
            onClick={handleFavoriteClick}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <Heart
              className={cn(
                'w-5 h-5 transition-colors',
                recipe.isFavorite
                  ? 'fill-primary text-primary'
                  : 'text-muted-foreground'
              )}
            />
          </button>
        </motion.div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link to={`/recipe/${recipe.id}`}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative w-72 h-48 rounded-2xl overflow-hidden shadow-card-hover flex-shrink-0"
        >
          <div className="absolute inset-0 bg-muted">
            {recipe.image ? (
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-warm">
                🍽️
              </div>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3 className="font-display font-semibold text-card text-lg leading-tight">
              {recipe.title}
            </h3>
            <div className="flex items-center gap-3 text-xs text-card/80 mt-2">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{recipe.prepTime + recipe.cookTime} min</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{recipe.servings} servings</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 rounded-full bg-card/20 backdrop-blur-sm hover:bg-card/40 transition-colors"
          >
            <Heart
              className={cn(
                'w-5 h-5 transition-colors',
                recipe.isFavorite
                  ? 'fill-primary text-primary'
                  : 'text-card'
              )}
            />
          </button>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link to={`/recipe/${recipe.id}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow"
      >
        <div className="aspect-[4/3] relative bg-muted">
          {recipe.image ? (
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-warm">
              🍽️
            </div>
          )}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-colors"
          >
            <Heart
              className={cn(
                'w-5 h-5 transition-colors',
                recipe.isFavorite
                  ? 'fill-primary text-primary'
                  : 'text-muted-foreground'
              )}
            />
          </button>
          <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap">
            {recipe.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-card/90 backdrop-blur-sm rounded-full text-xs font-medium text-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-display font-semibold text-lg text-foreground leading-tight">
            {recipe.title}
          </h3>
          {recipe.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {recipe.description}
            </p>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{recipe.prepTime + recipe.cookTime} min</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>{recipe.servings}</span>
            </div>
            <span className="ml-auto px-2 py-0.5 bg-secondary rounded-full text-xs font-medium text-secondary-foreground">
              {recipe.difficulty}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
