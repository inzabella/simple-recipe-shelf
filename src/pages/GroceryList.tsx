import { useRecipes } from '@/context/RecipeContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingCart, Trash2, Share2, Plus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function GroceryList() {
  const { groceryList, toggleGroceryItem, removeFromGroceryList, clearGroceryList, clearCheckedItems } = useRecipes();

  const checkedCount = groceryList.filter(item => item.checked).length;
  const uncheckedItems = groceryList.filter(item => !item.checked);
  const checkedItems = groceryList.filter(item => item.checked);

  const handleShare = async () => {
    const text = groceryList
      .filter(item => !item.checked)
      .map(item => `${item.checked ? '✓' : '○'} ${item.quantity} ${item.unit} ${item.name}`)
      .join('\n');

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Grocery List',
          text: text,
        });
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    }
  };

  const handleClearChecked = () => {
    clearCheckedItems();
    toast.success('Cleared purchased items');
  };

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
            <h1 className="text-2xl font-display font-bold text-foreground">
              Grocery List
            </h1>
            <p className="text-muted-foreground">
              {groceryList.length} item{groceryList.length !== 1 ? 's' : ''} • {checkedCount} purchased
            </p>
          </div>
          {groceryList.length > 0 && (
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
            </Button>
          )}
        </motion.div>

        {/* Progress */}
        {groceryList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(checkedCount / groceryList.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        )}

        {/* Unchecked Items */}
        {uncheckedItems.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <h2 className="text-sm font-medium text-muted-foreground mb-3">To Buy</h2>
            <div className="bg-card rounded-xl shadow-card overflow-hidden">
              <AnimatePresence>
                {uncheckedItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ delay: 0.02 * index }}
                    className={cn(
                      'flex items-center gap-3 p-4',
                      index !== uncheckedItems.length - 1 && 'border-b border-border'
                    )}
                  >
                    <Checkbox
                      checked={item.checked}
                      onCheckedChange={() => toggleGroceryItem(item.id)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">
                        {item.quantity} {item.unit} {item.name}
                      </p>
                      {item.recipeName && (
                        <p className="text-xs text-muted-foreground truncate">
                          From: {item.recipeName}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromGroceryList(item.id)}
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.section>
        )}

        {/* Checked Items */}
        {checkedItems.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-muted-foreground">Purchased</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearChecked}
                className="text-xs text-muted-foreground h-auto py-1"
              >
                Clear all
              </Button>
            </div>
            <div className="bg-card rounded-xl shadow-card overflow-hidden opacity-60">
              <AnimatePresence>
                {checkedItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    className={cn(
                      'flex items-center gap-3 p-4',
                      index !== checkedItems.length - 1 && 'border-b border-border'
                    )}
                  >
                    <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                      <Check className="w-3 h-3 text-secondary-foreground" />
                    </div>
                    <p className="flex-1 text-muted-foreground line-through">
                      {item.quantity} {item.unit} {item.name}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleGroceryItem(item.id)}
                      className="text-xs text-muted-foreground"
                    >
                      Undo
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.section>
        )}

        {/* Empty State */}
        {groceryList.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <ShoppingCart className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-display font-semibold text-lg text-foreground mb-2">
              Your grocery list is empty
            </h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              Add ingredients from any recipe to start building your shopping list
            </p>
          </motion.div>
        )}

        {/* Actions */}
        {groceryList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <Button
              variant="outline"
              onClick={clearGroceryList}
              className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Entire List
            </Button>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
