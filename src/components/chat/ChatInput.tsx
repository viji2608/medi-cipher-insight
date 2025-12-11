import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

const exampleCategories = [
  {
    label: '🩺 Diagnosis',
    queries: [
      "What are common symptoms of Type 2 Diabetes?",
      "Differential diagnosis for chest pain in a 55-year-old",
      "Signs and symptoms of hypertensive crisis",
    ],
  },
  {
    label: '💊 Medications',
    queries: [
      "Drug interactions between Metformin and Lisinopril",
      "Recommended dosing for pediatric amoxicillin",
      "Contraindications for beta-blockers",
    ],
  },
  {
    label: '🧪 Lab Results',
    queries: [
      "Recent lab results for cardiac biomarkers",
      "Show patients with elevated liver enzymes",
      "Complete blood count interpretation guide",
    ],
  },
  {
    label: '🤧 Allergies',
    queries: [
      "List all documented patient allergies",
      "Cross-reactivity between penicillin and cephalosporins",
      "Common drug allergy symptoms and management",
    ],
  },
  {
    label: '💉 Immunizations',
    queries: [
      "Recommended adult vaccination schedule",
      "Pediatric immunization records",
      "COVID-19 booster eligibility criteria",
    ],
  },
  {
    label: '📋 Protocols',
    queries: [
      "Post-operative care protocol for hip replacement",
      "Sepsis treatment guidelines",
      "Diabetic ketoacidosis management steps",
    ],
  },
];

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {/* Example Query Categories */}
      {!isLoading && (
        <div className="space-y-2">
          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {exampleCategories.map((category, i) => (
              <button
                key={i}
                onClick={() => setSelectedCategory(selectedCategory === i ? null : i)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  selectedCategory === i
                    ? 'bg-primary/20 border-primary text-primary'
                    : 'bg-muted/50 border-border hover:bg-muted hover:border-primary/30 text-muted-foreground hover:text-foreground'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
          
          {/* Queries for Selected Category */}
          {selectedCategory !== null && (
            <div className="flex flex-wrap gap-2 animate-fade-in">
              {exampleCategories[selectedCategory].queries.map((query, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(query);
                    setSelectedCategory(null);
                  }}
                  className="text-xs px-3 py-1.5 rounded-lg bg-card border border-border hover:bg-accent hover:border-primary/30 transition-all text-muted-foreground hover:text-foreground text-left"
                >
                  {query}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="glass-card p-2">
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a medical question..."
              disabled={isLoading}
              className="min-h-[60px] max-h-[200px] resize-none bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground"
              rows={2}
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              size="icon"
              className="h-10 w-10 rounded-lg bg-primary hover:bg-primary/90 flex-shrink-0"
            >
              {isLoading ? (
                <Sparkles className="w-5 h-5 animate-pulse" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2 text-center">
          All queries are encrypted with AES-256 before processing
        </p>
      </form>
    </div>
  );
}
