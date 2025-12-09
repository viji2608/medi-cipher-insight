import { useState, useEffect, useRef } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ChatProvider, useChat } from "@/contexts/ChatContext";
import { SettingsProvider, useSettings } from "@/contexts/SettingsContext";
import { LandingPage } from "@/components/LandingPage";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { EncryptionStatus } from "@/components/chat/EncryptionStatus";
import { ExportDialog } from "@/components/chat/ExportDialog";
import { PerformanceMetrics } from "@/components/dashboard/PerformanceMetrics";
import { AuditLogPanel } from "@/components/dashboard/AuditLogPanel";
import { LatencyChart } from "@/components/dashboard/LatencyChart";
import { useMedicalChat } from "@/hooks/useMedicalChat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Shield } from "lucide-react";
import { UserRole } from "@/types/medical";

function ChatInterface() {
  const { user, logout } = useAuth();
  const { 
    activeConversation, 
    createConversation, 
    selectConversation, 
    conversations,
    encryptionStatus,
    isLoading,
  } = useChat();
  const {
    sendMessage,
    metrics,
    activeQueries,
    getAverageLatency,
    getAverageOverhead,
    getTotalRecordsSearched,
    auditEntries,
    exportAuditLog,
  } = useMedicalChat();
  const { settings, playSound, showNotification } = useSettings();

  const [showDashboard, setShowDashboard] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to new messages
  useEffect(() => {
    if (settings.autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversation?.messages.length, settings.autoScroll]);

  // Play sound and show notification on new message
  useEffect(() => {
    if (activeConversation?.messages.length) {
      const lastMessage = activeConversation.messages[activeConversation.messages.length - 1];
      if (lastMessage.role === 'assistant') {
        playSound('receive');
        if (document.hidden) {
          showNotification('MediVaultAI', 'New response received');
        }
      }
    }
  }, [activeConversation?.messages.length, playSound, showNotification]);

  if (!user) return null;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <ChatSidebar
        user={user}
        conversations={conversations}
        activeConversationId={activeConversation?.id || null}
        onNewChat={createConversation}
        onSelectConversation={selectConversation}
        onLogout={logout}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 border-b border-border/50 bg-card/30 backdrop-blur flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-medical-primary" />
            <h1 className="font-semibold text-foreground">MediVaultAI</h1>
            <span className="text-xs text-muted-foreground">• Encrypted Chat</span>
          </div>
          <div className="flex items-center gap-2">
            {activeConversation && (
              <ExportDialog conversation={activeConversation} />
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDashboard(!showDashboard)}
              className="text-xs"
            >
              {showDashboard ? (
                <>
                  <ChevronUp className="h-3 w-3 mr-1" />
                  Hide Metrics
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Show Metrics
                </>
              )}
            </Button>
          </div>
        </header>

        {/* Dashboard Panel */}
        {showDashboard && (
          <div className="border-b border-border/50 bg-card/20 p-4 space-y-4 shrink-0">
            <PerformanceMetrics
              metrics={metrics}
              activeQueries={activeQueries}
              averageLatency={getAverageLatency()}
              averageOverhead={getAverageOverhead()}
              totalRecordsSearched={getTotalRecordsSearched()}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <LatencyChart metrics={metrics} />
              <AuditLogPanel entries={auditEntries} onExport={exportAuditLog} />
            </div>
          </div>
        )}

        {/* Messages Area */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4 max-w-4xl mx-auto">
            {!activeConversation ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-center">
                <div className="w-16 h-16 rounded-full bg-medical-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-medical-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Welcome to MediVaultAI
                </h2>
                <p className="text-muted-foreground max-w-md mb-4">
                  Your queries are encrypted using homomorphic encryption. 
                  Medical records are searched without ever being decrypted.
                </p>
                <Button onClick={createConversation} className="bg-medical-primary hover:bg-medical-primary/90">
                  Start New Conversation
                </Button>
              </div>
            ) : activeConversation.messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] text-center">
                <div className="w-12 h-12 rounded-full bg-medical-accent/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-medical-accent" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Ready for Encrypted Queries
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Ask about patient records, medications, treatment protocols, or any medical information.
                </p>
              </div>
            ) : (
              <>
                {activeConversation.messages.map((message) => (
                  <ChatMessage 
                    key={message.id} 
                    message={message} 
                    showEncryptionBadge={settings.showEncryptionBadge}
                  />
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </ScrollArea>

        {/* Encryption Status */}
        {encryptionStatus !== 'idle' && (
          <div className="px-4 py-2 bg-card/50 border-t border-border/30">
            <EncryptionStatus status={encryptionStatus} />
          </div>
        )}

        {/* Input Area */}
        {activeConversation && (
          <div className="p-4 border-t border-border/50 bg-card/30 shrink-0">
            <ChatInput onSend={sendMessage} isLoading={isLoading} />
          </div>
        )}
      </div>
    </div>
  );
}

function AppContent() {
  const { isAuthenticated, login } = useAuth();

  if (!isAuthenticated) {
    return <LandingPage onLogin={(role: UserRole) => login(role)} />;
  }

  return (
    <ChatProvider>
      <ChatInterface />
    </ChatProvider>
  );
}

const Index = () => {
  return (
    <SettingsProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SettingsProvider>
  );
};

export default Index;
