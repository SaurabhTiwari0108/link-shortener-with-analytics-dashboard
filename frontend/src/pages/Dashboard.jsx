import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { Copy, Trash2, ExternalLink, BarChart2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  // const [urls, setUrls] = useState([]);

  // Axios instance handles Auth implicitly

  const [formData, setFormData] = useState({ originalUrl: '', customAlias: '' });
  const [urlsList, setUrlsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUrls = async () => {
    try {
      const res = await axios.get('/urls');
      setUrlsList(res.data);
    } catch (err) {
      toast.error('Failed to fetch URLs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleShorten = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/urls/shorten', formData);
      toast.success('URL Shortened!');
      setFormData({ originalUrl: '', customAlias: '' });
      fetchUrls(); // refresh list
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Error shortening URL');
    }
  };

  const copyToClipboard = (shortCode) => {
    const fullUrl = `${window.location.origin.replace('5173', '5000')}/${shortCode}`; // using backend port
    navigator.clipboard.writeText(fullUrl);
    toast.success('Copied to clipboard!');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this link?')) return;
    try {
      await axios.delete(`/urls/${id}`);
      toast.success('URL Deleted');
      fetchUrls();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>Welcome, {user?.name}</h1>
        <p style={{ color: 'var(--text-muted)' }}>Here's an overview of your links.</p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Create New Link</h3>
        <form onSubmit={handleShorten} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="input-group" style={{ flex: 2, marginBottom: 0 }}>
            <label className="label">Destination URL</label>
            <input 
              type="url" 
              className="input-field" 
              placeholder="https://example.com/long-url"
              value={formData.originalUrl}
              onChange={(e) => setFormData({...formData, originalUrl: e.target.value})}
              required
            />
          </div>
          <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
            <label className="label">Custom Alias (Optional)</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="my-link"
              value={formData.customAlias}
              onChange={(e) => setFormData({...formData, customAlias: e.target.value})}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>Shorten</button>
        </form>
      </div>

      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Your Links ({urlsList.length})</h3>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {urlsList.map((url) => {
            const shortUrl = `${window.location.origin.replace('5173', '5000')}/${url.shortCode}`;
            return (
              <div key={url._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: 1, minWidth: '300px' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <a href={shortUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>{shortUrl}</a>
                    <ExternalLink size={16} />
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '400px' }}>
                    {url.originalUrl}
                  </div>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Created: {new Date(url.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{url.clicks || 0}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Clicks</div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary" onClick={() => copyToClipboard(url.shortCode)} title="Copy" style={{ padding: '0.5rem' }}>
                      <Copy size={18} />
                    </button>
                    <Link to={`/analytics/${url._id}`} className="btn btn-secondary" title="Analytics" style={{ padding: '0.5rem' }}>
                      <BarChart2 size={18} />
                    </Link>
                    <button className="btn btn-secondary" onClick={() => handleDelete(url._id)} title="Delete" style={{ padding: '0.5rem', color: 'var(--danger)' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
