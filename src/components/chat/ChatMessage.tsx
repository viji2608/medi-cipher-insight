import React, { useState } from 'react';
import { Lock, Shield, Copy, Check, AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { Message } from '@/types/medical';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ChatMessageProps {
  message: Message;
}

function formatMessageContent(content: string) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeContent: string[] = [];

  lines.forEach((line, i) => {
    // Code block handling
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre key={`code-${i}`} className="bg-background/50 border border-border rounded-lg p-3 my-2 overflow-x-auto text-xs font-mono text-foreground">
            {codeContent.join('\n')}
          </pre>
        );
        codeContent = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      return;
    }

    // Main headers (##)
    if (line.startsWith('## ')) {
      elements.push(
        <h3 key={i} className="text-base font-semibold text-foreground mt-4 mb-2 first:mt-0 flex items-center gap-2 border-b border-border/50 pb-1">
          <div className="w-1 h-4 bg-primary rounded-full" />
          {line.replace('## ', '')}
        </h3>
      );
      return;
    }

    // Sub headers (###)
    if (line.startsWith('### ')) {
      elements.push(
        <h4 key={i} className="text-sm font-medium text-foreground mt-3 mb-1.5">
          {line.replace('### ', '')}
        </h4>
      );
      return;
    }

    // Bold text lines
    if (line.startsWith('**') && line.endsWith('**')) {
      elements.push(
        <p key={i} className="font-semibold text-foreground my-1.5">
          {line.replace(/\*\*/g, '')}
        </p>
      );
      return;
    }

    // Success indicators
    if (line.startsWith('✓') || line.startsWith('✅')) {
      elements.push(
        <div key={i} className="flex items-start gap-2 my-1 text-success">
          <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="text-sm">{line.replace(/^[✓✅]\s*/, '')}</span>
        </div>
      );
      return;
    }

    // Warning indicators
    if (line.startsWith('⚠️') || line.startsWith('⚠')) {
      elements.push(
        <div key={i} className="flex items-start gap-2 my-1 text-warning">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="text-sm">{line.replace(/^⚠️?\s*/, '')}</span>
        </div>
      );
      return;
    }

    // Error indicators
    if (line.startsWith('❌')) {
      elements.push(
        <div key={i} className="flex items-start gap-2 my-1 text-destructive">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="text-sm">{line.replace(/^❌\s*/, '')}</span>
        </div>
      );
      return;
    }

    // Info indicators
    if (line.startsWith('ℹ️') || line.startsWith('💡')) {
      elements.push(
        <div key={i} className="flex items-start gap-2 my-1 text-info">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="text-sm">{line.replace(/^[ℹ️💡]\s*/, '')}</span>
        </div>
      );
      return;
    }

    // Bullet points
    if (line.startsWith('- ') || line.startsWith('• ')) {
      elements.push(
        <div key={i} className="flex items-start gap-2 my-0.5 ml-2">
          <span className="text-primary mt-1.5">•</span>
          <span className="text-sm text-muted-foreground">{line.replace(/^[-•]\s*/, '')}</span>
        </div>
      );
      return;
    }

    // Numbered lists
    if (line.match(/^\d+\.\s/)) {
      const num = line.match(/^(\d+)\./)?.[1];
      elements.push(
        <div key={i} className="flex items-start gap-2 my-0.5 ml-2">
          <span className="text-primary font-medium min-w-[1.25rem]">{num}.</span>
          <span className="text-sm text-muted-foreground">{line.replace(/^\d+\.\s*/, '')}</span>
        </div>
      );
      return;
    }

    // Key-value pairs (e.g., "Dosage: 500mg")
    if (line.includes(': ') && !line.startsWith(' ')) {
      const [key, ...valueParts] = line.split(': ');
      const value = valueParts.join(': ');
      if (key.length < 30 && value) {
        elements.push(
          <div key={i} className="flex items-start gap-2 my-1">
            <span className="text-sm font-medium text-foreground min-w-[120px]">{key}:</span>
            <span className="text-sm text-muted-foreground">{value}</span>
          </div>
        );
        return;
      }
    }

    // Empty lines
    if (line.trim() === '') {
      elements.push(<div key={i} className="h-2" />);
      return;
    }

    // Regular text with inline formatting
    const formattedLine = line
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
      .replace(/`(.+?)`/g, '<code class="bg-background/50 px-1 py-0.5 rounded text-xs font-mono">$1</code>');

    elements.push(
      <p 
        key={i} 
        className="text-sm text-muted-foreground my-1 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: formattedLine }}
      />
    );
  });

  return elements;
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
          isUser ? 'bg-primary/20' : 'bg-gradient-to-br from-primary/20 to-secondary/20'
        )}
      >
        {isUser ? (
          <span className="text-sm font-medium text-primary">You</span>
        ) : (
          <Shield className="w-5 h-5 text-primary" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          'flex-1 max-w-[85%] space-y-2',
          isUser ? 'items-end' : 'items-start'
        )}
      >
        <div
          className={cn(
            'rounded-2xl px-5 py-4',
            isUser
              ? 'bg-primary/20 border border-primary/30 rounded-br-md'
              : 'bg-card border border-border rounded-bl-md shadow-sm'
          )}
        >
          {/* Message Text */}
          <div className="max-w-none">
            {isUser ? (
              <p className="text-sm text-foreground">{message.content}</p>
            ) : (
              formatMessageContent(message.content)
            )}
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
