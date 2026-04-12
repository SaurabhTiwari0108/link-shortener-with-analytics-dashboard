import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from '../api/axios';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/auth/login', formData);
      login(res.data.user, res.data.token);
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-split" style={{ display: 'flex', minHeight: '100vh', width: '100vw', background: 'var(--bg-gradient)', color: 'var(--text-color)' }}>
      {/* Left Side: Brand & Image */}
      <div className="login-image-side" style={{ 
        flex: 1, 
        backgroundImage: `url('/login-bg.png')`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3rem',
        textShadow: '0px 2px 10px rgba(0,0,0,0.8)'
      }}>
        {/* Dark overlay for better text readability */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}></div>
        
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: '#fff' }}>
          <h1 style={{ 
            fontSize: '4rem', 
            fontWeight: 'bold', 
            marginBottom: '1rem',
            background: 'var(--primary-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.5))'
          }}>Linklytics</h1>
          <p style={{ fontSize: '1.25rem', maxWidth: '500px', lineHeight: '1.6', opacity: 0.9 }}>
            The ultimate infrastructure to shorten, track, and analyze your URLs. Get comprehensive details on your audience from anywhere in the world.
          </p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '2rem'
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Welcome Back</h2>
            <p style={{ color: 'var(--text-muted)' }}>Enter your credentials to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2.5rem', borderRadius: '16px' }}>
            <div className="input-group">
              <label className="label" style={{ fontWeight: 600 }}>Email Address</label>
              <input 
                type="email" 
                className="input-field" 
                placeholder="hello@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required 
                style={{ borderRadius: '8px' }}
              />
            </div>
            
            <div className="input-group" style={{ marginBottom: '2rem' }}>
              <label className="label" style={{ fontWeight: 600 }}>Password</label>
              <input 
                type="password" 
                className="input-field" 
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required 
                style={{ borderRadius: '8px' }}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', fontWeight: 'bold', borderRadius: '8px' }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            New to Linklytics? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
