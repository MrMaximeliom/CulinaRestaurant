import React from 'react';
import { Clock, Flame, AlertTriangle, ChevronRight, ChefHat } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeListProps {
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  detectedIngredients: string[];
}

export const RecipeList: React.FC<RecipeListProps> = ({ recipes, onSelectRecipe, detectedIngredients }) => {
  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
         <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
           <ChefHat className="w-8 h-8 text-slate-400" />
         </div>
         <h3 className="text-xl font-semibold text-slate-700">No recipes yet</h3>
         <p className="text-slate-500 mt-2">Upload a photo of your fridge to get started!</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Recommended for You</h2>
        <div className="flex flex-wrap gap-2 text-sm text-slate-600">
          <span>Found ingredients:</span>
          {detectedIngredients.map((ing, idx) => (
            <span key={idx} className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-700 border border-slate-200">
              {ing}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            onClick={() => onSelectRecipe(recipe)}
            className="group bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-emerald-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
          >
            {/* Card Header/Image Placeholder - Using a pattern or gradient since we don't have real images for generated recipes */}
            <div className="h-32 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 flex flex-col justify-end relative">
              <div className="absolute top-4 right-4">
                <span className={`
                  px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                  ${recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : 
                    recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-red-100 text-red-700'}
                `}>
                  {recipe.difficulty}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 leading-tight group-hover:text-emerald-600 transition-colors">
                {recipe.title}
              </h3>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <p className="text-slate-500 text-sm line-clamp-2 mb-4">{recipe.description}</p>
              
              <div className="flex items-center space-x-4 mb-6 text-sm text-slate-400 font-medium">
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{recipe.prepTime}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Flame className="w-4 h-4" />
                  <span>{recipe.calories} kcal</span>
                </div>
              </div>

              <div className="mt-auto">
                 {recipe.missingIngredients.length > 0 ? (
                   <div className="bg-orange-50 rounded-lg p-3 mb-4">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                        <div className="text-xs">
                          <span className="font-semibold text-orange-800">Missing: </span>
                          <span className="text-orange-700">{recipe.missingIngredients.slice(0, 3).join(', ')}</span>
                          {recipe.missingIngredients.length > 3 && <span className="text-orange-700"> +{recipe.missingIngredients.length - 3} more</span>}
                        </div>
                      </div>
                   </div>
                 ) : (
                   <div className="bg-emerald-50 rounded-lg p-3 mb-4 text-xs text-emerald-700 font-medium flex items-center space-x-2">
                     <ChefHat className="w-4 h-4" />
                     <span>You have all ingredients!</span>
                   </div>
                 )}

                 <button className="w-full py-2.5 flex items-center justify-center space-x-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg text-sm font-medium transition-colors">
                   <span>View Recipe</span>
                   <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};