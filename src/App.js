// src/App.js

import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoleRoute from './components/RoleRoute';

// Pages
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminHome from './pages/AdminHome';
import TraineeHome from './pages/TraineeHome';
import AddModule from './pages/AddModule';
import CreateQuiz from './pages/CreateQuiz';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AttendanceOverview from './pages/AttendanceOverview';
import AttendanceTrends from './pages/AttendanceTrends';
import MakeAttendance from './pages/MakeAttendance';
import Module from './pages/Module';
import AddHandout from './pages/AddHandout';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* 🎬 Public Routes */}
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* 🛡️ Admin Routes */}
          <Route path="/admin" element={<RoleRoute role="admin" element={AdminHome} />} />
          <Route path="/admin/dashboard" element={<RoleRoute role="admin" element={AdminDashboardPage} />} />
          <Route path="/admin/add-module" element={<RoleRoute role="admin" element={AddModule} />} />
          <Route path="/admin/module/:id/create-quiz" element={<RoleRoute role="admin" element={CreateQuiz} />} />
          <Route path="/admin/module/:id/add-handout" element={<RoleRoute role="admin" element={AddHandout} />} />
          <Route path="/admin/module/:id" element={<RoleRoute role="admin" element={Module} />} />
          <Route path="/admin/attendance" element={<RoleRoute role="admin" element={AttendanceOverview} />} />
          <Route path="/admin/attendance/trends" element={<RoleRoute role="admin" element={AttendanceTrends} />} />
          <Route path="/admin/attendance/make" element={<RoleRoute role="admin" element={MakeAttendance} />} />

          {/* 🎓 Trainee Routes */}
          <Route path="/trainee" element={<RoleRoute role="trainee" element={TraineeHome} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;