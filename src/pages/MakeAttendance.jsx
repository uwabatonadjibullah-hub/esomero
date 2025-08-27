import { useState, useEffect } from 'react';
import { db } from '../firebase/config'; // updated
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const MakeAttendance = () => {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') return <Navigate to="/unauthorized" />;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [programFilter, setProgramFilter] = useState('All');
  const [trainees, setTrainees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [stats, setStats] = useState({ present: 0, absent: 0 });

  // Fetch trainees
  useEffect(() => {
    const fetchTrainees = async () => {
      const snapshot = await getDocs(collection(db, 'users'));
      const filtered = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user => user.role === 'trainee');
      setTrainees(filtered);
    };
    fetchTrainees();
  }, []);

  // Filtered trainees by program
  const filteredTrainees = trainees.filter(t =>
    programFilter === 'All' ? true : t.program === programFilter
  );

  // Mark attendance
  const handleMark = (id, present) => {
    setAttendance(prev => ({ ...prev, [id]: present }));
  };

  // Mark all present
  const markAllPresent = () => {
    const all = {};
    filteredTrainees.forEach(t => (all[t.id] = true));
    setAttendance(all);
  };

  // Submit attendance
  const handleSubmit = async () => {
    const dateKey = selectedDate.toISOString().split('T')[0];
    for (const trainee of filteredTrainees) {
      const docId = `${trainee.id}_${dateKey}`;
      await setDoc(doc(db, 'attendance', docId), {
        traineeId: trainee.id,
        date: dateKey,
        present: attendance[trainee.id] || false,
        program: trainee.program,
      });
    }
    alert('✅ Attendance saved successfully!');
    calculateStats();
  };

  // Calculate stats
  const calculateStats = () => {
    const present = Object.values(attendance).filter(Boolean).length;
    const total = filteredTrainees.length;
    setStats({ present, absent: total - present });
  };

  return (
    <div className="attendance-container" style={{ padding: '2rem' }}>
      <h2>🎓 Mark Attendance</h2>

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

      <button onClick={markAllPresent} style={{ marginBottom: '1rem' }}>
        ✅ Mark All Present
      </button>

      <ul>
        {filteredTrainees.map(t => (
          <li key={t.id}>
            {t.name} ({t.program})
            <input
              type="checkbox"
              checked={attendance[t.id] || false}
              onChange={e => handleMark(t.id, e.target.checked)}
              style={{ marginLeft: '1rem' }}
            />
          </li>
        ))}
      </ul>

      <button onClick={handleSubmit} style={{ marginTop: '1rem' }}>
        📤 Submit Attendance
      </button>

      <div style={{ marginTop: '2rem' }}>
        <h3>📊 Attendance Stats</h3>
        <p>Present: {stats.present}</p>
        <p>Absent: {stats.absent}</p>
      </div>
    </div>
  );
};

export default MakeAttendance;