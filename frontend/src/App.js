import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import HomePage from './pages/Homepage';
import CreateFormPage from './pages/CreateFormPage';
import EditFormPage from './pages/EditFormPage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/create-form" element={<CreateFormPage />} />
        <Route path="/edit-form/:id" element={<EditFormPage />} />
      </Routes>
    </Router>
  );
}

export default App;
