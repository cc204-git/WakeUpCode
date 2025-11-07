
import React, { useState, useRef } from 'react';
import { fileToBase64 } from '../utils/imageUtils';
import { CameraIcon } from './icons/CameraIcon';

interface LockSetupProps {
  onLockSet: (imageBase64: string) => void;
}

const LockSetup: React.FC<LockSetupProps> = ({ onLockSet }) => {
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file.');
        return;
      }
      setError('');
      try {
        const base64String = await fileToBase64(file);
        onLockSet(base64String);
      } catch (err) {
        setError('Could not process the image. Please try again.');
        console.error(err);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-brand-secondary p-8 rounded-2xl shadow-2xl text-center animate-fade-in">
        <div className="inline-block bg-brand-accent p-4 rounded-full mb-4">
            <CameraIcon className="w-8 h-8 text-brand-highlight" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Lock Your Code</h2>
        <p className="text-brand-light mb-6">
            Take a clear picture of the 3-digit lock you want to unlock.
            The code should be visible. This image will be hidden until you achieve your goal.
        </p>
        
        <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
        />
        
        <button
            onClick={handleButtonClick}
            className="w-full bg-brand-success text-brand-primary font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
        >
            <CameraIcon className="w-6 h-6" />
            Take Picture
        </button>

        {error && <p className="text-brand-danger text-sm mt-4">{error}</p>}
    </div>
  );
};

export default LockSetup;
