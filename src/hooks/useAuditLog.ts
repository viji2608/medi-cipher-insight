import { useState, useCallback } from 'react';
import { AuditLogEntry, UserRole } from '@/types/medical';

export function useAuditLog() {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  const addAuditEntry = useCallback((
    userId: string,
    userRole: UserRole,
    action: AuditLogEntry['action'],
    dataAccessed: string,
    status: 'success' | 'failed' = 'success'
  ) => {
    const entry: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      userId,
      userRole,
      action,
      dataAccessed,
      encryptionMethod: 'AES-256-GCM',
      status,
    };

    setAuditLogs(prev => [entry, ...prev].slice(0, 100)); // Keep last 100 entries
    return entry;
  }, []);

  const exportToCSV = useCallback(() => {
    const headers = ['Timestamp', 'User ID', 'Role', 'Action', 'Data Accessed', 'Encryption', 'Status'];
    const rows = auditLogs.map(log => [
      log.timestamp.toISOString(),
      log.userId,
      log.userRole,
      log.action,
      log.dataAccessed,
      log.encryptionMethod,
      log.status,
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [auditLogs]);

  return {
    auditLogs,
    addAuditEntry,
    exportToCSV,
  };
}
