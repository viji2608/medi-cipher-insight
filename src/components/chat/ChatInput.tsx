import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

const exampleQueries = [
  "What are the treatment options for Type 2 Diabetes in elderly patients?",
  "Show drug interaction risks for Metformin and Lisinopril",
  "Summarize hypertension cases in the patient database",
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

  return (
    <div className="space-y-3">
      {/* Example Queries */}
      {!isLoading && (
        <div className="flex flex-wrap gap-2">
          {exampleQueries.map((query, i) => (
            <button
              key={i}
              onClick={() => setInput(query)}
              className="text-xs px-3 py-1.5 rounded-full bg-muted/50 border border-border hover:bg-muted hover:border-primary/30 transition-colors text-muted-foreground hover:text-foreground"
            >
              {query.slice(0, 40)}...
            </button>
          ))}
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
