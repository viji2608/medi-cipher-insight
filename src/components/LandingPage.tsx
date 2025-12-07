import React from 'react';
import { Shield, Lock, Zap, FileSearch, ArrowRight, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/types/medical';

interface LandingPageProps {
  onLogin: (role: UserRole) => void;
}

const features = [
  {
    icon: Lock,
    title: 'End-to-End Encryption',
    description: 'AES-256 encryption protects all medical queries and patient data throughout the pipeline.',
  },
  {
    icon: Shield,
    title: 'Zero Data Leakage',
    description: 'Encrypted vector search ensures sensitive information never leaves the secure enclave.',
  },
  {
    icon: Zap,
    title: 'Real-Time Performance',
    description: 'Sub-500ms query responses with minimal encryption overhead using CyborgDB.',
  },
  {
    icon: FileSearch,
    title: 'Full Audit Trails',
    description: 'Complete logging of all data access for HIPAA compliance and regulatory requirements.',
  },
];

const roles: { role: UserRole; label: string; description: string }[] = [
  { role: 'doctor', label: 'Doctor', description: 'Full clinical access' },
  { role: 'clinician', label: 'Clinician', description: 'Patient care access' },
  { role: 'admin', label: 'Admin', description: 'System management' },
  { role: 'researcher', label: 'Researcher', description: 'Anonymized data' },
];

export function LandingPage({ onLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold">MediVaultAI</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="w-4 h-4 text-success" />
            <span>Secured by CyborgDB</span>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">HIPAA Compliant</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-gradient-medical">Encrypted Medical Intelligence</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Secure AI-powered medical queries with end-to-end encryption. 
            Search patient records and clinical knowledge without exposing sensitive data.
          </p>

          <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground mb-12">
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              AES-256 Encrypted
            </span>
            <span className="text-border">|</span>
            <span>Zero-Knowledge Architecture</span>
            <span className="text-border">|</span>
            <span>SOC 2 Ready</span>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="glass-card p-6 hover:border-primary/50 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Login Section */}
        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-center mb-2">Access Secure Portal</h2>
            <p className="text-muted-foreground text-center mb-8">
              Select your role to enter the demo environment
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {roles.map((item) => (
                <Button
                  key={item.role}
                  variant="outline"
                  className="h-auto py-4 px-6 flex flex-col items-start gap-1 hover:bg-primary/10 hover:border-primary/50 transition-all group"
                  onClick={() => onLogin(item.role)}
                >
                  <div className="flex items-center gap-2 w-full">
                    <span className="font-semibold">{item.label}</span>
                    <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-xs text-muted-foreground">{item.description}</span>
                </Button>
              ))}
            </div>

            <p className="text-xs text-muted-foreground text-center mt-6">
              This is a demo environment. No real patient data is used.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <span>MediVaultAI Demo</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Powered by CyborgDB Encrypted Vector Search</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
