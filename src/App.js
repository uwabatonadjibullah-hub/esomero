import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminHome from './pages/AdminHome';
import TraineeHome from './pages/TraineeHome';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/trainee" element={<TraineeHome />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;