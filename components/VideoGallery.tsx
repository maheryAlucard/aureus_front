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
      <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 mb-4">
        {isPlaying && currentVideo.type ? (
          <iframe
            src={getEmbedUrl(currentVideo)}
            className="w-full h-full"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        ) : (
          <div className="relative w-full h-full bg-black">
            {currentVideo.thumbnail && (
              <img
                src={currentVideo.thumbnail}
                alt={currentVideo.title || 'Video thumbnail'}
                className="w-full h-full object-cover opacity-50"
              />
            )}
            <button
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/60 transition-colors"
            >
              <div className="flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full w-20 h-20 backdrop-blur-md transition-colors">
                <Play className="w-10 h-10 text-white ml-1" />
              </div>
            </button>
          </div>
        )}
        
        {videos.length > 1 && (
          <>
            <button
              onClick={prevVideo}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextVideo}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {videos.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
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
                <div className="w-full h-full bg-white/5 flex items-center justify-center">
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

