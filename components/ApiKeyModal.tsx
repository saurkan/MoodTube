
import React, { useState } from 'react';

interface ApiKeyModalProps {
  onSubmit: (apiKey: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSubmit }) => {
  const [key, setKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      onSubmit(key.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-zinc-800 p-8 rounded-lg shadow-xl max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4 text-white">Enter YouTube API Key</h2>
        <p className="text-zinc-400 mb-6">
          To display videos, this app requires a YouTube Data API v3 key. 
          You can get one from the Google Cloud Console.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Enter your API key here"
            className="w-full bg-zinc-700 border border-zinc-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
          />
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md mt-6 transition-colors duration-200 disabled:bg-red-800 disabled:cursor-not-allowed"
            disabled={!key.trim()}
          >
            Save and Start Watching
          </button>
        </form>
      </div>
    </div>
  );
};
