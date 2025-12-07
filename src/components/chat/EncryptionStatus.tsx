import React from 'react';
import { Lock, Search, Shield, Zap, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EncryptionStatusProps {
  status: 'idle' | 'encrypting' | 'searching' | 'decrypting' | 'complete';
}

const steps = [
  { id: 'encrypting', label: 'Encrypting Query', icon: Lock },
  { id: 'searching', label: 'Searching Vectors', icon: Search },
  { id: 'decrypting', label: 'Secure Retrieval', icon: Shield },
  { id: 'complete', label: 'Response Ready', icon: Zap },
];

export function EncryptionStatus({ status }: EncryptionStatusProps) {
  if (status === 'idle') return null;

  const currentIndex = steps.findIndex(s => s.id === status);

  return (
    <div className="glass-card p-4 animate-fade-in">
      <div className="flex items-center justify-between gap-2">
        {steps.map((step, index) => {
          const isActive = step.id === status;
          const isComplete = index < currentIndex || status === 'complete';
          const Icon = isComplete && !isActive ? CheckCircle : step.icon;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                    isActive && 'bg-primary/20 border-2 border-primary pulse-encryption',
                    isComplete && !isActive && 'bg-success/20 border border-success/50',
                    !isActive && !isComplete && 'bg-muted border border-border'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-5 h-5 transition-colors',
                      isActive && 'text-primary',
                      isComplete && !isActive && 'text-success',
                      !isActive && !isComplete && 'text-muted-foreground'
                    )}
                  />
                </div>
                <span
                  className={cn(
                    'text-xs font-medium whitespace-nowrap',
                    isActive && 'text-primary',
                    isComplete && !isActive && 'text-success',
                    !isActive && !isComplete && 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 rounded-full transition-colors duration-300',
                    index < currentIndex ? 'bg-success' : 'bg-border'
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
