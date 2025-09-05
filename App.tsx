
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { VideoGrid } from './components/VideoGrid';
import { ApiKeyModal } from './components/ApiKeyModal';
import { MoodDetectorModal } from './components/MoodDetectorModal';
import { useApiKey } from './hooks/useApiKey';
import { fetchVideos } from './services/youtubeService';
import type { VideoItem } from './types';
import { Mood } from './types';
import { MOOD_TO_QUERY_MAP, INITIAL_VIDEO_QUERIES } from './constants';

const App: React.FC = () => {
  const { apiKey, setApiKey, isKeyLoading } = useApiKey();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isMoodModalOpen, setIsMoodModalOpen] = useState<boolean>(false);
  const [detectedMood, setDetectedMood] = useState<Mood | null>(null);

  const getRandomQuery = () => {
    return INITIAL_VIDEO_QUERIES[Math.floor(Math.random() * INITIAL_VIDEO_QUERIES.length)];
  };

  const loadVideos = useCallback(async (currentApiKey: string | null) => {
    if (!currentApiKey) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      let query: string;
      if (detectedMood) {
        const queries = MOOD_TO_QUERY_MAP[detectedMood];
        query = queries[Math.floor(Math.random() * queries.length)];
      } else {
        query = getRandomQuery();
      }
      
      const videoData = await fetchVideos(query, currentApiKey);
      setVideos(videoData);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while fetching videos.');
      }
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  }, [detectedMood]);

  useEffect(() => {
    if (!isKeyLoading) {
      loadVideos(apiKey);
    }
  }, [apiKey, detectedMood, isKeyLoading, loadVideos]);
  
  const handleApiKeySubmit = (newKey: string) => {
    setApiKey(newKey);
  };
  
  const handleMoodDetected = (mood: Mood) => {
    setDetectedMood(mood);
    setIsMoodModalOpen(false);
  };

  const MainContent = () => {
    if (isKeyLoading) {
      return null;
    }
    
    if (!apiKey) {
      return <ApiKeyModal onSubmit={handleApiKeySubmit} />;
    }

    const title = detectedMood 
      ? `Timeline Curated for Your ${detectedMood.charAt(0).toUpperCase() + detectedMood.slice(1)} Mood`
      : 'Explore Videos';

    return (
      <main className="px-4 py-6 col-span-12 md:col-span-10 lg:col-span-11 bg-zinc-900 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 px-4">{title}</h2>
        <VideoGrid videos={videos} isLoading={isLoading} error={error} />
      </main>
    );
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        <Sidebar onMoodButtonClick={() => setIsMoodModalOpen(true)} />
        <MainContent />
      </div>
      {isMoodModalOpen && (
        <MoodDetectorModal 
          onClose={() => setIsMoodModalOpen(false)} 
          onMoodDetected={handleMoodDetected} 
        />
      )}
    </div>
  );
};

export default App;
