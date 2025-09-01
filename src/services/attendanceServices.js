// attendanceService.js

import { db } from '../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';
import dayjs from 'dayjs';

/**
 * Subscribes to attendance logs in real-time and returns the last 7 days of grouped data.
 * Filters by user ID if provided (for role-based access).
 *
 * @param {Function} callback - Function to receive processed logs or error.
 * @param {string} [userId] - Optional user ID to filter logs (e.g. for trainees).
 * @returns {Function} unsubscribe - Call this to stop listening.
 */
export const getAttendanceLogs = (callback, userId) => {
  const ref = collection(db, 'attendance');

  const unsubscribe = onSnapshot(
    ref,
    (snapshot) => {
      const rawLogs = snapshot.docs.map(doc => doc.data());

      const filteredLogs = userId
        ? rawLogs.filter(entry => entry.userId === userId)
        : rawLogs;

      const grouped = {};
      filteredLogs.forEach(entry => {
        const date = entry.date || dayjs(entry.timestamp?.toDate()).format('YYYY-MM-DD');
        if (!grouped[date]) {
          grouped[date] = { presentCount: 0, absentCount: 0 };
        }
        if (entry.present) {
          grouped[date].presentCount += 1;
        } else {
          grouped[date].absentCount += 1;
        }
      });

      const sortedDates = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b));
      const recentDates = sortedDates.slice(-7);

      const processed = recentDates.map(date => ({
        date: dayjs(date).format('ddd'),
        presentCount: grouped[date].presentCount,
        absentCount: grouped[date].absentCount,
      }));

      callback(processed);
    },
    (error) => {
      console.error('Real-time attendance listener error:', error);
      callback(null, error);
    }
  );

  return unsubscribe;
};