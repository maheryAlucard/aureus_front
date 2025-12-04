import React, { useState } from 'react';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoGalleryProps {
  videos: Array<{
    id: string;
    title?: string;
    src: string;
    thumbnail?: string;
    type?: 'youtube' | 'vimeo' | 'direct';
  }>;
  className?: string;
}

export const VideoGallery: React.FC<VideoGalleryProps> = ({ videos, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentVideo = videos[currentIndex];

  const nextVideo = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
    setIsPlaying(false);
  };

  const prevVideo = () => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
    setIsPlaying(false);
  };

  const getEmbedUrl = (video: typeof currentVideo) => {
    if (video.type === 'youtube') {
      const videoId = video.src.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    if (video.type === 'vimeo') {
      const videoId = video.src.split('/').pop();
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    }
    return video.src;
  };

  return (
    <div className={className}>
      <div className="relative mb-4 border border-white/10 rounded-xl aspect-video overflow-hidden">
        {isPlaying && currentVideo.type ? (
          <iframe
            src={getEmbedUrl(currentVideo)}
            className="w-full h-full"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        ) : (
          <div className="relative bg-black w-full h-full">
            {currentVideo.thumbnail && (
              <img
                src={currentVideo.thumbnail}
                alt={currentVideo.title || 'Video thumbnail'}
                className="opacity-50 w-full h-full object-cover"
              />
            )}
            <button
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 flex justify-center items-center bg-black/40 hover:bg-black/60 transition-colors"
            >
              <div className="flex justify-center items-center bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full w-20 h-20 transition-colors">
                <Play className="ml-1 w-10 h-10 text-white" />
              </div>
            </button>
          </div>
        )}
        
        {videos.length > 1 && (
          <>
            <button
              onClick={prevVideo}
              className="top-1/2 left-4 absolute bg-black/60 hover:bg-black/80 p-2 rounded-full text-white transition-colors -translate-y-1/2"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextVideo}
              className="top-1/2 right-4 absolute bg-black/60 hover:bg-black/80 p-2 rounded-full text-white transition-colors -translate-y-1/2"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {videos.length > 1 && (
        <div className="flex space-x-2 pb-2 overflow-x-auto">
          {videos.map((video, index) => (
            <button
              key={video.id}
              onClick={() => {
                setCurrentIndex(index);
                setIsPlaying(false);
              }}
              className={`flex-shrink-0 relative w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex ? 'border-blue-500' : 'border-white/10'
              }`}
            >
              {video.thumbnail ? (
                <img
                  src={video.thumbnail}
                  alt={video.title || `Video ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex justify-center items-center bg-white/5 w-full h-full">
                  <Play className="w-4 h-4 text-gray-400" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

