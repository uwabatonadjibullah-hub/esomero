import React from 'react';
import useAuth from '../hooks/useAuth';

const roleQuotes = {
  admin: [
    "Admins don’t just manage — they inspire.",
    "Secure onboarding builds confident futures.",
    "Every module you publish is a spark of transformation.",
  ],
  trainee: [
    "Every module completed is a step toward mastery.",
    "Your effort today shapes your tomorrow.",
    "Learning is your superpower — use it boldly.",
  ],
};

const QuoteOfTheDay = () => {
  const { user } = useAuth();
  const role = user?.role || 'trainee'; // default to trainee if undefined

  const quotes = roleQuotes[role] || roleQuotes.trainee;
  const index = new Date().getDate() % quotes.length;
  const quote = quotes[index];

  return (
    <div className="quote-of-the-day fade-in">
      <em>{quote}</em>
    </div>
  );
};

export default QuoteOfTheDay;