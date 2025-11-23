import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { UploadView } from './components/UploadView';
import { RecipeList } from './components/RecipeList';
import { CookingMode } from './components/CookingMode';
import { ShoppingList } from './components/ShoppingList';
import { analyzeFridgeAndSuggestRecipes } from './services/geminiService';
import { Recipe, DietaryFilterType, ViewState } from './types';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [view, setView] = useState<ViewState>('upload');
  const [dietaryFilter, setDietaryFilter] = useState<DietaryFilterType>('None');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [detectedIngredients, setDetectedIngredients] = useState<string[]>([]);
  const [shoppingList, setShoppingList] = useState<string[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Handlers
  const handleImageSelect = useCallback(async (base64: string) => {
    setIsAnalyzing(true);
    setError(undefined);
    try {
      const result = await analyzeFridgeAndSuggestRecipes(base64, dietaryFilter);
      setDetectedIngredients(result.identifiedIngredients);
      setRecipes(result.recipes);
      setView('recipes');
    } catch (err) {
      setError("Failed to analyze image. Please try again.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [dietaryFilter]);

  const handleRecipeSelect = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setView('cooking');
  };

  const handleAddToShoppingList = (items: string[]) => {
    setShoppingList(prev => {
      const newItems = items.filter(item => !prev.includes(item));
      return [...prev, ...newItems];
    });
  };

  const handleRemoveShoppingItem = (item: string) => {
    setShoppingList(prev => prev.filter(i => i !== item));
  };

  const handleClearShoppingList = () => {
    setShoppingList([]);
  };

  // Render helper
  const renderView = () => {
    switch (view) {
      case 'upload':
        return <UploadView onImageSelect={handleImageSelect} isAnalyzing={isAnalyzing} error={error} />;
      case 'recipes':
        return (
          <RecipeList 
            recipes={recipes} 
            onSelectRecipe={handleRecipeSelect} 
            detectedIngredients={detectedIngredients}
          />
        );
      case 'cooking':
        if (!selectedRecipe) return setView('recipes');
        return (
          <CookingMode 
            recipe={selectedRecipe} 
            onBack={() => setView('recipes')}
            onAddToShoppingList={handleAddToShoppingList}
            shoppingList={shoppingList}
          />
        );
      case 'shopping':
        return (
          <ShoppingList 
            items={shoppingList} 
            onRemoveItem={handleRemoveShoppingItem}
            onClearList={handleClearShoppingList}
          />
        );
      default:
        return <UploadView onImageSelect={handleImageSelect} isAnalyzing={isAnalyzing} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 z-40 md:hidden">
        <button 
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 bg-white rounded-lg shadow-sm border border-slate-200"
        >
          <Menu className="w-6 h-6 text-slate-600" />
        </button>
      </div>

      <Sidebar 
        currentView={view} 
        setCurrentView={setView}
        dietaryFilter={dietaryFilter}
        setDietaryFilter={setDietaryFilter}
        shoppingListCount={shoppingList.length}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      <main className="flex-1 h-full relative overflow-hidden">
        {renderView()}
      </main>
    </div>
  );
};

export default App;