import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Message, Conversation } from '@/types/medical';
import { generateEncryptedHash } from '@/lib/encryption';

interface ChatContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  isLoading: boolean;
  encryptionStatus: 'idle' | 'encrypting' | 'searching' | 'decrypting' | 'complete';
  createConversation: () => void;
  selectConversation: (id: string) => void;
  addMessage: (content: string, role: 'user' | 'assistant') => Message;
  setLoading: (loading: boolean) => void;
  setEncryptionStatus: (status: 'idle' | 'encrypting' | 'searching' | 'decrypting' | 'complete') => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [encryptionStatus, setEncryptionStatus] = useState<'idle' | 'encrypting' | 'searching' | 'decrypting' | 'complete'>('idle');

  const activeConversation = conversations.find(c => c.id === activeConversationId) || null;

  const createConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
  }, []);

  const selectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
  }, []);

  const addMessage = useCallback((content: string, role: 'user' | 'assistant'): Message => {
    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role,
      content,
      timestamp: new Date(),
      encryptedHash: generateEncryptedHash(content),
      isEncrypted: true,
    };

    setConversations(prev =>
      prev.map(conv => {
        if (conv.id === activeConversationId) {
          const updatedConv = {
            ...conv,
            messages: [...conv.messages, newMessage],
            updatedAt: new Date(),
            title: conv.messages.length === 0 && role === 'user' 
              ? content.slice(0, 40) + (content.length > 40 ? '...' : '')
              : conv.title,
          };
          return updatedConv;
        }
        return conv;
      })
    );

    return newMessage;
  }, [activeConversationId]);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversation,
        isLoading,
        encryptionStatus,
        createConversation,
        selectConversation,
        addMessage,
        setLoading: setIsLoading,
        setEncryptionStatus,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
