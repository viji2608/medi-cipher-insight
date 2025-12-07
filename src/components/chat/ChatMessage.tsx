import React from 'react';
import { Lock, Shield, Copy, Check } from 'lucide-react';
import { Message } from '@/types/medical';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className={cn(
        'flex gap-4 animate-fade-in',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
          isUser ? 'bg-primary/20' : 'bg-secondary/20'
        )}
      >
        {isUser ? (
          <span className="text-sm font-medium text-primary">You</span>
        ) : (
          <Shield className="w-5 h-5 text-secondary" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          'flex-1 max-w-[80%] space-y-2',
          isUser ? 'items-end' : 'items-start'
        )}
      >
        <div
          className={cn(
            'rounded-2xl px-4 py-3',
            isUser
              ? 'bg-primary/20 border border-primary/30 rounded-br-md'
              : 'bg-muted border border-border rounded-bl-md'
          )}
        >
          {/* Message Text */}
          <div className="prose prose-invert prose-sm max-w-none">
            {message.content.split('\n').map((line, i) => {
              if (line.startsWith('## ')) {
                return (
                  <h3 key={i} className="text-base font-semibold text-foreground mt-3 mb-2 first:mt-0">
                    {line.replace('## ', '')}
                  </h3>
                );
              }
              if (line.startsWith('**') && line.endsWith('**')) {
                return (
                  <p key={i} className="font-semibold text-foreground my-1">
                    {line.replace(/\*\*/g, '')}
                  </p>
                );
              }
              if (line.startsWith('- ') || line.startsWith('• ')) {
                return (
                  <p key={i} className="text-muted-foreground ml-4 my-0.5">
                    {line}
                  </p>
                );
              }
              if (line.match(/^\d\./)) {
                return (
                  <p key={i} className="text-muted-foreground ml-4 my-0.5">
                    {line}
                  </p>
                );
              }
              if (line.startsWith('✓') || line.startsWith('⚠️') || line.startsWith('❌') || line.startsWith('⚡')) {
                return (
                  <p key={i} className="text-muted-foreground my-0.5">
                    {line}
                  </p>
                );
              }
              if (line.trim() === '') {
                return <div key={i} className="h-2" />;
              }
              return (
                <p key={i} className="text-muted-foreground my-1">
                  {line}
                </p>
              );
            })}
          </div>
        </div>

        {/* Message Footer */}
        <div
          className={cn(
            'flex items-center gap-3 px-2',
            isUser ? 'flex-row-reverse' : 'flex-row'
          )}
        >
          {/* Encryption Badge */}
          {message.isEncrypted && (
            <div className="flex items-center gap-1.5 text-xs text-success">
              <Lock className="w-3 h-3" />
              <span>AES-256</span>
            </div>
          )}

          {/* Timestamp */}
          <span className="text-xs text-muted-foreground">
            {formatTime(message.timestamp)}
          </span>

          {/* Copy Button (for AI responses) */}
          {!isUser && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="w-3 h-3 text-success" />
              ) : (
                <Copy className="w-3 h-3 text-muted-foreground" />
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
