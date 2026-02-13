// src/services/avatarService.jsx

export const AVATAR_PARTS = {
  body: [
    { id: 'body_default', name: 'Padrão', color: '#ffdbac' },
    { id: 'body_light', name: 'Claro', color: '#fde5d0' },
    { id: 'body_medium', name: 'Médio', color: '#d4a574' },
    { id: 'body_dark', name: 'Escuro', color: '#8d5524' },
    { id: 'body_fantasy_blue', name: 'Azul Mágico', color: '#6dd5ed' },
    { id: 'body_fantasy_purple', name: 'Roxo Místico', color: '#b490ca' },
    { id: 'body_fantasy_green', name: 'Verde Élfico', color: '#a8e6cf' },
  ],
  
  head: [
    { id: 'head_default', name: 'Padrão', color: '#ffdbac' },
    { id: 'head_light', name: 'Claro', color: '#fde5d0' },
    { id: 'head_medium', name: 'Médio', color: '#d4a574' },
    { id: 'head_dark', name: 'Escuro', color: '#8d5524' },
  ],
  
  hair: [
    { id: 'hair_default', name: 'Castanho', color: '#6b4423' },
    { id: 'hair_black', name: 'Preto', color: '#2c2c2c' },
    { id: 'hair_blonde', name: 'Loiro', color: '#f5d76e' },
    { id: 'hair_red', name: 'Ruivo', color: '#d2691e' },
    { id: 'hair_blue', name: 'Azul', color: '#4a90e2' },
    { id: 'hair_pink', name: 'Rosa', color: '#ff69b4' },
    { id: 'hair_green', name: 'Verde', color: '#7cb342' },
    { id: 'hair_purple', name: 'Roxo', color: '#9b59b6' },
  ],
  
  eyes: [
    { id: 'eyes_default', name: 'Castanho', color: '#6b4423' },
    { id: 'eyes_blue', name: 'Azul', color: '#4a90e2' },
    { id: 'eyes_green', name: 'Verde', color: '#7cb342' },
    { id: 'eyes_gray', name: 'Cinza', color: '#808080' },
    { id: 'eyes_amber', name: 'Âmbar', color: '#ffbf00' },
    { id: 'eyes_purple', name: 'Roxo Mágico', color: '#9b59b6' },
  ],
  
  clothes: [
    { id: 'clothes_default', name: 'Túnica Azul', color: '#3b82f6' },
    { id: 'clothes_red', name: 'Túnica Vermelha', color: '#ef4444' },
    { id: 'clothes_green', name: 'Túnica Verde', color: '#10b981' },
    { id: 'clothes_purple', name: 'Túnica Roxa', color: '#8b5cf6' },
    { id: 'clothes_yellow', name: 'Túnica Dourada', color: '#fbbf24' },
    { id: 'clothes_black', name: 'Túnica Preta', color: '#1f2937' },
    { id: 'clothes_white', name: 'Túnica Branca', color: '#f9fafb' },
  ],
  
  accessories: [
    { id: 'accessory_none', name: 'Nenhum', color: 'transparent' },
    { id: 'accessory_glasses', name: 'Óculos', color: '#4a5568' },
    { id: 'accessory_crown', name: 'Coroa', color: '#ffd700' },
    { id: 'accessory_halo', name: 'Auréola', color: '#ffd700' },
    { id: 'accessory_wings', name: 'Asas', color: '#00ff88' },
  ],
};

// Helper function to get avatar part by ID
export const getAvatarPart = (partType, partId) => {
  const partsArray = AVATAR_PARTS[partType];
  if (!partsArray || !Array.isArray(partsArray)) {
    console.warn(`[avatarService] Invalid part type: "${partType}"`);
    return null;
  }
  return partsArray.find(p => p.id === partId) || null;
};

// Helper function to get random avatar part
export const getRandomAvatarPart = (partType) => {
  const partsArray = AVATAR_PARTS[partType];
  if (!partsArray || !Array.isArray(partsArray)) {
    return null;
  }
  return partsArray[Math.floor(Math.random() * partsArray.length)];
};

// Generate a random avatar configuration
export const generateRandomAvatar = () => {
  return {
    body: getRandomAvatarPart('body')?.id || 'body_default',
    head: getRandomAvatarPart('head')?.id || 'head_default',
    hair: getRandomAvatarPart('hair')?.id || 'hair_default',
    eyes: getRandomAvatarPart('eyes')?.id || 'eyes_default',
    clothes: getRandomAvatarPart('clothes')?.id || 'clothes_default',
    accessories: getRandomAvatarPart('accessories')?.id || 'accessory_none',
  };
};
