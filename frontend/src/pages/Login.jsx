import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/auth/login', formData);
      login(response.data);
      navigate('/home');
    } catch (error) {
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div
      className="min-h-screen flex items-start justify-center pt-20"
      style={{ background: 'linear-gradient(180deg, #eef7fb 0%, #f7fbfd 100%)' }}
    >
      <div className="w-full max-w-md px-4">
        <form
          onSubmit={handleSubmit}
          className="p-6 shadow-md rounded"
          style={{ backgroundColor: '#B3CDE0' }}
        >
          <h1 className="text-2xl font-bold mb-4 text-center" style={{ color: '#1f3b57' }}>
            Login
          </h1>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
