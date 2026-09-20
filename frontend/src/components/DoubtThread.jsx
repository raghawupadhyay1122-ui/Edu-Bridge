function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString();
}

export default function DoubtThread({ doubt }) {
  return (
    <div className="doubt-card">
      <div className="doubt-header">
        <div>
          <span className="subject-tag">{doubt.subject}</span>
          <h3>{doubt.title}</h3>
        </div>
        <span className={`status-badge ${doubt.status}`}>{doubt.status}</span>
      </div>

      <div className="message from-student">
        <div className="message-meta">
          <strong>{doubt.studentName}</strong> · {formatTime(doubt.createdAt)}
        </div>
        <p>{doubt.text}</p>
      </div>

      {doubt.replies?.map((reply) => (
        <div className="message from-faculty" key={reply._id}>
          <div className="message-meta">
            <strong>{reply.facultyName}</strong> (Faculty) · {formatTime(reply.createdAt)}
          </div>
          <p>{reply.text}</p>
        </div>
      ))}

      {doubt.replies?.length === 0 && (
        <p className="no-reply-text">No reply yet. Sit tight!</p>
      )}
    </div>
  );
}
