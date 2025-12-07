export type UserRole = 'doctor' | 'clinician' | 'admin' | 'researcher';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  department?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  encryptedHash?: string;
  isEncrypted: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PatientRecord {
  id: string;
  patientId: string;
  conditions: string[];
  medications: string[];
  lastVisit: Date;
  vitalSigns: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
  };
  notes: string;
  encryptedEmbedding?: string;
  isEncrypted: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userRole: UserRole;
  action: 'query' | 'access' | 'retrieval' | 'login' | 'logout';
  dataAccessed: string;
  encryptionMethod: string;
  status: 'success' | 'failed';
}

export interface PerformanceMetric {
  timestamp: Date;
  queryLatency: number;
  encryptionOverhead: number;
  recordsSearched: number;
  accuracyScore: number;
}

export interface ComplianceCheck {
  id: string;
  name: string;
  description: string;
  isCompliant: boolean;
}
