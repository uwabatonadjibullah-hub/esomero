import { db } from '../firebase/config'; // your Firestore config
import { collection, getDocs } from 'firebase/firestore';

export const fetchDashboardData = async () => {
  try {
    const scoresSnapshot = await getDocs(collection(db, 'scores'));
    const modulesSnapshot = await getDocs(collection(db, 'modules'));

    const scores = scoresSnapshot.docs.map(doc => doc.data());
    const modules = modulesSnapshot.docs.map(doc => doc.data());

    return { scores, modules };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};