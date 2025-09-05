
import type { VideoItem } from '../types';

const API_URL = 'https://www.googleapis.com/youtube/v3/search';
const VIDEOS_API_URL = 'https://www.googleapis.com/youtube/v3/videos';

export const fetchVideos = async (query: string, apiKey: string): Promise<VideoItem[]> => {
  try {
    // Enhanced search parameters for better English content from USA/Europe
    const searchParams = new URLSearchParams({
      part: 'snippet',
      q: `${query} songs`,
      key: apiKey,
      type: 'video',
      maxResults: '50',
      videoEmbeddable: 'true',
      regionCode: 'US', // Focus on US content
      relevanceLanguage: 'en', // English language preference
      order: 'viewCount', // Most relevant results first
      videoDuration: 'long', // Prefer shorter videos for better engagement
      videoDefinition: 'high', // Prefer HD videos
      safeSearch: 'moderate' // Moderate content filtering
    });

    const response = await fetch(`${API_URL}?${searchParams}`);

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.error?.message || 'Failed to fetch videos. Please check your API key and try again.';
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return [];
    }

    const videoIds = data.items.map((item: any) => item.id.videoId).join(',');

    const videoDetailsResponse = await fetch(`${VIDEOS_API_URL}?part=snippet,statistics&id=${videoIds}&key=${apiKey}`);

    if (!videoDetailsResponse.ok) {
      const errorData = await videoDetailsResponse.json();
      const errorMessage = errorData.error?.message || 'Failed to fetch video details.';
      throw new Error(errorMessage);
    }
    
    const videoDetailsData = await videoDetailsResponse.json();

    const filteredItems = videoDetailsData.items.filter((item: any) => {
      const viewCount = parseInt(item.statistics.viewCount, 10);
      return viewCount > 5000000;
    });

    return filteredItems.map((item: any) => ({
        id: { videoId: item.id },
        snippet: item.snippet
    }));
    
  } catch (error) {
    console.error('YouTube API Error:', error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error('An unexpected error occurred while fetching videos.');
  }
};
