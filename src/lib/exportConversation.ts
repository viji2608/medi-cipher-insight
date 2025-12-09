import { Conversation, Message } from '@/types/medical';

export function formatMessageForExport(message: Message): string {
  const role = message.role === 'user' ? 'You' : 'MediVaultAI';
  const time = message.timestamp.toLocaleString();
  const encryption = message.isEncrypted ? ' [Encrypted]' : '';
  
  return `### ${role} (${time})${encryption}\n\n${message.content}\n`;
}

export function exportToMarkdown(conversation: Conversation): void {
  const header = `# ${conversation.title}\n\n`;
  const metadata = `**Created:** ${conversation.createdAt.toLocaleString()}\n**Last Updated:** ${conversation.updatedAt.toLocaleString()}\n**Messages:** ${conversation.messages.length}\n\n---\n\n`;
  
  const messages = conversation.messages
    .map(formatMessageForExport)
    .join('\n---\n\n');
  
  const footer = `\n---\n\n*Exported from MediVaultAI on ${new Date().toLocaleString()}*\n*All data was processed with AES-256 encryption*`;
  
  const content = header + metadata + messages + footer;
  
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${conversation.title.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function exportToPDF(conversation: Conversation): Promise<void> {
  const { jsPDF } = await import('jspdf');
  
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;
  let yPosition = 20;
  
  // Helper to add text with page breaks
  const addText = (text: string, fontSize: number, isBold = false, color: [number, number, number] = [0, 0, 0]) => {
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);
    if (isBold) {
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setFont('helvetica', 'normal');
    }
    
    const lines = doc.splitTextToSize(text, maxWidth);
    const lineHeight = fontSize * 0.5;
    
    for (const line of lines) {
      if (yPosition > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, margin, yPosition);
      yPosition += lineHeight;
    }
  };
  
  // Title
  addText(conversation.title, 18, true, [59, 130, 246]);
  yPosition += 5;
  
  // Metadata
  addText(`Created: ${conversation.createdAt.toLocaleString()}`, 10, false, [100, 100, 100]);
  addText(`Messages: ${conversation.messages.length}`, 10, false, [100, 100, 100]);
  yPosition += 10;
  
  // Separator
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;
  
  // Messages
  for (const message of conversation.messages) {
    const role = message.role === 'user' ? 'You' : 'MediVaultAI';
    const time = message.timestamp.toLocaleTimeString();
    
    // Role header
    const headerColor: [number, number, number] = message.role === 'user' 
      ? [59, 130, 246]  // Blue for user
      : [34, 197, 94];  // Green for AI
    
    addText(`${role} • ${time}`, 11, true, headerColor);
    yPosition += 2;
    
    // Message content - clean markdown symbols
    const cleanContent = message.content
      .replace(/#{1,3}\s/g, '')
      .replace(/\*\*/g, '')
      .replace(/[✓✅⚠️❌💡ℹ️]/g, '• ');
    
    addText(cleanContent, 10, false, [50, 50, 50]);
    yPosition += 8;
  }
  
  // Footer
  yPosition += 10;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 8;
  addText(`Exported from MediVaultAI on ${new Date().toLocaleString()}`, 8, false, [150, 150, 150]);
  addText('All data was processed with AES-256 encryption', 8, false, [150, 150, 150]);
  
  // Save
  doc.save(`${conversation.title.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.pdf`);
}
