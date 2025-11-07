import React, { useState, useRef } from 'react';
import { useCountdown } from '../hooks/useCountdown';
import { verifyGoalWithGemini } from '../services/geminiService';
import { fileToBase64 } from '../utils/imageUtils';
import { CameraIcon } from './icons/CameraIcon';
import { TrophyIcon } from './icons/TrophyIcon';
import { Goal } from '../types';

// Fix: Removed apiKey and onInvalidApiKey from props, as API key is now handled by environment variables.
interface GoalTrackerProps {
  goal: Goal;
  onGoalSuccess: () => void;
}

const CountdownSegment: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center">
        <span className="text-4xl md:text-5xl font-bold text-brand-highlight">{String(value).padStart(2, '0')}</span>
        <span className="text-xs text-brand-light uppercase tracking-wider">{label}</span>
    </div>
);


// Fix: Removed apiKey and onInvalidApiKey from props.
const GoalTracker: React.FC<GoalTrackerProps> = ({ goal, onGoalSuccess }) => {
    // Convert Firestore Timestamp to JS Date for the countdown hook
    const deadline = goal.deadline.toDate();
    const { days, hours, minutes, seconds, isOver } = useCountdown(deadline);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fix: Updated to call verifyGoalWithGemini without the apiKey argument.
    const handleVerificationSubmit = async (imageBase64: string) => {
        setIsLoading(true);
        setError('');
        const success = await verifyGoalWithGemini(goal.goal, imageBase64);
        setIsLoading(false);

        if (success) {
            onGoalSuccess();
        } else {
            // Fix: Updated error message as invalid API key is no longer a user-facing issue.
            setError('Verification failed. The AI could not confirm your goal completion. Please try again with a clearer image.');
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            try {
                const base64 = await fileToBase64(files[0]);
                handleVerificationSubmit(base64);
            } catch (err) {
                setError('Could not read the image. Please try again.');
                setIsLoading(false);
            }
        }
    };

    const handleVerifyClick = () => {
        setError('');
        // This slight delay allows the UI to update before triggering the file input
        setTimeout(() => fileInputRef.current?.click(), 100);
    };

    return (
        <div className="bg-brand-secondary p-8 rounded-2xl shadow-2xl text-center animate-fade-in w-full">
            <h2 className="text-lg font-semibold text-brand-light mb-2">YOUR GOAL</h2>
            <p className="text-2xl font-bold text-brand-highlight mb-6 break-words">"{goal.goal}"</p>

            <div className="bg-brand-primary rounded-lg p-4 mb-6">
                <h3 className="text-sm font-semibold text-brand-light mb-3 uppercase tracking-wider">Time Remaining</h3>
                {isOver ? (
                    <div className="text-brand-danger text-2xl font-bold">Time's Up!</div>
                ) : (
                    <div className="flex justify-around">
                        <CountdownSegment value={days} label="Days" />
                        <CountdownSegment value={hours} label="Hours" />
                        <CountdownSegment value={minutes} label="Mins" />
                        <CountdownSegment value={seconds} label="Secs" />
                    </div>
                )}
            </div>
            
            <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
            />

            {isLoading ? (
                <div className="flex flex-col items-center justify-center p-4">
                     <div className="w-8 h-8 border-4 border-brand-accent border-t-brand-highlight rounded-full animate-spin mb-3"></div>
                     <p className="text-brand-light">Verifying with AI...</p>
                </div>
            ) : (
                <button
                    onClick={handleVerifyClick}
                    disabled={isOver}
                    className="w-full bg-brand-success text-brand-primary font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 disabled:bg-brand-accent disabled:cursor-not-allowed disabled:transform-none"
                >
                    <TrophyIcon className="w-6 h-6" />
                    Prove Goal Completion
                </button>
            )}

            {/* Fix: Removed invalid API key error handling and button to change key. */}
            {error && (
                <div className="text-brand-danger text-sm mt-4">
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
};

export default GoalTracker;