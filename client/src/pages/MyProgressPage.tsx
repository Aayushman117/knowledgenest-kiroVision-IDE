import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getMyProgress } from '../api/analytics';
import { Link } from 'react-router-dom';

export default function MyProgressPage() {
  const [progressData, setProgressData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      setLoading(true);
      const response = await getMyProgress();
      setProgressData(response.data);
    } catch (error) {
      console.error('Failed to load progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Loading your progress...</div>
        </div>
      </Layout>
    );
  }

  if (!progressData) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-600">No progress data available</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Learning Progress</h1>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 mb-2">Total Courses</div>
            <div className="text-3xl font-bold text-gray-900">
              {progressData.overview.totalEnrollments}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 mb-2">Completed</div>
            <div className="text-3xl font-bold text-green-600">
              {progressData.overview.totalCompleted}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 mb-2">In Progress</div>
            <div className="text-3xl font-bold text-blue-600">
              {progressData.overview.totalInProgress}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500 mb-2">Avg Completion</div>
            <div className="text-3xl font-bold text-gray-900">
              {progressData.overview.avgCompletionRate}%
            </div>
          </div>
        </div>

        {/* Course Progress */}
        <div className="space-y-6">
          {progressData.courses.map((courseData: any) => (
            <div key={courseData.enrollmentId} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {courseData.course.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">{courseData.course.description}</p>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {courseData.progress.completedLessons} of {courseData.progress.totalLessons} lessons completed
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {courseData.progress.completionRate}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            courseData.progress.completionRate === 100
                              ? 'bg-green-600'
                              : 'bg-blue-600'
                          }`}
                          style={{ width: `${courseData.progress.completionRate}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                      <div>
                        <span className="font-medium">Enrolled:</span>{' '}
                        {new Date(courseData.progress.enrolledAt).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Days Active:</span>{' '}
                        {courseData.progress.daysSinceEnrollment}
                      </div>
                      <div>
                        <span className="font-medium">Last Accessed:</span>{' '}
                        {courseData.progress.lastAccessedAt
                          ? new Date(courseData.progress.lastAccessedAt).toLocaleDateString()
                          : 'Never'}
                      </div>
                    </div>

                    <Link
                      to={`/learn/${courseData.course.id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Continue Learning
                    </Link>
                  </div>
                </div>

                {/* Lessons List */}
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Lessons</h4>
                  <div className="space-y-2">
                    {courseData.lessons.map((lesson: any) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              lesson.completed
                                ? 'bg-green-100 text-green-600'
                                : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            {lesson.completed ? (
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <span className="text-xs">{lesson.order}</span>
                            )}
                          </div>
                          <span
                            className={`text-sm ${
                              lesson.completed ? 'text-gray-900' : 'text-gray-600'
                            }`}
                          >
                            {lesson.title}
                          </span>
                        </div>
                        {lesson.completed && lesson.completedAt && (
                          <span className="text-xs text-gray-500">
                            Completed {new Date(lesson.completedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {progressData.courses.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet</p>
            <Link
              to="/courses"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Browse Courses
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
