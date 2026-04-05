import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFormById, updateForm } from '../services/formService';


const emptyQuestion = () => ({
  questionText: '',
  questionType: 'text',
  options: ['']
});

export default function EditFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    const loadForm = async () => {
      try {
        const data = await getFormById(id);
        setTitle(data.title || '');
        setDescription(data.description || '');
        setQuestions(
          data.questions?.length
            ? data.questions.map((q) => ({
                questionText: q.questionText || '',
                questionType: q.questionType || 'text',
                options: q.options?.length ? q.options : ['']
              }))
            : [emptyQuestion()]
        );
      } catch (error) {
        alert(error.message);
      }
    };

    loadForm();
  }, [id]);

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
      await updateForm(id, { title, description, questions: cleanedQuestions });
      alert('Form updated successfully');
      navigate('/home');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={styles.page}>
      {isPreview ? (
        <div style={styles.previewWrapper}>
          <div style={styles.previewTopBar}>
            <button
              type="button"
              onClick={() => setIsPreview(false)}
              style={styles.backButton}
            >
              ← Back
            </button>
          </div>

          <div style={styles.previewCard}>
            <h1 style={styles.previewTitle}>{title || 'Untitled Form'}</h1>
            <p style={styles.previewDescription}>{description || 'No description'}</p>

            <div style={styles.previewQuestions}>
              {questions.map((question, qIndex) => (
                <div key={qIndex} style={styles.previewQuestionBlock}>
                  <p style={styles.previewQuestionText}>
                    {qIndex + 1}. {question.questionText || `Question ${qIndex + 1}`}
                  </p>

                  {question.questionType === 'multiple-choice' ? (
                    <div style={styles.previewOptions}>
                      {question.options
                        .filter((option) => option.trim() !== '')
                        .map((option, oIndex) => (
                          <label key={oIndex} style={styles.previewOptionLabel}>
                            <input type="radio" name={`preview-question-${qIndex}`} disabled />
                            <span>{option}</span>
                          </label>
                        ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      placeholder="Your answer"
                      disabled
                      style={styles.previewTextInput}
                    />
                  )}
                </div>
              ))}
            </div>

            <button type="button" style={styles.submitPreviewButton}>
              Submit
            </button>
          </div>
        </div>
      ) : (
        <div style={styles.formContainer}>
          <div style={styles.headerCard}>
            <div style={styles.headerTopRow}>
              <h1 style={styles.pageTitle}>Edit Form</h1>
              <button
                type="button"
                onClick={() => setIsPreview(true)}
                style={styles.previewButton}
              >
                Preview
              </button>
            </div>

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
                Update Form
              </button>
            </div>
          </form>
        </div>
      )}
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
  previewWrapper: {
    width: '100%',
    maxWidth: '1100px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  previewTopBar: {
    width: '100%',
    maxWidth: '980px',
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: '18px',
  },
  backButton: {
    backgroundColor: '#ffffff',
    color: '#1f3b57',
    border: '1px solid #cfdbe6',
    borderRadius: '10px',
    padding: '10px 16px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  previewCard: {
    width: '100%',
    maxWidth: '980px',
    background: '#ffffff',
    borderRadius: '22px',
    padding: '36px 48px 42px',
    boxShadow: '0 8px 22px rgba(0, 0, 0, 0.10)',
    borderTop: '10px solid #B3CDE0',
  },
  previewTitle: {
    margin: '0 0 16px 0',
    fontSize: '2.4rem',
    color: '#1f1f1f',
  },
  previewDescription: {
    margin: '0 0 34px 0',
    fontSize: '1.05rem',
    color: '#666',
  },
  previewQuestions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '22px',
  },
  previewQuestionBlock: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '24px 0',
    borderBottom: '1px solid #ececec',
  },
  previewQuestionText: {
    margin: '0 0 18px 0',
    fontSize: '1.4rem',
    color: '#222',
  },
  previewOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  previewOptionLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '1.05rem',
    color: '#333',
  },
  previewTextInput: {
    width: '100%',
    maxWidth: '420px',
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1px solid #d6dce2',
    fontSize: '1rem',
    background: '#fafafa',
  },
  submitPreviewButton: {
    marginTop: '26px',
    backgroundColor: '#0f8c95',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 26px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
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
  headerTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
  },
  previewButton: {
    backgroundColor: '#ffffff',
    color: '#1f3b57',
    border: '1px solid #cfdbe6',
    borderRadius: '10px',
    padding: '10px 18px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
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