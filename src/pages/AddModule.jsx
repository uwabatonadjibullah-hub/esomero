// src/pages/AddModule.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addModule } from '../services/moduleServices';
import FileUploader from '../components/FileUploader';
import { useR2 } from '../../hooks/useR2';
import { formatFileName } from '../../utils/formatFileName';

const AddModule = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [moduleId, setModuleId] = useState(null); // capture created module ID
  const [showUploader, setShowUploader] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newModule = await addModule({ title, description, imageUrl });
      setModuleId(newModule.id); // capture ID for handout/quiz
      alert('Module created successfully!');
    } catch (err) {
      console.error('Error adding module:', err);
      alert('Failed to add module. Try again.');
    }
  };

  const { uploadHandout } = useR2(moduleId);

  const handleHandoutUpload = async (file, name) => {
    const key = `modules/${moduleId}/${formatFileName(name)}.pdf`;
    const url = await uploadHandout(file, key);
    alert('Handout uploaded!');
    console.log('Uploaded to:', url);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">➕ Add New Module</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Module Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-3 border rounded-lg"
        />
        <textarea
          placeholder="Module Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full p-3 border rounded-lg"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Create Module
        </button>
      </form>

      {moduleId && (
        <div className="mt-8 space-y-4">
          <button
            onClick={() => setShowUploader(true)}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            📄 Add Handouts
          </button>

          <button
            onClick={() => navigate(`/admin/module/${moduleId}/create-quiz`)}
            className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition"
          >
            🧠 Create Quiz
          </button>
        </div>
      )}

      {showUploader && (
        <div className="mt-6">
          <FileUploader onUpload={handleHandoutUpload} label="Upload Handout" />
        </div>
      )}
    </div>
  );
};

export default AddModule;