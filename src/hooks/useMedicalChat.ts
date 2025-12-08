import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { usePerformanceMetrics } from './usePerformanceMetrics';
import { useAuditLog } from './useAuditLog';
import { simulateEncryptionDelay } from '@/lib/encryption';

export function useMedicalChat() {
  const { addMessage, setLoading, setEncryptionStatus, activeConversation } = useChat();
  const { user } = useAuth();
  const { recordMetric, startQuery, endQuery, ...metricsData } = usePerformanceMetrics();
  const { addAuditEntry, exportToCSV, auditLogs } = useAuditLog();
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !activeConversation) return;

    setError(null);
    setLoading(true);
    startQuery();

    // Add user message
    addMessage(content, 'user');
    
    // Log the query
    if (user) {
      addAuditEntry(
        user.id,
        user.role,
        'query',
        `Encrypted query: "${content.slice(0, 50)}..."`
      );
    }

    try {
      // Simulate encryption process
      setEncryptionStatus('encrypting');
      await simulateEncryptionDelay();

      setEncryptionStatus('searching');
      
      // Call the edge function for search
      const { data: searchData, error: searchError } = await supabase.functions.invoke('medical-chat', {
        body: { action: 'search', query: content },
      });

      if (searchError) {
        console.error('Search error:', searchError);
        throw new Error(searchError.message);
      }

      // Log the search
      if (user) {
        addAuditEntry(
          user.id,
          user.role,
          'retrieval',
          `Searched ${searchData?.results?.length || 0} encrypted records`
        );
      }

      setEncryptionStatus('decrypting');
      await simulateEncryptionDelay();

      // Generate response
      const { data: responseData, error: responseError } = await supabase.functions.invoke('medical-chat', {
        body: { 
          action: 'generate',
          query: content, 
          context: searchData?.results || [],
        },
      });

      if (responseError) {
        console.error('Response error:', responseError);
        throw new Error(responseError.message);
      }

      const aiResponse = responseData?.response || 
        "I've processed your encrypted query. The relevant medical information has been retrieved while maintaining full data privacy.";

      setEncryptionStatus('complete');
      
      // Record performance metrics
      recordMetric(searchData?.results?.length || 3);
      
      // Add AI response
      addMessage(aiResponse, 'assistant');

      // Short delay before resetting status
      setTimeout(() => {
        setEncryptionStatus('idle');
      }, 1500);

    } catch (err) {
      console.error('Medical chat error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      
      // Add fallback response on error
      addMessage(
        "I apologize, but I encountered an issue processing your encrypted query. Please try again. Your data remains secure.",
        'assistant'
      );
      setEncryptionStatus('idle');
    } finally {
      setLoading(false);
      endQuery();
    }
  }, [activeConversation, addMessage, setLoading, setEncryptionStatus, user, addAuditEntry, recordMetric, startQuery, endQuery]);

  return {
    sendMessage,
    error,
    auditEntries: auditLogs,
    exportAuditLog: exportToCSV,
    ...metricsData,
  };
}
