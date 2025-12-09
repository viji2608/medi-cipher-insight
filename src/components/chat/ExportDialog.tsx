import React, { useState } from 'react';
import { Download, FileText, FileType, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Conversation } from '@/types/medical';
import { exportToMarkdown, exportToPDF } from '@/lib/exportConversation';
import { toast } from 'sonner';

interface ExportDialogProps {
  conversation: Conversation | null;
  trigger?: React.ReactNode;
}

export function ExportDialog({ conversation, trigger }: ExportDialogProps) {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState<'pdf' | 'md' | null>(null);

  const handleExport = async (format: 'pdf' | 'md') => {
    if (!conversation) {
      toast.error('No conversation to export');
      return;
    }

    if (conversation.messages.length === 0) {
      toast.error('No messages to export');
      return;
    }

    setExporting(format);
    
    try {
      if (format === 'md') {
        exportToMarkdown(conversation);
        toast.success('Markdown exported', {
          description: `${conversation.title} has been downloaded`,
        });
      } else {
        await exportToPDF(conversation);
        toast.success('PDF exported', {
          description: `${conversation.title} has been downloaded`,
        });
      }
      setOpen(false);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed', {
        description: 'Please try again',
      });
    } finally {
      setExporting(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="gap-1.5" disabled={!conversation}>
            <Download className="w-4 h-4" />
            Export
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            Export Conversation
          </DialogTitle>
          <DialogDescription>
            Download this conversation for your records
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-3">
          {conversation && (
            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <p className="text-sm font-medium text-foreground truncate">
                {conversation.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {conversation.messages.length} messages • {conversation.updatedAt.toLocaleDateString()}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-auto py-4 flex-col gap-2"
              onClick={() => handleExport('md')}
              disabled={exporting !== null || !conversation}
            >
              {exporting === 'md' ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <FileText className="w-6 h-6 text-primary" />
              )}
              <div className="text-center">
                <p className="text-sm font-medium">Markdown</p>
                <p className="text-xs text-muted-foreground">.md file</p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 flex-col gap-2"
              onClick={() => handleExport('pdf')}
              disabled={exporting !== null || !conversation}
            >
              {exporting === 'pdf' ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <FileType className="w-6 h-6 text-destructive" />
              )}
              <div className="text-center">
                <p className="text-sm font-medium">PDF</p>
                <p className="text-xs text-muted-foreground">.pdf file</p>
              </div>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center pt-2">
            Exports include encryption metadata for compliance
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
