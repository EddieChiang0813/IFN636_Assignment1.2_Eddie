import { useState } from 'react';

export default function FormCard({ form, onEdit, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div style={styles.card}>
      <div style={styles.content}>
        <h3 style={styles.title}>{form.title}</h3>
        <p style={styles.description}>{form.description || 'No description'}</p>
      </div>

      <div style={styles.menuWrapper}>
        <button
          style={styles.menuButton}
          onClick={() => setShowMenu((prev) => !prev)}
          aria-label="More options"
        >
          ...
        </button>

        {showMenu && (
          <div style={styles.dropdownMenu}>
            <button
              style={styles.dropdownItem}
              onClick={() => {
                setShowMenu(false);
                onEdit(form._id);
              }}
            >
              Edit
            </button>
            <button
              style={styles.dropdownItem}
              onClick={() => {
                setShowMenu(false);
                onDelete(form._id);
              }}
            >
              Delete
            </button>
          </div>
        )}
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
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  content: {
    paddingRight: '12px',
  },
  title: {
    margin: '0 0 10px 0',
  },
  description: {
    margin: 0,
  },
  menuWrapper: {
    position: 'absolute',
    right: '16px',
    bottom: '16px',
  },
  menuButton: {
    background: 'transparent',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    lineHeight: 1,
    padding: '4px 8px',
  },
  dropdownMenu: {
    position: 'absolute',
    right: 0,
    bottom: '36px',
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
    display: 'flex',
    flexDirection: 'column',
    minWidth: '100px',
    zIndex: 10,
  },
  dropdownItem: {
    background: 'none',
    border: 'none',
    padding: '10px 14px',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '14px',
  },
};