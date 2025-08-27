import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { getAttendanceLogs } from '../services/attendanceService'; // Replace with Firestore logic if needed
import { useAuth } from '../hooks/useAuth'; // Optional role-based access

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const App = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [insights, setInsights] = useState(null);
  const { user } = useAuth(); // Optional

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const logs = await getAttendanceLogs();
        setAttendanceData(logs);
        generateInsights(logs);
      } catch (err) {
        console.error('Error fetching attendance data:', err);
        setError('Failed to load attendance data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  const generateInsights = (logs) => {
    const totalPresent = logs.reduce((sum, log) => sum + log.presentCount, 0);
    const totalAbsent = logs.reduce((sum, log) => sum + log.absentCount, 0);
    const bestDay = logs.reduce((max, log) => log.presentCount > max.presentCount ? log : max);
    const worstDay = logs.reduce((min, log) => log.presentCount < min.presentCount ? log : min);
    const average = (totalPresent / logs.length).toFixed(1);

    setInsights({
      totalPresent,
      totalAbsent,
      bestDay: bestDay.date,
      worstDay: worstDay.date,
      average
    });
  };

  const chartData = {
    labels: attendanceData.map(log => log.date),
    datasets: [
      {
        label: 'Present',
        data: attendanceData.map(log => log.presentCount),
        backgroundColor: 'rgb(34, 197, 94)',
        borderColor: 'rgb(22, 163, 74)',
        borderWidth: 1,
      },
      {
        label: 'Absent',
        data: attendanceData.map(log => log.absentCount),
        backgroundColor: 'rgb(239, 68, 68)',
        borderColor: 'rgb(220, 38, 38)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Weekly Attendance Snapshot 📊',
        font: {
          size: 20,
          weight: 'bold',
          family: 'Inter, sans-serif'
        },
        color: '#1f2937'
      },
      legend: {
        position: 'bottom',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 5 },
        grid: { color: 'rgba(229, 231, 235, 0.5)' },
      },
    },
  };

  if (user?.role !== 'admin') {
    return (
      <div className="text-center mt-20 text-red-600 font-semibold">
        🚫 Access denied. Admins only.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg shadow-inner">
        <p className="text-gray-500 text-lg animate-pulse">Loading attendance summary...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg shadow-inner border border-red-200">
        <p className="text-red-700 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg border border-gray-100 transform transition-all duration-500 ease-in-out hover:shadow-2xl hover:scale-[1.01]">
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
        Attendance Summary
      </h2>
      <Bar data={chartData} options={chartOptions} />
      <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
        <div>✅ Total Present: <span className="font-semibold text-green-600">{insights.totalPresent}</span></div>
        <div>❌ Total Absent: <span className="font-semibold text-red-600">{insights.totalAbsent}</span></div>
        <div>📈 Best Day: <span className="font-semibold">{insights.bestDay}</span></div>
        <div>📉 Worst Day: <span className="font-semibold">{insights.worstDay}</span></div>
        <div className="col-span-2 text-center">📊 Average Daily Attendance: <span className="font-semibold">{insights.average}</span></div>
      </div>
      <p className="mt-6 text-center text-sm font-medium text-gray-500 bg-gray-50 p-3 rounded-lg">
        Engagement trends help us support learners better. Let’s keep the momentum going! 🚀
      </p>
    </div>
  );
};

export default App;