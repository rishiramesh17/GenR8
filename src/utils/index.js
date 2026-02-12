// Utility functions

export const createPageUrl = (pageName) => {
  const routes = {
    'Home': '/',
    'LogoGenerator': '/logo',
    'AvatarGenerator': '/avatar',
    'ArchitectureGenerator': '/architecture',
    'ProductGenerator': '/product',
    'AppUiGenerator': '/ui',
    'TattooGenerator': '/tattoo',
    'ImageEditor': '/editor',
    'Projects': '/projects',
  };
  return routes[pageName] || '/';
};

