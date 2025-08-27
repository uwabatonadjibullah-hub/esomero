import React from 'react';
import { jsPDF } from 'jspdf';

const DownloadReportButton = ({ scores, modules }) => {
  const handleDownload = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('📊 Admin Dashboard Report', 20, 20);

    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);

    doc.text('--- Modules ---', 20, 40);
    modules.forEach((mod, index) => {
      doc.text(`${index + 1}. ${mod.name} — ${mod.description || 'No description'}`, 20, 50 + index * 10);
    });

    const scoreStartY = 60 + modules.length * 10;
    doc.text('--- Scores ---', 20, scoreStartY);

    scores.slice(0, 10).forEach((score, index) => {
      doc.text(
        `${index + 1}. ${score.user || 'Anonymous'} — ${score.value || 0}`,
        20,
        scoreStartY + 10 + index * 10
      );
    });

    doc.save('AdminDashboardReport.pdf');
  };

  return (
    <button className="download-report-btn" onClick={handleDownload}>
      📥 Download PDF Report
    </button>
  );
};

export default DownloadReportButton;