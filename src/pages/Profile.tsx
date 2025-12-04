import { useRecipes } from '@/context/RecipeContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { ChefHat, Heart, ShoppingCart, Clock, Settings, HelpCircle, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { recipes, groceryList } = useRecipes();

  const stats = [
    {
      icon: ChefHat,
      label: 'Recipes',
      value: recipes.length,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      icon: Heart,
      label: 'Favorites',
      value: recipes.filter(r => r.isFavorite).length,
      color: 'text-destructive',
      bg: 'bg-destructive/10',
    },
    {
      icon: ShoppingCart,
      label: 'Grocery Items',
      value: groceryList.length,
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
  ];

  const totalCookTime = recipes.reduce((acc, r) => acc + r.prepTime + r.cookTime, 0);

  return (
    <AppLayout>
      <div className="px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 mx-auto mb-4 rounded-full gradient-warm flex items-center justify-center shadow-card-hover">
            <ChefHat className="w-12 h-12 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Home Chef
          </h1>
          <p className="text-muted-foreground">Recipe enthusiast</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="bg-card rounded-xl p-4 shadow-card text-center"
            >
              <div className={`w-10 h-10 mx-auto mb-2 rounded-full ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Total Time */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl p-4 shadow-card mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
              <Clock className="w-6 h-6 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total cooking time</p>
              <p className="text-lg font-semibold text-foreground">
                {Math.floor(totalCookTime / 60)}h {totalCookTime % 60}m
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-2 mb-8"
        >
          <Link to="/recipes?filter=favorites">
            <Button variant="ghost" className="w-full justify-start h-12">
              <Heart className="w-5 h-5 mr-3 text-destructive" />
              <span>Favorite Recipes</span>
            </Button>
          </Link>
          <Button variant="ghost" className="w-full justify-start h-12">
            <Star className="w-5 h-5 mr-3 text-accent" />
            <span>Rate the App</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start h-12">
            <HelpCircle className="w-5 h-5 mr-3 text-muted-foreground" />
            <span>Help & Support</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start h-12">
            <Settings className="w-5 h-5 mr-3 text-muted-foreground" />
            <span>Settings</span>
          </Button>
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-muted-foreground"
        >
          <p>Simple Recipe Maker v1.0</p>
          <p className="text-xs mt-1">Made with ❤️ for home chefs</p>
        </motion.div>
      </div>
    </AppLayout>
  );
}
