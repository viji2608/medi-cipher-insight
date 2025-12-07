import React from 'react';
import { Plus, MessageSquare, Settings, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Conversation, User } from '@/types/medical';
import { cn } from '@/lib/utils';

interface ChatSidebarProps {
  user: User;
  conversations: Conversation[];
  activeConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onLogout: () => void;
}

export function ChatSidebar({
  user,
  conversations,
  activeConversationId,
  onNewChat,
  onSelectConversation,
  onLogout,
}: ChatSidebarProps) {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="w-72 h-full bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <Button
          onClick={onNewChat}
          className="w-full gap-2 bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          New Conversation
        </Button>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {conversations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No conversations yet</p>
              <p className="text-xs mt-1">Start a new chat above</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={cn(
                  'w-full text-left px-3 py-2.5 rounded-lg transition-colors group',
                  activeConversationId === conv.id
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'hover:bg-sidebar-accent/50 text-muted-foreground hover:text-sidebar-accent-foreground'
                )}
              >
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {conv.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(conv.updatedAt)}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>

      {/* User Info */}
      <div className="p-4 border-t border-sidebar-border">
        {/* Role Badge */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-sidebar-accent/50 mb-3">
          <Shield className="w-4 h-4 text-success" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium capitalize">{user.role}</p>
            <p className="text-xs text-muted-foreground">Encrypted Session</p>
          </div>
        </div>

        {/* User */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
            {user.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user.department}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 gap-1.5">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="gap-1.5"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
