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
        <div style={styles.tabs}>
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

      {activeTab === 'myForm' ? (
        <div style={styles.grid}>
          <CreateFormCard onClick={() => navigate('/create-form')} />

          {loading ? (
            <p>Loading...</p>
          ) : (
            forms.map((form) => (
              <FormCard
                key={form._id}
                form={form}
                onEdit={(id) => navigate(`/edit-form/${id}`)}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      ) : (
        <div style={styles.placeholderBox}>
          <p>No filled forms yet.</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: '30px',
    background: '#e1e1e1',
    minHeight: '100vh',
  },
  tab: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    background: '#fff',
    cursor: 'pointer',
    fontSize: '16px',
  },
  activeTab: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid #1f6f78',
    background: '#1f6f78',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  placeholderBox: {
    background: '#fff',
    padding: '30px',
    borderRadius: '12px',
  },
};