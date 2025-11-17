import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCourseById } from '../api/courses';
import { getCourseProgress } from '../api/progress';
import { checkEnrollment } from '../api/payments';
import VideoPlayer from '../components/VideoPlayer';
import ProgressTracker from '../components/ProgressTracker';
import { useAuth } from '../context/AuthContext';

export default function LearnPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);

  // Check authentication
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  // Fetch course data
  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => getCourseById(courseId!),
    enabled: !!courseId,
  });

  // Check enrollment
  const { data: isEnrolled, isLoading: enrollmentLoading } = useQuery({
    queryKey: ['enrollment', courseId],
    queryFn: () => checkEnrollment(courseId!),
    enabled: !!courseId,
  });

  // Fetch progress
  const { data: progress = [], refetch: refetchProgress } = useQuery({
    queryKey: ['progress', courseId],
    queryFn: () => getCourseProgress(courseId!),
    enabled: !!courseId && isEnrolled,
  });

  if (courseLoading || enrollmentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h1>
          <button
            onClick={() => navigate('/courses')}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to courses
          </button>
        </div>
      </div>
    );
  }

  if (!isEnrolled) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You need to enroll in this course to access the lessons.
          </p>
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            View Course Details
          </button>
        </div>
      </div>
    );
  }

  const selectedLesson = course.lessons[selectedLessonIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="text-blue-600 hover:text-blue-800 flex items-center mb-2"
          >
            ← Back to course
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {selectedLesson ? (
              <>
                <VideoPlayer
                  videoUrl={selectedLesson.videoUrl}
                  lessonId={selectedLesson.id}
                  initialProgress={
                    progress.find(p => p.lessonId === selectedLesson.id)?.watchTime || 0
                  }
                  onProgressUpdate={() => refetchProgress()}
                  onComplete={() => refetchProgress()}
                />

                {/* Lesson Info */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {selectedLesson.title}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Lesson {selectedLessonIndex + 1} of {course.lessons.length}
                  </p>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between">
                  <button
                    onClick={() => setSelectedLessonIndex(Math.max(0, selectedLessonIndex - 1))}
                    disabled={selectedLessonIndex === 0}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    ← Previous Lesson
                  </button>
                  <button
                    onClick={() =>
                      setSelectedLessonIndex(
                        Math.min(course.lessons.length - 1, selectedLessonIndex + 1)
                      )
                    }
                    disabled={selectedLessonIndex === course.lessons.length - 1}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Next Lesson →
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-500">No lessons available</p>
              </div>
            )}
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-1 space-y-6">
            {/* Progress Tracker */}
            <ProgressTracker lessons={course.lessons} progress={progress} />

            {/* Lesson List */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Course Content</h3>
              <div className="space-y-2">
                {course.lessons.map((lesson, index) => {
                  const lessonProgress = progress.find(p => p.lessonId === lesson.id);
                  const isCompleted = lessonProgress?.completed || false;
                  const isActive = index === selectedLessonIndex;

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setSelectedLessonIndex(index)}
                      className={`
                        w-full text-left p-3 rounded-lg transition
                        ${isActive ? 'bg-blue-50 border-2 border-blue-500' : 'bg-gray-50 hover:bg-gray-100'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`
                          flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0
                          ${isCompleted ? 'bg-green-500' : isActive ? 'bg-blue-500' : 'bg-gray-300'}
                        `}>
                          {isCompleted ? (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className="text-xs text-white font-semibold">{index + 1}</span>
                          )}
                        </div>
                        <span className={`text-sm font-medium ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
                          {lesson.title}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
