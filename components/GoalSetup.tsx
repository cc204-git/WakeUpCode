
import React, { useState } from 'react';
import { LockIcon } from './icons/LockIcon';

interface GoalSetupProps {
  onGoalSet: (goal: string, deadline: Date) => void;
}

const GoalSetup: React.FC<GoalSetupProps> = ({ onGoalSet }) => {
  const [goal, setGoal] = useState('');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim() || !deadline) {
      setError('Please fill out both your goal and the deadline.');
      return;
    }
    const deadlineDate = new Date(deadline);
    if (deadlineDate <= new Date()) {
        setError('The deadline must be in the future.');
        return;
    }
    setError('');
    onGoalSet(goal, deadlineDate);
  };
  
  // Set default deadline to tomorrow to ensure it's in the future
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDeadline = tomorrow.toISOString().slice(0, 16);

  return (
    <div className="bg-brand-secondary p-8 rounded-2xl shadow-2xl animate-fade-in">
        <div className="text-center mb-6">
            <div className="inline-block bg-brand-accent p-4 rounded-full mb-4">
                <LockIcon className="w-8 h-8 text-brand-highlight" />
            </div>
            <h1 className="text-3xl font-bold text-brand-highlight">Goal-Locked Code Keeper</h1>
            <p className="text-brand-light mt-2">Commit to a goal to unlock your secret code.</p>
        </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="goal" className="block text-sm font-medium text-brand-light mb-1">What is your goal?</label>
          <input
            id="goal"
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g., Exercise 3 times this week"
            className="w-full bg-brand-primary border border-brand-accent text-brand-highlight rounded-lg p-3 focus:ring-2 focus:ring-brand-light focus:outline-none transition"
          />
        </div>
        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-brand-light mb-1">Set a Deadline</label>
          <input
            id="deadline"
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            min={defaultDeadline}
            className="w-full bg-brand-primary border border-brand-accent text-brand-highlight rounded-lg p-3 focus:ring-2 focus:ring-brand-light focus:outline-none transition appearance-none"
          />
        </div>
        {error && <p className="text-brand-danger text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-brand-success text-brand-primary font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 shadow-lg"
        >
          Set Goal & Continue
        </button>
      </form>
    </div>
  );
};

export default GoalSetup;
