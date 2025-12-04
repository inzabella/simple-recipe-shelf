import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipes } from '@/context/RecipeContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Trash2, GripVertical, Clock, Users, ChefHat } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { Ingredient, RecipeStep, TAG_OPTIONS, UNIT_OPTIONS, DIFFICULTY_OPTIONS } from '@/types/recipe';
import { cn } from '@/lib/utils';

export default function CreateRecipe() {
  const navigate = useNavigate();
  const { addRecipe } = useRecipes();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: uuidv4(), name: '', quantity: 1, unit: 'cup' },
  ]);
  const [steps, setSteps] = useState<RecipeStep[]>([
    { id: uuidv4(), order: 1, instruction: '' },
  ]);
  const [tags, setTags] = useState<string[]>([]);
  const [prepTime, setPrepTime] = useState(10);
  const [cookTime, setCookTime] = useState(20);
  const [servings, setServings] = useState(4);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [notes, setNotes] = useState('');

  const addIngredient = () => {
    setIngredients(prev => [
      ...prev,
      { id: uuidv4(), name: '', quantity: 1, unit: 'cup' },
    ]);
  };

  const updateIngredient = (id: string, field: keyof Ingredient, value: string | number) => {
    setIngredients(prev =>
      prev.map(ing => (ing.id === id ? { ...ing, [field]: value } : ing))
    );
  };

  const removeIngredient = (id: string) => {
    if (ingredients.length > 1) {
      setIngredients(prev => prev.filter(ing => ing.id !== id));
    }
  };

  const addStep = () => {
    setSteps(prev => [
      ...prev,
      { id: uuidv4(), order: prev.length + 1, instruction: '' },
    ]);
  };

  const updateStep = (id: string, instruction: string) => {
    setSteps(prev =>
      prev.map(step => (step.id === id ? { ...step, instruction } : step))
    );
  };

  const removeStep = (id: string) => {
    if (steps.length > 1) {
      setSteps(prev =>
        prev
          .filter(step => step.id !== id)
          .map((step, index) => ({ ...step, order: index + 1 }))
      );
    }
  };

  const toggleTag = (tag: string) => {
    setTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error('Please enter a recipe title');
      return;
    }

    const validIngredients = ingredients.filter(ing => ing.name.trim());
    if (validIngredients.length === 0) {
      toast.error('Please add at least one ingredient');
      return;
    }

    const validSteps = steps.filter(step => step.instruction.trim());
    if (validSteps.length === 0) {
      toast.error('Please add at least one step');
      return;
    }

    addRecipe({
      title: title.trim(),
      description: description.trim() || undefined,
      ingredients: validIngredients,
      steps: validSteps.map((step, index) => ({ ...step, order: index + 1 })),
      tags,
      prepTime,
      cookTime,
      servings,
      difficulty,
      notes: notes.trim() || undefined,
      isFavorite: false,
    });

    toast.success('Recipe created successfully!');
    navigate('/recipes');
  };

  return (
    <AppLayout>
      <div className="px-4 py-6 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-display font-bold text-foreground">
            Create Recipe
          </h1>
        </motion.div>

        {/* Form */}
        <div className="space-y-6">
          {/* Basic Info */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="title">Recipe Title</Label>
              <Input
                id="title"
                placeholder="e.g., Grandma's Apple Pie"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="A brief description of your recipe..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1.5 resize-none"
                rows={2}
              />
            </div>
          </motion.section>

          {/* Time & Servings */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-3 gap-3"
          >
            <div>
              <Label className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Prep (min)
              </Label>
              <Input
                type="number"
                min={0}
                value={prepTime}
                onChange={(e) => setPrepTime(Number(e.target.value))}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Cook (min)
              </Label>
              <Input
                type="number"
                min={0}
                value={cookTime}
                onChange={(e) => setCookTime(Number(e.target.value))}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Servings
              </Label>
              <Input
                type="number"
                min={1}
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                className="mt-1.5"
              />
            </div>
          </motion.section>

          {/* Difficulty */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Label className="flex items-center gap-1.5 mb-2">
              <ChefHat className="w-3.5 h-3.5" />
              Difficulty
            </Label>
            <div className="flex gap-2">
              {DIFFICULTY_OPTIONS.map(diff => (
                <Button
                  key={diff}
                  variant={difficulty === diff ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDifficulty(diff)}
                  className="flex-1"
                >
                  {diff}
                </Button>
              ))}
            </div>
          </motion.section>

          {/* Ingredients */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Label className="mb-3 block">Ingredients</Label>
            <div className="space-y-2">
              <AnimatePresence>
                {ingredients.map((ing, index) => (
                  <motion.div
                    key={ing.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Input
                      type="number"
                      min={0}
                      step={0.25}
                      value={ing.quantity}
                      onChange={(e) => updateIngredient(ing.id, 'quantity', Number(e.target.value))}
                      className="w-16 shrink-0"
                    />
                    <select
                      value={ing.unit}
                      onChange={(e) => updateIngredient(ing.id, 'unit', e.target.value)}
                      className="h-10 px-2 rounded-md border border-input bg-background text-sm shrink-0"
                    >
                      {UNIT_OPTIONS.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                    <Input
                      placeholder="Ingredient name"
                      value={ing.name}
                      onChange={(e) => updateIngredient(ing.id, 'name', e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeIngredient(ing.id)}
                      disabled={ingredients.length === 1}
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={addIngredient}
              className="mt-2 w-full"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Ingredient
            </Button>
          </motion.section>

          {/* Steps */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Label className="mb-3 block">Instructions</Label>
            <Reorder.Group values={steps} onReorder={setSteps} className="space-y-2">
              <AnimatePresence>
                {steps.map((step, index) => (
                  <Reorder.Item key={step.id} value={step}>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-start gap-2"
                    >
                      <div className="flex items-center gap-1 pt-2.5">
                        <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center">
                          {index + 1}
                        </span>
                      </div>
                      <Textarea
                        placeholder={`Step ${index + 1}...`}
                        value={step.instruction}
                        onChange={(e) => updateStep(step.id, e.target.value)}
                        className="flex-1 resize-none min-h-[80px]"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStep(step.id)}
                        disabled={steps.length === 1}
                        className="shrink-0 text-muted-foreground hover:text-destructive mt-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </Reorder.Item>
                ))}
              </AnimatePresence>
            </Reorder.Group>
            <Button
              variant="outline"
              size="sm"
              onClick={addStep}
              className="mt-2 w-full"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Step
            </Button>
          </motion.section>

          {/* Tags */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Label className="mb-3 block">Tags</Label>
            <div className="flex flex-wrap gap-1.5">
              {TAG_OPTIONS.map(tag => (
                <Button
                  key={tag}
                  variant={tags.includes(tag) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleTag(tag)}
                  className="text-xs h-7"
                >
                  {tag}
                </Button>
              ))}
            </div>
          </motion.section>

          {/* Notes */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Tips, variations, or special instructions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1.5 resize-none"
              rows={3}
            />
          </motion.section>

          {/* Submit */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <Button
              onClick={handleSubmit}
              className="w-full gradient-warm border-0 text-primary-foreground h-12 text-base font-semibold"
            >
              Save Recipe
            </Button>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
