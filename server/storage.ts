// Storage interface for future database operations
// Currently using in-memory storage as per project requirements
// No persistent data storage needed for this project

export interface IStorage {
  // Future CRUD operations can be added here if needed
}

export class MemStorage implements IStorage {
  constructor() {
    // In-memory storage for quotes and contacts (if needed)
  }
}

export const storage = new MemStorage();
