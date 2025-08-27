import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const submitQuizResult = async (result) => {
  try {
    await addDoc(collection(db, 'quizResults'), {
      name: result.name,
      score: result.score,
      status: result.status,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error saving quiz result:', error);
  }
};

export default submitQuizResult;