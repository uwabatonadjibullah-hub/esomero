import React from 'react';

const ModuleStats = () => {
  const modules = [
    { name: 'Intro to AE', avgScore: 78 },
    { name: 'Motion Basics', avgScore: 85 },
    { name: 'Cinematic Design', avgScore: 72 },
  ];

  return (
    <div className="module-stats">
      <h2>📚 Module Averages</h2>
      <ul>
        {modules.map((mod, i) => (
          <li key={i}>
            <strong>{mod.name}</strong>: {mod.avgScore}%
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ModuleStats;