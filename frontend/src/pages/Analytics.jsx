import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import { ArrowLeft, MapPin, Monitor, Calendar } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`/analytics/${id}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [id]);

  if (loading) return <div>Loading Analytics...</div>;
  if (!data) return <div>Data not found</div>;

  const { url, stats } = data;
  const shortUrl = `${window.location.origin.replace('5173', '5000')}/${url.shortCode}`;

  // Process data for Line Chart (Clicks over time)
  const lineData = {
    labels: Object.keys(stats.clicksOverTime),
    datasets: [
      {
        label: 'Clicks',
        data: Object.values(stats.clicksOverTime),
        borderColor: '#4318ff',
        backgroundColor: 'rgba(67, 24, 255, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0 } },
    },
  };

  // Process data for Doughnut Charts
  const generateColors = (count) => {
    const colors = ['#4318ff', '#01b574', '#ee5d50', '#ffb547', '#2b3674'];
    return colors.slice(0, count);
  };

  const deviceData = {
    labels: Object.keys(stats.devices),
    datasets: [
      {
        data: Object.values(stats.devices),
        backgroundColor: generateColors(Object.keys(stats.devices).length),
        borderWidth: 0,
      },
    ],
  };

  const locationData = {
    labels: Object.keys(stats.locations),
    datasets: [
      {
        data: Object.values(stats.locations),
        backgroundColor: generateColors(Object.keys(stats.locations).length),
        borderWidth: 0,
      },
    ],
  };

  const StatCard = ({ title, value, icon }) => (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '200px' }}>
      <div style={{ padding: '1rem', backgroundColor: 'var(--secondary)', borderRadius: '12px', color: 'var(--primary)' }}>
        {icon}
      </div>
      <div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{title}</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{value}</div>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/" className="btn btn-secondary" style={{ padding: '0.5rem' }}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Analytics Overview</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Tracking for: <a href={shortUrl} target="_blank" rel="noreferrer" style={{ fontWeight: 'bold' }}>{shortUrl}</a>
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <StatCard title="Total Clicks" value={stats.totalClicks} icon={<MapPin size={24} />} />
        <StatCard title="Unique Visitors" value={stats.uniqueVisitors} icon={<Monitor size={24} />} />
        
        {/* QR Code Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1, minWidth: '250px' }}>
             <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>QR Code</div>
                <div style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem' }}>Scan to visit link</div>
            </div>
            <div style={{ background: 'white', padding: '0.5rem', borderRadius: '8px' }}>
              <QRCodeSVG value={shortUrl} size={80} />
            </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div className="glass-panel" style={{ flex: 2, minWidth: '400px', padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} /> Clicks Over Time
          </h3>
          <div style={{ height: '300px' }}>
            {Object.keys(stats.clicksOverTime).length > 0 ? (
                <Line data={lineData} options={lineOptions} />
            ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No data yet.</div>
            )}
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: '300px' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', flex: 1 }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Monitor size={18} /> Devices Breakdown
            </h3>
            <div style={{ height: '200px', display: 'flex', justifyContent: 'center' }}>
                {Object.keys(stats.devices).length > 0 ? (
                    <Doughnut data={deviceData} options={{ maintainAspectRatio: false }} />
                ) : (
                     <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No data yet.</div>
                )}
            </div>
          </div>
          
          <div className="glass-panel" style={{ padding: '1.5rem', flex: 1 }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} /> Location Breakdown
            </h3>
            <div style={{ height: '200px', display: 'flex', justifyContent: 'center' }}>
                {Object.keys(stats.locations).length > 0 ? (
                    <Doughnut data={locationData} options={{ maintainAspectRatio: false }} />
                ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No data yet.</div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
