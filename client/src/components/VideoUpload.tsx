import { useState, useRef } from 'react';
import apiClient from '../api/client';

interface VideoUploadProps {
  onUploadComplete: (url: string) => void;
  currentVideo?: string | null;
}

export default function VideoUpload({ onUploadComplete, currentVideo }: VideoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(currentVideo || null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setError('Please select a video file');
      return;
    }

    // Validate file size (500MB)
    if (file.size > 500 * 1024 * 1024) {
      setError('Video size must be less than 500MB');
      return;
    }

    setError('');
    setUploading(true);
    setProgress(0);

    try {
      // Upload to server
      const formData = new FormData();
      formData.append('video', file);

      const response = await apiClient.post('/upload/video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          }
        },
      });

      const url = response.data.data.url;
      setVideoUrl(url);
      onUploadComplete(url);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload video');
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Lesson Video
      </label>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        {videoUrl ? (
          <div>
            <div className="bg-green-50 border border-green-200 rounded p-3 mb-3">
              <p className="text-sm text-green-800">✓ Video uploaded successfully</p>
              <p className="text-xs text-green-600 mt-1 break-all">{videoUrl}</p>
            </div>
            <button
              type="button"
              onClick={handleClick}
              disabled={uploading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Replace Video
            </button>
          </div>
        ) : (
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <div className="mt-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <button
                type="button"
                onClick={handleClick}
                disabled={uploading}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {uploading ? `Uploading... ${progress}%` : 'Choose Video File'}
              </button>

              <p className="text-xs text-gray-500 mt-3">
                MP4, WebM, or OGG up to 500MB
              </p>
            </div>

            {uploading && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">{progress}% uploaded</p>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-600 mt-3">{error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
