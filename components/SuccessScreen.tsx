import React from 'react';
import { TrophyIcon } from './icons/TrophyIcon';
import { Goal } from '../types';

interface SuccessScreenProps {
  goal: Goal;
  onReset: () => void;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ goal, onReset }) => {
  return (
    <div className="bg-brand-secondary p-8 rounded-2xl shadow-2xl text-center animate-fade-in">
      <div className="inline-block bg-brand-success p-4 rounded-full mb-4">
        <TrophyIcon className="w-10 h-10 text-brand-primary" />
      </div>
      <h1 className="text-3xl font-bold text-brand-success mb-2">Congratulations!</h1>
      <p className="text-brand-light mb-6">You've achieved your goal and unlocked your code.</p>
      
      <div className="border-4 border-brand-accent rounded-lg p-2 bg-brand-primary mb-8">
        {goal.lockImage && (
          <img 
            src={goal.lockImage} 
            alt="Unlocked Code" 
            className="w-full h-auto rounded-md object-contain max-h-64"
          />
        )}
      </div>

      <button
        onClick={onReset}
        className="w-full bg-brand-accent text-brand-highlight font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 shadow-lg"
      >
        Start a New Goal
      </button>
    </div>
  );
};

export default SuccessScreen;