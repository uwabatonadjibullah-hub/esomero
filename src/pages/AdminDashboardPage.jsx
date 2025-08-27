import React from 'react';
import './Dashboard.css';
import { useDashboardData } from '../hooks/useDashboardData';

import PerformanceCharts from '../components/PerformanceCharts';
import ModuleStats from '../components/ModuleStats';
import ScoreHistogram from '../components/ScoreHistogram';
import AttendanceSummary from '../components/AttendanceSummary'; // NEW
import QuizPerformance from '../components/QuizPerformance';
import QuoteOfTheDay from '../components/QuoteOfTheDay';
import DownloadReportButton from '../components/DownloadReportButton';

const AdminDashboardPage = () => {
  const { scores, modules, loading, error } = useDashboardData();

  if (loading) return <div className="dashboard-loading">Loading dashboard...</div>;
  if (error) return <div className="dashboard-error">Error: {error.message}</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header slide-up">
        <h1>📊 Admin Dashboard</h1>
        <QuoteOfTheDay />
        <DownloadReportButton scores={scores} modules={modules} />
      </header>

      <section className="dashboard-section slide-up">
        <PerformanceCharts scores={scores} />
      </section>

      <section className="dashboard-section slide-up">
        <ModuleStats modules={modules} />
      </section>

      <section className="dashboard-section slide-up">
        <ScoreHistogram scores={scores} />
      </section>

      <section className="dashboard-section slide-up">
        <AttendanceSummary /> {/* NEW: 7-day class-wide attendance */}
      </section>

      <section className="dashboard-section slide-up">
        <QuizPerformance />
      </section>

      <footer className="dashboard-footer">
        <p>Secure. Scalable. Cinematic. Your dashboard, your story.</p>
      </footer>
    </div>
  );
};

export default AdminDashboardPage;