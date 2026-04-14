import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(form);
      login({ name: res.data.name, role: res.data.role, id: res.data.id }, res.data.token);
      toast.success('Login successful!');

      // Redirect based on role
      if (res.data.role === 'ADMIN') navigate('/admin');
      else if (res.data.role === 'WORKER') navigate('/worker');
      else navigate('/citizen');
    } catch (error) {
  console.log(error.response?.data);
  toast.error(error.response?.data || 'Login failed');
}
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
          🏛️ Municipality Portal
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
          >
            Login
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-600">
          New citizen?{' '}
          <Link to="/register" className="text-green-600 font-semibold">Register here</Link>
        </p>
        <p className="text-center mt-2 text-sm text-gray-500">
          <Link to="/public" className="text-gray-500 underline">View Public Dashboard</Link>
        </p>
      </div>
    </div>
  );
}