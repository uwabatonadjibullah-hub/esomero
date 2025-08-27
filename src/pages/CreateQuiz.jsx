// src/pages/CreateQuiz.jsx

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { createQuiz } from '../services/moduleServices';

const CreateQuiz = () => {
  const { id: moduleId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [type, setType] = useState('multiple-choice');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(false);

  const addQuestion = () => {
    if (!newQuestion || !answer) return;
    setQuestions([...questions, { question: newQuestion, answer, type }]);
    setNewQuestion('');
    setAnswer('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startTime || questions.length === 0) return alert('Set start time and add questions.');
    setLoading(true);
    try {
      await createQuiz(moduleId, { questions, startTime, duration });
      alert('Quiz created!');
    } catch (err) {
      console.error(err);
      alert('Failed to create quiz.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">🧠 Create Quiz</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
          className="w-full p-3 border rounded-lg"
        />
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Duration (minutes)"
          className="w-full p-3 border rounded-lg"
        />

        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-700 mb-2">Add Question</h3>
          <input
            type="text"
            placeholder="Question"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            className="w-full p-3 border rounded-lg mb-2"
          />
          <input
            type="text"
            placeholder="Correct Answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full p-3 border rounded-lg mb-2"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-3 border rounded-lg mb-2"
          >
            <option value="multiple-choice">Multiple Choice</option>
            <option value="true-false">True/False</option>
            <option value="short-answer">Short Answer</option>
          </select>
          <button
            type="button"
            onClick={addQuestion}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            ➕ Add Question
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          {loading ? 'Creating Quiz...' : 'Create Quiz'}
        </button>
      </form>
    </div>
  );
};

export default CreateQuiz;