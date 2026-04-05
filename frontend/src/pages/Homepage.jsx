import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteForm, getMyForms } from '../services/formService';
import FormCard from '../components/FormCard';
import CreateFormCard from '../components/CreateFormCard';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('myForm');
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadForms = async () => {
    try {
      setLoading(true);
      const data = await getMyForms();
      setForms(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForms();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this form?');
    if (!confirmed) return;

    try {
      await deleteForm(id);
      loadForms();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.contentWrapper}>
        <div style={styles.headerBlock}>
          <h1 style={styles.pageTitle}>My Forms</h1>
          <p style={styles.pageSubtitle}>Create, manage, and review your feedback forms in one place.</p>
        </div>

        <div style={styles.tabsRow}>
          <button
            onClick={() => setActiveTab('myForm')}
            style={activeTab === 'myForm' ? styles.activeTab : styles.tab}
          >
            My Forms
          </button>

          <button
            onClick={() => setActiveTab('filledForm')}
            style={activeTab === 'filledForm' ? styles.activeTab : styles.tab}
          >
            Filled Forms
          </button>
        </div>

        <div style={styles.panel}>
          {activeTab === 'myForm' ? (
            loading ? (
              <div style={styles.messageBox}>
                <p style={styles.messageText}>Loading your forms...</p>
              </div>
            ) : (
              <div style={styles.grid}>
                <CreateFormCard onClick={() => navigate('/create-form')} />

                {forms.map((form) => (
                  <FormCard
                    key={form._id}
                    form={form}
                    onEdit={(id) => navigate(`/edit-form/${id}`)}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )
          ) : (
            <div style={styles.placeholderBox}>
              <h2 style={styles.placeholderTitle}>Filled Forms</h2>
              <p style={styles.placeholderText}>No filled forms yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    padding: '36px 20px 60px',
    background: 'linear-gradient(180deg, #eef7fb 0%, #f7fbfd 100%)',
    display: 'flex',
    justifyContent: 'center',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: '1120px',
  },
  headerBlock: {
    marginBottom: '20px',
  },
  pageTitle: {
    margin: '0 0 10px 0',
    fontSize: '2.2rem',
    color: '#1f3b57',
  },
  pageSubtitle: {
    margin: 0,
    fontSize: '1rem',
    color: '#5f6f7f',
  },
  tabsRow: {
    display: 'flex',
    gap: '10px',
    marginBottom: '18px',
  },
  tab: {
    padding: '12px 18px',
    borderRadius: '12px',
    border: '1px solid #cfdbe6',
    background: '#ffffff',
    color: '#35506b',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  },
  activeTab: {
    padding: '12px 18px',
    borderRadius: '12px',
    border: '1px solid #2d7e86',
    background: '#2d7e86',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(45, 126, 134, 0.18)',
  },
  panel: {
    background: '#ffffff',
    borderRadius: '22px',
    padding: '26px',
    boxShadow: '0 8px 22px rgba(0, 0, 0, 0.08)',
    minHeight: '420px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '22px',
    alignItems: 'stretch',
  },
  messageBox: {
    minHeight: '260px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageText: {
    margin: 0,
    fontSize: '1rem',
    color: '#5f6f7f',
  },
  placeholderBox: {
    minHeight: '260px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  placeholderTitle: {
    margin: '0 0 10px 0',
    fontSize: '1.6rem',
    color: '#1f3b57',
  },
  placeholderText: {
    margin: 0,
    color: '#5f6f7f',
    fontSize: '1rem',
  },
};