import { useState, useEffect } from 'react';
import { db } from '../firebase/config';  //updated
import { collection, getDocs } from 'firebase/firestore';
import useAuth from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const AttendanceTrends = () => {
  const { user } = useAuth();
  if (!user || user.role !== 'trainee') return <Navigate to="/unauthorized" />;

  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const fetchHistory = async () => {
      const snapshot = await getDocs(collection(db, 'attendance'));
      const filtered = snapshot.docs
        .map(doc => doc.data())
        .filter(entry => entry.traineeId === user.id)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setAttendanceHistory(filtered);
      calculateStreak(filtered);
    };

    fetchHistory();
  }, [user.id]);

  const calculateStreak = (entries) => {
    let count = 0;
    for (let i = entries.length - 1; i >= 0; i--) {
      if (entries[i].present) count++;
      else break;
    }
    setStreak(count);
  };

  const chartData = {
    labels: attendanceHistory.map(e => e.date),
    datasets: [
      {
        label: 'Attendance',
        data: attendanceHistory.map(e => (e.present ? 1 : 0)),
        backgroundColor: '#2196f3',
        borderColor: '#2196f3',
        fill: false,
        tension: 0.3,
      },
    ],
  };

  const feedback = streak >= 5
    ? `🔥 You're on a ${streak}-day streak! Keep showing up — you're building momentum.`
    : streak === 0
    ? `⏳ Let's get back on track. Every day counts, and your journey matters.`
    : `👏 ${streak} days strong — consistency is key. You're doing great!`;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📅 My Attendance Trends</h2>

      <div style={{ marginBottom: '1rem', background: '#e3f2fd', padding: '1rem', borderRadius: '8px' }}>
        <strong>{feedback}</strong>
      </div>

      <Line data={chartData} options={{
        scales: {
          y: {
            ticks: {
              callback: value => (value === 1 ? 'Present' : 'Absent'),
            },
            min: 0,
            max: 1,
          },
        },
      }} />

      <ul style={{ marginTop: '2rem' }}>
        {attendanceHistory.map(entry => (
          <li key={entry.date}>
            {entry.date} — {entry.present ? '✅ Present' : '❌ Absent'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AttendanceTrends;