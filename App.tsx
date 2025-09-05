
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
import { MOOD_TO_QUERY_MAP } from './constants';

const App: React.FC = () => {
  const { apiKey, setApiKey, isKeyLoading } = useApiKey();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isMoodModalOpen, setIsMoodModalOpen] = useState<boolean>(false);
  const [detectedMood, setDetectedMood] = useState<Mood | null>(null);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);

  const loadVideos = useCallback(async (currentApiKey: string | null, mood: Mood | null, isRandom: boolean = false, customQuery?: string) => {
    if (!currentApiKey) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      let query: string;
      
      if (customQuery) {
        // Use custom search query
        query = customQuery;
      } else if (isRandom) {
        // Load random videos when API key is first entered - focused on English content
        const randomQueries = [
          "trending music videos 2024",
          "funny comedy sketches",
          "movie scenes compilation",
          "viral dance videos",
          "stand up comedy",
          "music video hits",
          "funny moments compilation",
          "movie trailers 2024",
          "comedy shows",
          "music performances",
          "funny pranks",
          "movie clips"
        ];
        query = randomQueries[Math.floor(Math.random() * randomQueries.length)];
      } else if (mood) {
        // Load mood-specific videos
        const queries = MOOD_TO_QUERY_MAP[mood];
        query = queries[Math.floor(Math.random() * queries.length)];
      } else {
        return;
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
  }, []);

  useEffect(() => {
    if (!isKeyLoading && apiKey && detectedMood) {
      loadVideos(apiKey, detectedMood);
    }
  }, [apiKey, detectedMood, isKeyLoading, loadVideos]);

  // Load random videos when API key is first entered
  useEffect(() => {
    if (!isKeyLoading && apiKey && !detectedMood && !searchQuery) {
      loadVideos(apiKey, null, true);
    }
  }, [apiKey, isKeyLoading, loadVideos, detectedMood, searchQuery]);

  // Load videos when search query changes
  useEffect(() => {
    if (!isKeyLoading && apiKey && searchQuery) {
      loadVideos(apiKey, null, false, searchQuery);
    }
  }, [searchQuery, apiKey, isKeyLoading, loadVideos]);
  
  const handleApiKeySubmit = (newKey: string) => {
    setApiKey(newKey);
  };
  
  const handleMoodDetected = (mood: Mood) => {
    setDetectedMood(mood);
    setSearchQuery(null); // Clear search when mood is detected
    setIsMoodModalOpen(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setDetectedMood(null); // Clear mood when searching
  };

  const MainContent = () => {
    if (isKeyLoading) {
      return null;
    }
    
    if (!apiKey) {
      return <ApiKeyModal onSubmit={handleApiKeySubmit} />;
    }

    return (
      <main className="flex-1 bg-gray-900 overflow-y-auto">
        <VideoGrid videos={videos} isLoading={isLoading} error={error} currentMood={detectedMood} searchQuery={searchQuery} />
      </main>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <Header onSearch={handleSearch} />
      <div className="flex flex-1 overflow-hidden">
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
