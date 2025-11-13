#!/usr/bin/env node

// Database Initialization Script
// Run with: node scripts/init-db.js

import { initializeDatabase } from '../src/lib/supabaseUtils.js';

async function main() {
  console.log('🚀 Initializing Biovance Database...');

  try {
    await initializeDatabase();
    console.log('✅ Database initialization completed successfully!');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

main();