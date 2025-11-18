import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById } from '../api/courses';
import { createCheckoutSession } from '../api/payments';
import { enrollmentsApi } from '../api/enrollments';
import { useAuth } from '../context/AuthContext';
import ReviewSection from './ReviewSection';

// Extract YouTube video ID from URL
function extractYouTubeId(url: string): string | null {
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

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: course, isLoading, error } = useQuery({
    queryKey: ['course', id],
    queryFn: () => getCourseById(id!),
    enabled: !!id,
  });

  const formatPrice = (cents: number) => {
    return `₹${(cents / 100).toFixed(2)}`;
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'text-yellow-400' : 'text-gray-300'} style={{ fontSize: '24px' }}>
          ★
        </span>
      );
    }
    return stars;
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      alert('Please login or create an account to enroll in this course');
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }

    if (!id || !course) return;

    setIsProcessing(true);

    try {
      // If course is free, enroll directly
      if (course.price === 0) {
        await enrollmentsApi.enrollFree(id);
        // Redirect to success page with course info
        navigate(`/enrollment/success?courseId=${id}&courseTitle=${encodeURIComponent(course.title)}`);
      } else {
        // Redirect to checkout page for paid courses
        navigate(`/checkout/${id}`);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to enroll in course');
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Course not found or failed to load.
        </div>
        <button
          onClick={() => navigate('/courses')}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          ← Back to courses
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/courses')}
        className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
      >
        ← Back to courses
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Thumbnail */}
          <div className="mb-6">
            {course.thumbnail ? (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-64 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-6xl font-bold">
                  {course.title.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Title and Instructor */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{course.title}</h1>
          
          {/* Instructor Badge */}
          <div className="mb-4 flex items-center bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg mr-3">
              {course.instructor.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm text-gray-600">Instructor</p>
              <p className="text-lg font-bold text-gray-900">{course.instructor.name}</p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center mb-6">
            <div className="flex">{renderStars(Math.round(course.averageRating))}</div>
            <span className="ml-2 text-lg text-gray-600">
              {course.averageRating.toFixed(1)} ({course.totalReviews} reviews)
            </span>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-3">About this course</h2>
            <p className="text-gray-700 whitespace-pre-line">{course.description}</p>
          </div>

          {/* Free Preview Video */}
          {course.lessons.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Free Preview</h2>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  🎁 Watch Free
                </span>
              </div>
              <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
                <div className="aspect-video">
                  {course.lessons[0].videoUrl.includes('youtube.com') || course.lessons[0].videoUrl.includes('youtu.be') ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${extractYouTubeId(course.lessons[0].videoUrl)}?rel=0&modestbranding=1`}
                      title={course.lessons[0].title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <video
                      src={course.lessons[0].videoUrl}
                      className="w-full h-full"
                      controls
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
                <div className="bg-gray-900 px-4 py-3 border-t border-gray-700">
                  <h3 className="text-white font-semibold">{course.lessons[0].title}</h3>
                  <p className="text-gray-400 text-sm mt-1">Lesson 1 • {formatDuration(course.lessons[0].duration)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Lessons */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Course Content</h2>
            <div className="bg-white rounded-lg shadow">
              {course.lessons.length > 0 ? (
                course.lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="p-4 border-b last:border-b-0 hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500 font-medium">{index + 1}.</span>
                        <div>
                          <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                          {index === 0 && (
                            <span className="inline-block mt-1 bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-semibold">
                              FREE PREVIEW
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">
                          {formatDuration(lesson.duration)}
                        </span>
                        {index === 0 && (
                          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No lessons available yet
                </div>
              )}
            </div>
          </div>

          {/* Reviews */}
          <ReviewSection courseId={course.id} isEnrolled={course.isEnrolled || false} />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-lg sticky top-4">
            {course.price === 0 ? (
              <div className="mb-4">
                <div className="text-4xl font-bold text-green-600 mb-2">FREE</div>
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  🎁 Limited Time Offer
                </span>
              </div>
            ) : (
              <div className="text-4xl font-bold text-blue-600 mb-4">
                {formatPrice(course.price)}
              </div>
            )}

            {course.isEnrolled ? (
              <div>
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg mb-4 text-center font-semibold">
                  ✓ You're enrolled
                </div>
                <button
                  onClick={() => navigate(`/learn/${course.id}`)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Continue Learning
                </button>
              </div>
            ) : (
              <div>
                <button
                  onClick={handleEnroll}
                  disabled={isProcessing}
                  className={`w-full text-white py-3 rounded-lg transition font-semibold mb-3 disabled:opacity-50 disabled:cursor-not-allowed ${
                    course.price === 0
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isProcessing ? 'Processing...' : course.price === 0 ? 'Enroll Free' : isAuthenticated ? 'Enroll Now' : 'Login to Enroll'}
                </button>
                {!isAuthenticated && (
                  <p className="text-xs text-center text-gray-600">
                    🔒 You need to login or create an account to enroll
                  </p>
                )}
              </div>
            )}

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Students enrolled</span>
                <span className="font-semibold">{course._count.enrollments}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Lessons</span>
                <span className="font-semibold">{course.lessons.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total duration</span>
                <span className="font-semibold">
                  {formatDuration(
                    course.lessons.reduce((sum, l) => sum + (l.duration || 0), 0)
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
