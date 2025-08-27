// src/services/moduleService.js

import { db, storage } from '../firebase/config'; // updated
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';

// 🔍 Get all modules
export const getModules = async () => {
  const snapshot = await getDocs(collection(db, 'modules'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// 📦 Get a specific module by ID
export const getModuleById = async (id) => {
  const ref = doc(db, 'modules', id);
  const snapshot = await getDoc(ref);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

// ➕ Add a new module
export const addModule = async (moduleData) => {
  await addDoc(collection(db, 'modules'), moduleData);
};

// 📄 Upload a handout PDF to Storage and link it to the module
export const uploadHandout = async (moduleId, name, file) => {
  const storageRef = ref(storage, `handouts/${moduleId}/${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  const handoutRef = doc(db, 'modules', moduleId);
  await updateDoc(handoutRef, {
    [`handouts.${name}`]: url // Use dot notation to merge into handouts object
  });
};

// 📝 Create a quiz under a module
export const createQuiz = async (moduleId, quizData) => {
  const quizRef = collection(db, 'modules', moduleId, 'quizzes');
  await addDoc(quizRef, quizData);
};