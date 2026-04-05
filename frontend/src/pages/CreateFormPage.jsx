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
      <h1>Create Form</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Form title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Form description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {questions.map((question, qIndex) => (
          <div key={qIndex} style={styles.questionCard}>
            <input
              type="text"
              placeholder={`Question ${qIndex + 1}`}
              value={question.questionText}
              onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
              required
            />

            <select
              value={question.questionType}
              onChange={(e) => handleQuestionChange(qIndex, 'questionType', e.target.value)}
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
                  />
                ))}
                <button type="button" onClick={() => addOption(qIndex)}>
                  Add Option
                </button>
              </div>
            )}

            {questions.length > 1 && (
              <button type="button" onClick={() => removeQuestion(qIndex)}>
                Delete Question
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addQuestion}>Add Question</button>
        <button type="submit">Create Form</button>
      </form>
    </div>
  );
}

const styles = {
  page: {
    padding: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxWidth: '900px',
  },
  questionCard: {
    background: '#fff',
    padding: '16px',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  optionsBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
};