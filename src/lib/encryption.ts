// Simulated encryption utilities for demo purposes
// In production, real AES-256 encryption would be used

export function generateEncryptedHash(content: string): string {
  // Create a pseudo-encrypted hash for visual demonstration
  // Use TextEncoder to handle Unicode characters properly
  const encoder = new TextEncoder();
  const utf8Bytes = encoder.encode(content.slice(0, 20));
  const base64 = btoa(String.fromCharCode(...utf8Bytes));
  const randomSuffix = Array.from({ length: 16 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
  return `${base64.slice(0, 24)}...${randomSuffix}`;
}

export function generateEmbeddingPreview(): string {
  // Generate a fake embedding vector preview
  const vector = Array.from({ length: 8 }, () => 
    (Math.random() * 2 - 1).toFixed(6)
  );
  return `[${vector.join(', ')}, ...]`;
}

export function simulateEncryptionDelay(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));
}

export function generateQueryLatency(): number {
  // Generate realistic latency between 250-450ms
  return Math.floor(250 + Math.random() * 200);
}

export function generateEncryptionOverhead(): number {
  // Generate overhead between 5-15%
  return Math.floor(5 + Math.random() * 10);
}
