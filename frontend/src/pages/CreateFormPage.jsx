import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createForm } from '../services/formService';


const emptyQuestion = () => ({
  questionText: '',
  questionType: 'text',
  options: ['']
}); 

export default function CreateFormPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const navigate = useNavigate();

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;

    if (field === 'questionType' && value === 'text') {
      updated[index].options = [''];
    }

    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([...questions, emptyQuestion()]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push('');
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedQuestions = questions.map((q) => ({
      questionText: q.questionText,
      questionType: q.questionType,
      options: q.questionType === 'multiple-choice'
        ? q.options.filter((opt) => opt.trim() !== '')
        : []
    }));

    try {
      await createForm({ title, description, questions: cleanedQuestions });
      alert('Form created successfully');
      navigate('/home');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.formContainer}>
        <div style={styles.headerCard}>
          <h1 style={styles.pageTitle}>Create Form</h1>
          <input
            type="text"
            placeholder="Form title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={styles.titleInput}
          />

          <textarea
            placeholder="Form description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.descriptionInput}
          />
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {questions.map((question, qIndex) => (
            <div key={qIndex} style={styles.questionCard}>
              <input
                type="text"
                placeholder={`Question ${qIndex + 1}`}
                value={question.questionText}
                onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                required
                style={styles.questionInput}
              />

              <select
                value={question.questionType}
                onChange={(e) => handleQuestionChange(qIndex, 'questionType', e.target.value)}
                style={styles.selectInput}
              >
                <option value="text">Text</option>
                <option value="multiple-choice">Multiple Choice</option>
              </select>

              {question.questionType === 'multiple-choice' && (
                <div style={styles.optionsBox}>
                  {question.options.map((option, oIndex) => (
                    <input
                      key={oIndex}
                      type="text"
                      placeholder={`Option ${oIndex + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                      style={styles.optionInput}
                    />
                  ))}
                  <button type="button" onClick={() => addOption(qIndex)} style={styles.secondaryButton}>
                    Add Option
                  </button>
                </div>
              )}

              {questions.length > 1 && (
                <button type="button" onClick={() => removeQuestion(qIndex)} style={styles.deleteButton}>
                  Delete Question
                </button>
              )}
            </div>
          ))}

          <div style={styles.actionRow}>
            <button type="button" onClick={addQuestion} style={styles.secondaryButton}>
              Add Question
            </button>
            <button type="submit" style={styles.primaryButton}>
              Create Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    padding: '40px 20px 60px',
    background: 'linear-gradient(180deg, #eef7fb 0%, #f7fbfd 100%)',
    display: 'flex',
    justifyContent: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: '980px',
  },
  pageTitle: {
    margin: '0 0 20px 0',
    fontSize: '2rem',
    color: '#1f3b57',
  },
  headerCard: {
    background: '#ffffff',
    borderRadius: '18px',
    padding: '28px 32px',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
    marginBottom: '24px',
    borderTop: '8px solid #B3CDE0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  titleInput: {
    width: '100%',
    fontSize: '2rem',
    fontWeight: 600,
    border: 'none',
    outline: 'none',
    marginBottom: '14px',
    color: '#1f1f1f',
    background: 'transparent',
  },
  descriptionInput: {
    width: '100%',
    fontSize: '1rem',
    border: 'none',
    outline: 'none',
    resize: 'vertical',
    minHeight: '70px',
    color: '#555',
    background: 'transparent',
  },
  questionCard: {
    background: '#ffffff',
    padding: '24px 28px',
    borderRadius: '18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
  },
  questionInput: {
    width: '100%',
    fontSize: '1.2rem',
    border: 'none',
    outline: 'none',
    paddingBottom: '8px',
    borderBottom: '1px solid #d8d8d8',
    background: 'transparent',
  },
  selectInput: {
    width: '220px',
    padding: '10px 12px',
    borderRadius: '10px',
    border: '1px solid #d0d7de',
    fontSize: '1rem',
    background: '#fff',
  },
  optionsBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '4px',
  },
  optionInput: {
    width: '100%',
    maxWidth: '500px',
    padding: '10px 12px',
    borderRadius: '10px',
    border: '1px solid #d0d7de',
    fontSize: '1rem',
  },
  actionRow: {
    display: 'flex',
    gap: '14px',
    justifyContent: 'flex-start',
    paddingTop: '4px',
  },
  primaryButton: {
    backgroundColor: '#4a67d6',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 22px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  secondaryButton: {
    backgroundColor: '#B3CDE0',
    color: '#1f3b57',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 18px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    alignSelf: 'flex-start',
  },
  deleteButton: {
    backgroundColor: '#fff1f1',
    color: '#b71111',
    border: '1px solid #f0c8c8',
    borderRadius: '10px',
    padding: '10px 16px',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    alignSelf: 'flex-start',
  },
};
