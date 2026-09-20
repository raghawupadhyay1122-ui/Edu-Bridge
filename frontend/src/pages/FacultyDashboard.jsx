import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import DoubtThread from '../components/DoubtThread';
import api from '../api/axios';

export default function FacultyDashboard() {
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [replyDrafts, setReplyDrafts] = useState({});
  const [sendingId, setSendingId] = useState(null);
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

  const handleReply = async (id) => {
    const text = (replyDrafts[id] || '').trim();
    if (!text) return;
    setSendingId(id);
    try {
      await api.post(`/doubts/${id}/reply`, { text });
      setReplyDrafts({ ...replyDrafts, [id]: '' });
      fetchDoubts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reply');
    } finally {
      setSendingId(null);
    }
  };

  const visibleDoubts = doubts.filter((d) => filter === 'all' || d.status === filter);
  const totalDoubts = doubts.length;
  const openDoubts = doubts.filter((d) => d.status === 'open').length;
  const resolvedDoubts = doubts.filter((d) => d.status === 'resolved').length;

  return (
    <div>
      <Navbar />
      <div className="dashboard single-col">
        <div className="dashboard-header-row">
          <div>
            <span className="eyebrow">Faculty panel</span>
            <h2>Student Doubts</h2>
          </div>

          <div className="summary-grid wide">
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

        <div className="filter-toggle robust">
          {['all', 'open', 'resolved'].map((f) => (
            <button
              key={f}
              className={filter === f ? 'active' : ''}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {error && <p className="error-text">{error}</p>}
        {loading && <p className="empty-state">Loading doubts...</p>}
        {!loading && visibleDoubts.length === 0 && (
          <p className="empty-state">No doubts match this filter right now.</p>
        )}

        {visibleDoubts.map((d) => (
          <div key={d._id} className="reply-thread-wrapper">
            <DoubtThread doubt={d} />
            <div className="reply-box">
              <textarea
                rows={2}
                placeholder="Write a reply..."
                value={replyDrafts[d._id] || ''}
                onChange={(e) => setReplyDrafts({ ...replyDrafts, [d._id]: e.target.value })}
              />
              <button
                className="btn-primary"
                onClick={() => handleReply(d._id)}
                disabled={sendingId === d._id}
              >
                {sendingId === d._id ? 'Sending...' : 'Send Reply'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
