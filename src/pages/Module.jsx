// src/pages/admin/Module.jsx

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getModuleById } from '../services/moduleServices';

const Module = () => {
  const { id } = useParams();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const data = await getModuleById(id);
        setModule(data);
      } catch (err) {
        console.error('Error loading module:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg shadow-inner">
        <p className="text-gray-500 text-lg animate-pulse">Loading module...</p>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="text-center mt-20 text-red-600 font-semibold">
        Module not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{module.title}</h2>
      <img src={module.imageUrl} alt={module.title} className="w-full h-64 object-cover rounded-lg mb-6" />
      <p className="text-gray-600 mb-6">{module.description}</p>

      <div className="grid grid-cols-2 gap-4">
        <Link
          to={`/admin/module/${id}/add-handout`}
          className="bg-green-500 text-white py-3 rounded-lg text-center font-semibold hover:bg-green-600"
        >
          📄 Add Handouts
        </Link>
        <Link
          to={`/admin/module/${id}/create-quiz`}
          className="bg-blue-500 text-white py-3 rounded-lg text-center font-semibold hover:bg-blue-600"
        >
          📝 Create Quiz
        </Link>
      </div>
    </div>
  );
};

export default Module;