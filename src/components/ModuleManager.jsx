import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getModules } from '../../services/moduleService';

const ModuleManager = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const data = await getModules();
        setModules(data);
      } catch (err) {
        console.error('Error fetching modules:', err);
        setError('Failed to load modules. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg shadow-inner">
        <p className="text-gray-500 text-lg animate-pulse">Loading modules...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg shadow-inner border border-red-200">
        <p className="text-red-700 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        🎓 Module Manager
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((mod) => (
          <Link
            key={mod.id}
            to={`/admin/module/${mod.id}`}
            className="group block bg-gray-50 rounded-lg p-4 shadow hover:shadow-xl transition duration-300"
          >
            <img
              src={mod.imageUrl}
              alt={mod.title}
              className="w-full h-40 object-cover rounded-md mb-4 group-hover:scale-105 transition-transform"
            />
            <h3 className="text-lg font-semibold text-gray-700 group-hover:text-indigo-600">
              {mod.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{mod.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          to="/admin/add-module"
          className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition"
        >
          ➕ Add New Module
        </Link>
      </div>
    </div>
  );
};

export default ModuleManager;