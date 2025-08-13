import { useState } from 'react';
import { searchWithNaturalLanguage } from '@/lib/ai/natural-language-search';
import { applyAICorrection } from '@/lib/ai/corrections';
import { generateAIRules } from '@/lib/ai/rule-recommendations';
import { ValidationError } from '@/types/data.types';

export function useAI() {
  const [loading, setLoading] = useState(false);

  const search = async (query: string, data: any) => {
    setLoading(true);
    try {
      return await searchWithNaturalLanguage(query, data);
    } finally {
      setLoading(false);
    }
  };

  const applySuggestion = async (error: ValidationError) => {
    if (!error.suggestion) return;
    
    setLoading(true);
    try {
      return await applyAICorrection(error);
    } finally {
      setLoading(false);
    }
  };

  const getRuleRecommendations = async (data: any) => {
    setLoading(true);
    try {
      return await generateAIRules(data);
    } finally {
      setLoading(false);
    }
  };

  return {
    search,
    applySuggestion,
    getRuleRecommendations,
    loading
  };
}