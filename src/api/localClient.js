// Local API client that replaces base44
// Uses localStorage for data persistence

import { generateImage as deepAIGenerateImage } from './imageGenerator.js';

// Helper functions for localStorage
const getStorageKey = (entity) => `genr8_${entity}`;

const getFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Storage error:', error);
  }
};

// Generate a unique ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Image generation using DeepAI API
const generateImage = async ({ prompt, existing_image_urls }) => {
  try {
    // Use the prompt for generation
    // Note: existing_image_urls is available if you want to implement image-to-image
    const imageUrl = await deepAIGenerateImage(prompt);
    
    if (!imageUrl) {
      throw new Error('Failed to generate image');
    }
    
    return {
      url: imageUrl,
      id: generateId(),
    };
  } catch (error) {
    console.error('Image generation error:', error);
    // Fallback to placeholder if API fails
    const placeholderUrl = `https://picsum.photos/512/512?random=${Date.now()}`;
    return {
      url: placeholderUrl,
      id: generateId(),
      error: error.message,
    };
  }
};

// Mock file upload - converts file to data URL
const uploadFile = async ({ file }) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve({ file_url: e.target.result });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Entity handlers
const createEntityHandler = (entityName) => {
  const storageKey = getStorageKey(entityName);
  
  return {
    async create(data) {
      const items = getFromStorage(storageKey);
      const newItem = {
        id: generateId(),
        ...data,
        created_date: new Date().toISOString(),
        created_by: getCurrentUser()?.email || 'local@user.com',
      };
      items.push(newItem);
      saveToStorage(storageKey, items);
      return newItem;
    },
    
    async filter(query = {}, sort = '-created_date', limit = null) {
      let items = getFromStorage(storageKey);
      
      // Apply filters
      if (query && typeof query === 'object') {
        items = items.filter(item => {
          return Object.keys(query).every(key => {
            return item[key] === query[key];
          });
        });
      }
      
      // Apply sorting
      if (sort) {
        const [field, direction] = sort.startsWith('-') 
          ? [sort.slice(1), 'desc'] 
          : [sort, 'asc'];
        items.sort((a, b) => {
          const aVal = a[field];
          const bVal = b[field];
          if (direction === 'desc') {
            return bVal > aVal ? 1 : bVal < aVal ? -1 : 0;
          }
          return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        });
      }
      
      // Apply limit
      if (limit) {
        items = items.slice(0, limit);
      }
      
      return items;
    },
    
    async update(id, data) {
      const items = getFromStorage(storageKey);
      const index = items.findIndex(item => item.id === id);
      if (index === -1) {
        throw new Error(`${entityName} not found`);
      }
      items[index] = { ...items[index], ...data };
      saveToStorage(storageKey, items);
      return items[index];
    },
    
    async delete(id) {
      const items = getFromStorage(storageKey);
      const filtered = items.filter(item => item.id !== id);
      saveToStorage(storageKey, filtered);
      return true;
    },
  };
};

// Get current user from storage
const getCurrentUser = () => {
  const users = getFromStorage(getStorageKey('users'));
  return users[0] || null;
};

// Initialize default user if none exists
const initDefaultUser = () => {
  const user = getCurrentUser();
  if (!user) {
    const defaultUser = {
      id: generateId(),
      email: 'local@user.com',
      credits: 1000,
      total_generations: 0,
      created_date: new Date().toISOString(),
    };
    const users = [defaultUser];
    saveToStorage(getStorageKey('users'), users);
    return defaultUser;
  }
  return user;
};

// Initialize on load
initDefaultUser();

// Export the client interface matching base44 structure
export const localClient = {
  auth: {
    async me() {
      return getCurrentUser() || initDefaultUser();
    },
    
    async updateMe(data) {
      const users = getFromStorage(getStorageKey('users'));
      if (users.length === 0) {
        initDefaultUser();
      }
      const user = users[0];
      const updated = { ...user, ...data };
      users[0] = updated;
      saveToStorage(getStorageKey('users'), users);
      return updated;
    },
  },
  
  entities: {
    Project: createEntityHandler('projects'),
    GeneratedAsset: createEntityHandler('assets'),
  },
  
  integrations: {
    Core: {
      async GenerateImage(options) {
        return generateImage(options);
      },
      async UploadFile(options) {
        return uploadFile(options);
      },
    },
  },
};

// Export as default for compatibility
export default localClient;

