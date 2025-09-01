import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import useAuth from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AttendanceOverview = () => {
  const { user } = useAuth();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [programFilter, setProgramFilter] = useState('All');
  const [cohortFilter, setCohortFilter] = useState('All');
  const [attendanceData, setAttendanceData] = useState([]);
  const [stats, setStats] = useState({ present: 0, absent: 0, total: 0 });
  const [frequentAbsentees, setFrequentAbsentees] = useState([]);

  const dateKey = selectedDate.toISOString().split('T')[0];

  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    const fetchAttendance = async () => {
      const snapshot = await getDocs(collection(db, 'attendance'));
      const filtered = snapshot.docs
        .map(doc => doc.data())
        .filter(entry => entry.date === dateKey)
        .filter(entry =>
          (programFilter === 'All' || entry.program === programFilter) &&
          (cohortFilter === 'All' || entry.cohort === cohortFilter)
        );

      setAttendanceData(filtered);

      const present = filtered.filter(e => e.present).length;
      const total = filtered.length;
      setStats({ present, absent: total - present, total });
    };

    fetchAttendance();
  }, [user, dateKey, programFilter, cohortFilter]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    const fetchAbsentees = async () => {
      const snapshot = await getDocs(collection(db, 'attendance'));
      const recent = snapshot.docs
        .map(doc => doc.data())
        .filter(entry => entry.present === false);

      const countMap = {};
      recent.forEach(entry => {
        countMap[entry.traineeId] = (countMap[entry.traineeId] || 0) + 1;
      });

      const flagged = Object.entries(countMap)
        .filter(([_, count]) => count >= 3)
        .map(([id]) => id);

      setFrequentAbsentees(flagged);
    };

    fetchAbsentees();
  }, [user]);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/unauthorized" />;
  }

  const chartData = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        label: 'Attendance',
        data: [stats.present, stats.absent],
        backgroundColor: ['#4caf50', '#f44336'],
      },
    ],
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📊 Attendance Overview</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label>Date: </label>
        <DatePicker selected={selectedDate} onChange={date => setSelectedDate(date)} />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Program: </label>
        <select value={programFilter} onChange={e => setProgramFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="Day">Day</option>
          <option value="Night">Night</option>
          <option value="Weekend">Weekend</option>
        </select>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Cohort: </label>
        <select value={cohortFilter} onChange={e => setCohortFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="Cohort A">Cohort A</option>
          <option value="Cohort B">Cohort B</option>
          <option value="Cohort C">Cohort C</option>
        </select>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3>📈 Stats for {dateKey}</h3>
        <p>Total Marked: {stats.total}</p>
        <p>✅ Present: {stats.present}</p>
        <p>❌ Absent: {stats.absent}</p>
        <Bar data={chartData} />
      </div>

      <ul style={{ marginTop: '2rem' }}>
        {attendanceData.map(entry => (
          <li key={entry.traineeId}>
            <strong>{entry.traineeId}</strong> —{' '}
            <span style={{ color: entry.present ? '#4caf50' : '#f44336' }}>
              {entry.present ? '✅ Present' : '❌ Absent'}
            </span>{' '}
            ({entry.program}, {entry.cohort})
          </li>
        ))}
      </ul>

      {frequentAbsentees.length > 0 && (
        <div style={{ marginTop: '2rem', background: '#fff3cd', padding: '1rem', borderRadius: '8px' }}>
          <h4>⚠️ Frequent Absentees</h4>
          <ul>
            {frequentAbsentees.map(id => (
              <li key={id}>{id}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AttendanceOverview;