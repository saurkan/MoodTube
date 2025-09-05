
import type { VideoItem } from '../types';

const API_URL = 'https://www.googleapis.com/youtube/v3/search';

export const fetchVideos = async (query: string, apiKey: string): Promise<VideoItem[]> => {
  try {
    const response = await fetch(
      `${API_URL}?part=snippet&q=${encodeURIComponent(query)}&key=${apiKey}&type=video&maxResults=24&videoEmbeddable=true`
    );

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.error?.message || 'Failed to fetch videos. Please check your API key and try again.';
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('YouTube API Error:', error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error('An unexpected error occurred while fetching videos.');
  }
};
