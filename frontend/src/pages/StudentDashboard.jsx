import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import DoubtThread from '../components/DoubtThread';
import api from '../api/axios';

export default function StudentDashboard() {
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ subject: '', title: '', text: '' });
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  const fetchDoubts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/doubts');
      setDoubts(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load doubts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoubts();
    const interval = setInterval(fetchDoubts, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPosting(true);
    setError('');
    try {
      await api.post('/doubts', form);
      setForm({ subject: '', title: '', text: '' });
      fetchDoubts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post doubt');
    } finally {
      setPosting(false);
    }
  };

  const totalDoubts = doubts.length;
  const resolvedDoubts = doubts.filter((d) => d.status === 'resolved').length;
  const openDoubts = doubts.filter((d) => d.status === 'open').length;

  return (
    <div>
      <Navbar />
      <div className="dashboard">
        <div className="dashboard-col ask-col">
          <div className="panel-intro">
            <span className="eyebrow">Student workspace</span>
            <h2>Ask a Doubt</h2>
          </div>
          <form className="ask-form" onSubmit={handleSubmit}>
            <label>Subject</label>
            <input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="e.g. Operating Systems"
              required
            />
            <label>Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Short summary of your doubt"
              required
            />
            <label>Details</label>
            <textarea
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              placeholder="Type your question in detail..."
              rows={5}
              required
            />
            {error && <p className="error-text">{error}</p>}
            <button className="btn-primary" type="submit" disabled={posting}>
              {posting ? 'Posting...' : 'Submit Doubt'}
            </button>
          </form>
        </div>

        <div className="dashboard-col list-col">
          <div className="panel-intro row-between">
            <div>
              <span className="eyebrow">Overview</span>
              <h2>Your Doubts</h2>
            </div>
            <div className="summary-grid compact">
              <div className="stat-card">
                <span>Total</span>
                <strong>{totalDoubts}</strong>
              </div>
              <div className="stat-card">
                <span>Open</span>
                <strong>{openDoubts}</strong>
              </div>
              <div className="stat-card">
                <span>Resolved</span>
                <strong>{resolvedDoubts}</strong>
              </div>
            </div>
          </div>

          {loading && <p className="empty-state">Loading your doubts...</p>}
          {!loading && doubts.length === 0 && (
            <p className="empty-state">You haven't asked anything yet. Start by submitting your first doubt.</p>
          )}
          {doubts.map((d) => (
            <DoubtThread key={d._id} doubt={d} />
          ))}
        </div>
      </div>
    </div>
  );
}
