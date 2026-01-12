// This script generates a minimal bun.lockb if it doesn't exist
// Railway will update it during build
import { existsSync } from 'fs';
import { writeFileSync } from 'fs';

// Create an empty lockfile placeholder
// Railway will regenerate it during bun install
if (!existsSync('bun.lockb')) {
  console.log('Creating placeholder bun.lockb...');
  writeFileSync('bun.lockb', '');
}

