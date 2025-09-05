
import React from 'react';
import type { VideoItem } from '../types';

interface VideoCardProps {
  video: VideoItem;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  return (
    <div className="flex flex-col group cursor-pointer">
      <div className="relative">
        <img 
          src={video.snippet.thumbnails.high.url} 
          alt={video.snippet.title} 
          className="w-full aspect-video object-cover rounded-lg group-hover:rounded-none transition-all duration-200"
        />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded">
          {Math.floor(Math.random() * 10) + 1}:{Math.floor(Math.random() * 60).toString().padStart(2, '0')}
        </div>
      </div>
      <div className="flex mt-3 space-x-3">
        {/* Channel avatar */}
        <div className="w-9 h-9 bg-gray-600 rounded-full flex-shrink-0 flex items-center justify-center">
          <span className="text-gray-300 font-semibold text-sm">
            {video.snippet.channelTitle.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium leading-tight text-white line-clamp-2 group-hover:text-blue-400">
            {video.snippet.title}
          </h3>
          <p className="text-xs text-gray-400 mt-1">{video.snippet.channelTitle}</p>
          <div className="flex items-center space-x-1 mt-1">
            <span className="text-xs text-gray-400">{Math.floor(Math.random() * 1000) + 1}K views</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-400">{Math.floor(Math.random() * 30) + 1} hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const VideoCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="w-full bg-gray-700 aspect-video rounded-lg"></div>
      <div className="flex mt-3 space-x-3">
        <div className="w-9 h-9 bg-gray-700 rounded-full flex-shrink-0"></div>
        <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
};
