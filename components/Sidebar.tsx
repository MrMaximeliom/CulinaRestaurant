import React from 'react';
import { ChefHat, ShoppingCart, Camera, Utensils, Leaf, Salad, Beef, WheatOff } from 'lucide-react';
import { DietaryFilterType, ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
  dietaryFilter: DietaryFilterType;
  setDietaryFilter: (filter: DietaryFilterType) => void;
  shoppingListCount: number;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  dietaryFilter,
  setDietaryFilter,
  shoppingListCount,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const navItems = [
    { id: 'upload', label: 'Scan Fridge', icon: Camera, view: 'upload' as const },
    { id: 'recipes', label: 'Recipes', icon: Utensils, view: 'recipes' as const },
    { id: 'shopping', label: 'Shopping List', icon: ShoppingCart, view: 'shopping' as const, count: shoppingListCount },
  ];

  const filters: { id: DietaryFilterType; label: string; icon: React.ElementType }[] = [
    { id: 'None', label: 'No Restrictions', icon: ChefHat },
    { id: 'Vegetarian', label: 'Vegetarian', icon: Leaf },
    { id: 'Vegan', label: 'Vegan', icon: Salad },
    { id: 'Keto', label: 'Keto', icon: Beef },
    { id: 'Gluten-Free', label: 'Gluten-Free', icon: WheatOff },
  ];

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
    md:translate-x-0 md:static md:inset-auto md:block
  `;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={sidebarClasses}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center space-x-2 mb-10">
            <div className="bg-emerald-500 p-2 rounded-lg">
              <ChefHat className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">CulinaVision</h1>
          </div>

          <nav className="space-y-2 mb-10">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">Menu</h3>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.view);
                  setIsMobileOpen(false);
                }}
                className={`
                  w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${currentView === item.view 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className="bg-emerald-100 text-emerald-700 py-0.5 px-2 rounded-full text-xs font-bold">
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="space-y-2 flex-1">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">
              Dietary Preferences
            </h3>
            <div className="space-y-1">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setDietaryFilter(filter.id)}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors
                    ${dietaryFilter === filter.id
                      ? 'bg-slate-100 text-slate-900 font-medium'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}
                  `}
                >
                  <filter.icon className="w-4 h-4" />
                  <span>{filter.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-slate-100">
            <div className="bg-emerald-50 p-4 rounded-xl">
              <p className="text-xs text-emerald-800 font-medium mb-1">AI Powered</p>
              <p className="text-xs text-emerald-600/80 leading-relaxed">
                Using Gemini 3 Pro to analyze your ingredients.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};