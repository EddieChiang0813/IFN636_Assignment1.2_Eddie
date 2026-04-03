export default function FormCard({ form, onEdit, onDelete }) {
  return (
    <div style={styles.card}>
      <h3>{form.title}</h3>
      <p>{form.description || 'No description'}</p>
      <div style={styles.buttonRow}>
        <button onClick={() => onEdit(form._id)}>Edit</button>
        <button onClick={() => onDelete(form._id)}>Delete</button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: '#fff',
    padding: '16px',
    borderRadius: '12px',
    minHeight: '150px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  buttonRow: {
    display: 'flex',
    gap: '10px',
    marginTop: '12px',
  },
};