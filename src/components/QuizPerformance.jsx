import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import '../styles/QuizPerformance.css';

const QuizPerformance = () => {
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageScore, setAverageScore] = useState(0);
  const [missedCount, setMissedCount] = useState(0);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'quizResults'));
        const results = snapshot.docs.map(doc => doc.data());

        setQuizData(results);

        const totalScores = results.reduce((sum, entry) => sum + (entry.score || 0), 0);
        const avg = results.length > 0 ? totalScores / results.length : 0;
        setAverageScore(avg.toFixed(2));

        const missed = results.filter(entry => entry.status === 'missed').length;
        setMissedCount(missed);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching quiz data:', error);
        setLoading(false);
      }
    };

    fetchQuizData();
  }, []);

  if (loading) {
    return <div className="quiz-performance loading">Loading quiz performance...</div>;
  }

  return (
    <div className="quiz-performance">
      <h2>🎯 Quiz Performance Overview</h2>

      <div className="stats">
        <div className="stat-card">
          <h3>✅ Completed</h3>
          <p>{quizData.length - missedCount}</p>
        </div>
        <div className="stat-card">
          <h3>❌ Missed</h3>
          <p>{missedCount}</p>
        </div>
        <div className="stat-card">
          <h3>📊 Average Score</h3>
          <p>{averageScore} / 100</p>
        </div>
      </div>

      <div className="table-section">
        <h3>📋 Trainee Submissions</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {quizData.map((entry, index) => (
              <tr key={index}>
                <td>{entry.name}</td>
                <td>{entry.score ?? '—'}</td>
                <td className={entry.status === 'missed' ? 'missed' : 'completed'}>
                  {entry.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuizPerformance;