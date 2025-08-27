// src/pages/AddHandout.jsx

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useR2 } from '../hooks/useR2';
import { formatFileName } from '../utils/formatFileName';

const AddHandout = () => {
  const { id: moduleId } = useParams();
  const { uploadHandout } = useR2(moduleId);

  const [handoutName, setHandoutName] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !handoutName) return alert('Please provide a name and PDF file.');

    setLoading(true);
    try {
      const key = `modules/${moduleId}/${formatFileName(handoutName)}.pdf`;
      const fileUrl = await uploadHandout(file, key);

      alert('🚀 Handout uploaded successfully!');
      console.log('Uploaded to:', fileUrl);

      setHandoutName('');
      setFile(null);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('❌ Failed to upload handout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">📄 Add Handout</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="text"
          placeholder="Handout Name"
          value={handoutName}
          onChange={(e) => setHandoutName(e.target.value)}
          required
          className="w-full p-3 border rounded-lg"
        />
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          required
          className="w-full p-3 border rounded-lg"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold transition ${
            loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {loading ? 'Uploading...' : 'Upload Handout'}
        </button>
      </form>
    </div>
  );
};

export default AddHandout;