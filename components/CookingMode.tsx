import React, { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, CheckCircle, ShoppingBag, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { Recipe } from '../types';

interface CookingModeProps {
  recipe: Recipe;
  onBack: () => void;
  onAddToShoppingList: (items: string[]) => void;
  shoppingList: string[];
}

export const CookingMode: React.FC<CookingModeProps> = ({ recipe, onBack, onAddToShoppingList, shoppingList }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // TTS Handler
  const speakStep = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop previous
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onstart = () => setIsSpeaking(true);
      
      // Pick a nice voice if available
      const voices = window.speechSynthesis.getVoices();
      // Try to find a Google English voice or natural voice
      const preferredVoice = voices.find(v => v.name.includes('Google US English')) || voices[0];
      if (preferredVoice) utterance.voice = preferredVoice;

      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleNextStep = () => {
    if (currentStep < recipe.steps.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      if (isPlaying) {
        speakStep(recipe.steps[next]);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      if (isPlaying) {
        speakStep(recipe.steps[currentStep - 1]);
      }
    }
  };

  const toggleReadAloud = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsSpeaking(false);
    } else {
      setIsPlaying(true);
      speakStep(recipe.steps[currentStep]);
    }
  };

  const progress = ((currentStep + 1) / recipe.steps.length) * 100;

  return (
    <div className="h-full flex flex-col bg-white animate-fade-in">
      {/* Header */}
      <div className="border-b border-slate-100 p-4 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h2 className="font-bold text-slate-800">{recipe.title}</h2>
          <p className="text-xs text-slate-500">Step {currentStep + 1} of {recipe.steps.length}</p>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-slate-100 w-full">
        <div 
          className="h-full bg-emerald-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-6 md:p-10 pb-32">
          
          {/* Missing Ingredients Alert */}
          {currentStep === 0 && recipe.missingIngredients.length > 0 && (
            <div className="mb-8 bg-orange-50 border border-orange-100 rounded-xl p-6">
              <h3 className="font-semibold text-orange-800 mb-2">Missing Essentials</h3>
              <p className="text-sm text-orange-700 mb-4">
                Looks like you need a few things before starting.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {recipe.missingIngredients.map((ing, i) => (
                  <span key={i} className="px-2 py-1 bg-white/50 text-orange-800 rounded text-sm border border-orange-100">
                    {ing}
                  </span>
                ))}
              </div>
              <button
                onClick={() => onAddToShoppingList(recipe.missingIngredients)}
                disabled={recipe.missingIngredients.every(i => shoppingList.includes(i))}
                className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {recipe.missingIngredients.every(i => shoppingList.includes(i)) 
                    ? 'Added to List' 
                    : 'Add All to Shopping List'}
                </span>
              </button>
            </div>
          )}

          {/* Step Content */}
          <div className="min-h-[300px] flex items-center justify-center">
            <p className="text-3xl md:text-4xl font-medium text-slate-800 leading-snug text-center">
              {recipe.steps[currentStep]}
            </p>
          </div>

        </div>
      </div>

      {/* Controls */}
      <div className="border-t border-slate-100 p-6 bg-white">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={handlePrevStep}
            disabled={currentStep === 0}
            className="p-4 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={toggleReadAloud}
            className={`
              flex items-center space-x-3 px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all
              ${isSpeaking 
                ? 'bg-emerald-100 text-emerald-700 scale-95 ring-2 ring-emerald-500 ring-offset-2' 
                : 'bg-emerald-500 text-white hover:bg-emerald-600 hover:scale-105'}
            `}
          >
            {isSpeaking ? <Pause className="w-6 h-6 fill-current" /> : <Volume2 className="w-6 h-6" />}
            <span>{isSpeaking ? 'Pause' : 'Read Step'}</span>
          </button>

          <button
            onClick={handleNextStep}
            disabled={currentStep === recipe.steps.length - 1}
            className="p-4 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};