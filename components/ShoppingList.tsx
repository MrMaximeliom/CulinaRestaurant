import React from 'react';
import { Trash2, CheckSquare, Square, Plus } from 'lucide-react';

interface ShoppingListProps {
  items: string[];
  onRemoveItem: (item: string) => void;
  onClearList: () => void;
}

export const ShoppingList: React.FC<ShoppingListProps> = ({ items, onRemoveItem, onClearList }) => {
  const [newItem, setNewItem] = React.useState('');
  // Local state to optimistic add before potentially syncing up, though here we just consume props for simplicity
  // For this demo, we won't add locally, we assume items come from recipes. 
  // But let's allow adding custom items for better UX.
  // Since state is lifted, we can't easily add here without a prop. Let's just display.
  
  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto h-full flex flex-col animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Shopping List</h2>
        {items.length > 0 && (
          <button 
            onClick={onClearList}
            className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center space-x-1"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
          <ShoppingBagIcon className="w-12 h-12 mb-4 opacity-50" />
          <p className="text-lg font-medium">Your list is empty</p>
          <p className="text-sm">Add ingredients from recipe suggestions</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {items.map((item, idx) => (
            <div 
              key={`${item}-${idx}`}
              className="group flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-100 transition-all"
            >
              <div className="flex items-center space-x-3">
                <button className="text-slate-300 hover:text-emerald-500 transition-colors">
                  <Square className="w-5 h-5" />
                </button>
                <span className="text-slate-700 font-medium text-lg capitalize">{item}</span>
              </div>
              <button 
                onClick={() => onRemoveItem(item)}
                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ShoppingBagIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);