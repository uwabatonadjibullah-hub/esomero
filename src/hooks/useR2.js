// src/hooks/useR2.js

import { uploadToR2 } from '../services/r2Service';
import { formatFileName } from '../utils/formatFileName';

export const useR2 = (moduleId) => {
  const uploadHandout = async (file, name) => {
    const key = `modules/${moduleId}/${formatFileName(name)}.pdf`;
    const url = await uploadToR2(file, key);
    return url;
  };

  return { uploadHandout };
};