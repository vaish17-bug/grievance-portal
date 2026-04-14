import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'CITIZEN' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await registerUser(form);
      login({ name: res.data.name, role: res.data.role, id: res.data.id }, res.data.token);
      toast.success('Registered successfully!');
      // Redirect based on role
      if (res.data.role === 'ADMIN') navigate('/admin');
      else if (res.data.role === 'WORKER') navigate('/worker');
      else navigate('/citizen');
    } catch (error) {
      toast.error(error.response?.data || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Full Name"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />

          <input type="email" placeholder="Email"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />

          <input type="password" placeholder="Password"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />

          <input type="text" placeholder="Phone (optional)"
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />

          {/* Role selector */}
          <select className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
            <option value="CITIZEN">Citizen</option>
            <option value="WORKER">Garbage Collector / Worker</option>
          </select>

          <button type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700">
            Register
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-green-600 font-semibold">Login</Link>
        </p>
      </div>
    </div>
  );
}