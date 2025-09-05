
export interface VideoItem {
  id: {
    videoId: string;
  };
  snippet: {
    publishedAt: string;
    title: string;
    description: string;
    thumbnails: {
      high: {
        url: string;
      };
    };
    channelTitle: string;
  };
}

export enum Mood {
    Happy = 'happy',
    Sad = 'sad',
    Angry = 'angry',
    Surprised = 'surprised',
    Neutral = 'neutral',
    Calm = 'calm',
}

export type FaceExpression = 'neutral' | 'happy' | 'sad' | 'angry' | 'fearful' | 'disgusted' | 'surprised';
