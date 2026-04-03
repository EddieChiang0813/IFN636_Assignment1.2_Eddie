export default function CreateFormCard({ onClick }) {
  return (
    <div style={styles.card} onClick={onClick}>
      <div style={styles.plus}>+</div>
      <p>Create Form</p>
    </div>
  );
}

const styles = {
  card: {
    background: '#fff',
    padding: '16px',
    borderRadius: '12px',
    minHeight: '150px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  plus: {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
};