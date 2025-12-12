import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/medical';
interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}
interface QueryCategory {
  label: string;
  queries: string[];
}

// Role-specific query categories
const roleBasedCategories: Record<UserRole, QueryCategory[]> = {
  doctor: [{
    label: '🩺 Diagnosis',
    queries: ["Differential diagnosis for chest pain in a 55-year-old", "Signs of acute myocardial infarction", "Symptoms indicating diabetic ketoacidosis"]
  }, {
    label: '💊 Treatment Plans',
    queries: ["First-line treatment for newly diagnosed hypertension", "Insulin titration protocol for Type 2 Diabetes", "Post-MI medication regimen recommendations"]
  }, {
    label: '📋 Patient History',
    queries: ["Retrieve patient cardiac history for pre-op evaluation", "Show patients with recurring UTI in last 6 months", "List patients due for annual diabetes review"]
  }, {
    label: '⚠️ Drug Interactions',
    queries: ["Interactions between Warfarin and new antibiotics", "Safe analgesics for patients on SSRIs", "Contraindications for beta-blockers in asthma"]
  }],
  clinician: [{
    label: '🧪 Lab Results',
    queries: ["Patients with critical lab values today", "Trending HbA1c results for diabetic patients", "Abnormal lipid panels requiring follow-up"]
  }, {
    label: '💉 Procedures',
    queries: ["Post-procedure monitoring checklist for colonoscopy", "IV insertion protocols for difficult access", "Blood transfusion reaction protocols"]
  }, {
    label: '📊 Vitals Monitoring',
    queries: ["Patients with blood pressure above 180/110", "Show oxygen saturation trends for ICU patients", "Alert thresholds for pediatric heart rates"]
  }, {
    label: '🤧 Allergies & Alerts',
    queries: ["Patients with documented latex allergies", "Cross-reactivity between penicillin and cephalosporins", "High-risk fall patients on current unit"]
  }],
  admin: [{
    label: '📈 Analytics',
    queries: ["Average patient wait times this quarter", "Department utilization rates comparison", "Readmission rates by diagnosis category"]
  }, {
    label: '🔒 Compliance',
    queries: ["HIPAA compliance audit summary", "Outstanding staff certification renewals", "Data access logs for sensitive records"]
  }, {
    label: '👥 Staff Management',
    queries: ["Staff overtime hours this month", "Credential expiration alerts for physicians", "Training completion rates by department"]
  }, {
    label: '💰 Billing',
    queries: ["Unbilled procedures from last week", "Insurance claim rejection rates", "Revenue by department this quarter"]
  }],
  researcher: [{
    label: '📚 Clinical Trials',
    queries: ["Eligible patients for diabetes drug trial", "Enrollment status for ongoing oncology studies", "Adverse event reports from active trials"]
  }, {
    label: '📊 Population Health',
    queries: ["Prevalence of hypertension by age group", "Correlation between BMI and diabetes outcomes", "Demographic breakdown of cardiac patients"]
  }, {
    label: '🧬 Outcomes Research',
    queries: ["30-day mortality rates post cardiac surgery", "Treatment efficacy comparison for depression", "Long-term outcomes for joint replacement patients"]
  }, {
    label: '📑 Publications',
    queries: ["De-identified dataset for retrospective study", "Statistical summary for grant application", "IRB approval status for pending studies"]
  }]
};
export function ChatInput({
  onSend,
  isLoading
}: ChatInputProps) {
  const {
    user
  } = useAuth();
  const [input, setInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Get role-specific categories, default to doctor if not logged in
  const categories = roleBasedCategories[user?.role || 'doctor'];
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
  return <div className="space-y-3">
      {/* Role indicator */}
      {user}

      {/* Example Query Categories */}
      {!isLoading && <div className="space-y-2">
          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category, i) => <button key={i} onClick={() => setSelectedCategory(selectedCategory === i ? null : i)} className={`text-xs px-3 py-1.5 rounded-full border transition-all ${selectedCategory === i ? 'bg-primary/20 border-primary text-primary' : 'bg-muted/50 border-border hover:bg-muted hover:border-primary/30 text-muted-foreground hover:text-foreground'}`}>
                {category.label}
              </button>)}
          </div>
          
          {/* Queries for Selected Category */}
          {selectedCategory !== null && <div className="flex flex-wrap gap-2 animate-fade-in">
              {categories[selectedCategory].queries.map((query, i) => <button key={i} onClick={() => {
          setInput(query);
          setSelectedCategory(null);
        }} className="text-xs px-3 py-1.5 rounded-lg bg-card border border-border hover:bg-accent hover:border-primary/30 transition-all text-muted-foreground hover:text-foreground text-left">
                  {query}
                </button>)}
            </div>}
        </div>}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="glass-card p-2">
          <div className="flex items-end gap-2">
            <Textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Ask a medical question..." disabled={isLoading} className="min-h-[60px] max-h-[200px] resize-none bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground" rows={2} />
            <Button type="submit" disabled={!input.trim() || isLoading} size="icon" className="h-10 w-10 rounded-lg bg-primary hover:bg-primary/90 flex-shrink-0">
              {isLoading ? <Sparkles className="w-5 h-5 animate-pulse" /> : <Send className="w-5 h-5" />}
            </Button>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2 text-center">
          All queries are encrypted with AES-256 before processing
        </p>
      </form>
    </div>;
}