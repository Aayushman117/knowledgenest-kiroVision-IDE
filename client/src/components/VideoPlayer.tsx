import { useRef, useEffect, useState } from 'react';
import { updateProgress } from '../api/progress';

interface VideoPlayerProps {
  videoUrl: string;
  lessonId: string;
  initialProgress?: number;
  onProgressUpdate?: (watchTime: number) => void;
  onComplete?: () => void;
}

// Extract YouTube video ID from URL
function getYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Check if URL is a YouTube video
function isYouTubeUrl(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

export default function VideoPlayer({
  videoUrl,
  lessonId,
  initialProgress = 0,
  onProgressUpdate,
  onComplete,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const progressUpdateInterval = useRef<number | null>(null);

  const isYouTube = isYouTubeUrl(videoUrl);
  const youtubeVideoId = isYouTube ? getYouTubeVideoId(videoUrl) : null;

  // Set initial progress for regular videos
  useEffect(() => {
    if (videoRef.current && initialProgress > 0 && !isYouTube) {
      videoRef.current.currentTime = initialProgress;
    }
  }, [initialProgress, isYouTube]);

  // Update progress periodically
  useEffect(() => {
    if (isPlaying) {
      progressUpdateInterval.current = window.setInterval(() => {
        if (videoRef.current && !isYouTube) {
          const watchTime = Math.floor(videoRef.current.currentTime);
          
          // Update progress every 10 seconds
          updateProgress(lessonId, { watchTime }).catch(console.error);
          
          if (onProgressUpdate) {
            onProgressUpdate(watchTime);
          }
        }
      }, 10000); // Update every 10 seconds
    } else {
      if (progressUpdateInterval.current) {
        clearInterval(progressUpdateInterval.current);
      }
    }

    return () => {
      if (progressUpdateInterval.current) {
        clearInterval(progressUpdateInterval.current);
      }
    };
  }, [isPlaying, lessonId, onProgressUpdate, isYouTube]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
    // Save progress immediately on pause
    if (videoRef.current && !isYouTube) {
      const watchTime = Math.floor(videoRef.current.currentTime);
      updateProgress(lessonId, { watchTime }).catch(console.error);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    // Mark as completed
    updateProgress(lessonId, { completed: true, watchTime: Math.floor(duration) })
      .then(() => {
        if (onComplete) {
          onComplete();
        }
      })
      .catch(console.error);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Render YouTube embed
  if (isYouTube && youtubeVideoId) {
    return (
      <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
        <div className="aspect-video">
          <iframe
            ref={iframeRef}
            src={`https://www.youtube.com/embed/${youtubeVideoId}?rel=0&modestbranding=1`}
            title="YouTube video player"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className="bg-gray-900 px-4 py-3 border-t border-gray-700">
          <div className="flex items-center text-sm text-gray-400">
            <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span>YouTube Video</span>
          </div>
        </div>
      </div>
    );
  }

  // Render regular video player
  return (
    <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full aspect-video"
        controls
        onPlay={handlePlay}
        onPause={handlePause}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      >
        Your browser does not support the video tag.
      </video>

      {/* Progress Bar Overlay */}
      {!isYouTube && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 pointer-events-none">
          <div className="flex items-center justify-between text-white text-sm mb-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1">
            <div
              className="bg-blue-500 h-1 rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
