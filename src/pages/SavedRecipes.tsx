import { useState, useMemo } from 'react';
import { useRecipes } from '@/context/RecipeContext';
import { RecipeCard } from '@/components/recipe/RecipeCard';
import { AppLayout } from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, X, Plus } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TAG_OPTIONS, DIFFICULTY_OPTIONS } from '@/types/recipe';

export default function SavedRecipes() {
  const { recipes } = useRecipes();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  
  const showFavoritesOnly = searchParams.get('filter') === 'favorites';

  const filteredRecipes = useMemo(() => {
    let result = recipes;

    if (showFavoritesOnly) {
      result = result.filter(r => r.isFavorite);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        r =>
          r.title.toLowerCase().includes(query) ||
          r.ingredients.some(i => i.name.toLowerCase().includes(query)) ||
          r.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    if (selectedTags.length > 0) {
      result = result.filter(r =>
        selectedTags.some(tag => r.tags.includes(tag))
      );
    }

    if (selectedDifficulty) {
      result = result.filter(r => r.difficulty === selectedDifficulty);
    }

    return result;
  }, [recipes, searchQuery, selectedTags, selectedDifficulty, showFavoritesOnly]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSelectedDifficulty(null);
    setSearchQuery('');
  };

  const hasActiveFilters = selectedTags.length > 0 || selectedDifficulty || searchQuery;

  return (
    <AppLayout>
      <div className="px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-display font-bold text-foreground">
            {showFavoritesOnly ? 'Favorite Recipes' : 'My Recipes'}
          </h1>
          <p className="text-muted-foreground">
            {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''}
          </p>
        </motion.div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4"
        >
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
            <Button
              variant={showFilters ? 'default' : 'outline'}
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className="shrink-0"
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="bg-card rounded-xl p-4 shadow-card">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-foreground">Filters</span>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-muted-foreground h-auto py-1 px-2"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>

                {/* Difficulty */}
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground mb-2">Difficulty</p>
                  <div className="flex gap-2">
                    {DIFFICULTY_OPTIONS.map(diff => (
                      <Button
                        key={diff}
                        variant={selectedDifficulty === diff ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedDifficulty(
                          selectedDifficulty === diff ? null : diff
                        )}
                        className="text-xs"
                      >
                        {diff}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {TAG_OPTIONS.map(tag => (
                      <Button
                        key={tag}
                        variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleTag(tag)}
                        className="text-xs h-7"
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recipe Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 gap-4"
        >
          {filteredRecipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
            >
              <RecipeCard recipe={recipe} />
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredRecipes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-2">
              No recipes found
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              {hasActiveFilters
                ? 'Try adjusting your filters'
                : 'Start by creating your first recipe'}
            </p>
            {!hasActiveFilters && (
              <Link to="/create">
                <Button className="gradient-warm border-0 text-primary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Recipe
                </Button>
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
