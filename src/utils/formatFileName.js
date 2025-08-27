// src/utils/formatFileName.js

export const formatFileName = (name) => {
  return name.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/gi, '');
};