import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createCourse, updateCourse, getCourseById } from '../api/courses';
import ThumbnailUpload from '../components/ThumbnailUpload';

export default function CourseFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [published, setPublished] = useState(false);
  const [error, setError] = useState('');

  // Fetch course data if editing
  const { data: course } = useQuery({
    queryKey: ['course', id],
    queryFn: () => getCourseById(id!),
    enabled: isEditMode,
  });

  // Populate form when course data loads
  useEffect(() => {
    if (course) {
      setTitle(course.title);
      setDescription(course.description);
      setPrice((course.price / 100).toString());
      setThumbnail(course.thumbnail || '');
      setPublished(course.published);
    }
  }, [course]);

  const createMutation = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructorDashboard'] });
      navigate('/instructor/dashboard');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to create course');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateCourse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructorDashboard'] });
      queryClient.invalidateQueries({ queryKey: ['course', id] });
      navigate('/instructor/dashboard');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to update course');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!description.trim()) {
      setError('Description is required');
      return;
    }
    if (!price || parseFloat(price) < 0) {
      setError('Valid price is required');
      return;
    }

    const priceInCents = Math.round(parseFloat(price) * 100);

    const courseData = {
      title: title.trim(),
      description: description.trim(),
      price: priceInCents,
      thumbnail: thumbnail || undefined,
      published,
    };

    if (isEditMode && id) {
      updateMutation.mutate({ id, data: courseData });
    } else {
      createMutation.mutate(courseData);
    }
  };

  const handleThumbnailUpload = (url: string) => {
    setThumbnail(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/instructor/dashboard')}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditMode ? 'Edit Course' : 'Create New Course'}
        </h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        {/* Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Complete Web Development Bootcamp"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe what students will learn in this course..."
            required
          />
        </div>

        {/* Price */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price (USD) *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="49.99"
              required
            />
          </div>
        </div>

        {/* Thumbnail */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Thumbnail
          </label>
          <ThumbnailUpload
            currentThumbnail={thumbnail}
            onUploadComplete={handleThumbnailUpload}
          />
        </div>

        {/* Published Status */}
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              Publish course (make it visible to students)
            </span>
          </label>
          <p className="mt-1 text-xs text-gray-500">
            Unpublished courses are only visible to you
          </p>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-semibold"
          >
            {createMutation.isPending || updateMutation.isPending
              ? 'Saving...'
              : isEditMode
              ? 'Update Course'
              : 'Create Course'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/instructor/dashboard')}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Additional Info for Edit Mode */}
      {isEditMode && course && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Next Steps</h3>
          <p className="text-sm text-blue-700 mb-2">
            After saving your course details, you can:
          </p>
          <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
            <li>Add lessons to your course</li>
            <li>Upload video content for each lesson</li>
            <li>Publish your course to make it available to students</li>
          </ul>
        </div>
      )}
    </div>
  );
}
