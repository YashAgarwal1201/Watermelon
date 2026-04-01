// src/federation-entry.ts
// This file is ONLY used when the app is loaded as a federated remote
// It prevents main.ts from executing in the host app
export { mount } from './bootstrap';
