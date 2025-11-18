import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getPlatformAnalytics, getAllStudentsProgress } from '../api/analytics';

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'trends'>('overview');

  // Dummy data for charts
  const monthlyData = [
    { month: 'Jan', enrollments: 45, revenue: 12500, users: 120 },
    { month: 'Feb', enrollments: 52, revenue: 15200, users: 145 },
    { month: 'Mar', enrollments: 68, revenue: 18900, users: 178 },
    { month: 'Apr', enrollments: 71, revenue: 21300, users: 203 },
    { month: 'May', enrollments: 85, revenue: 24800, users: 245 },
    { month: 'Jun', enrollments: 92, revenue: 28500, users: 289 },
  ];

  const categoryData = [
    { name: 'Programming', value: 35, color: 'bg-blue-500' },
    { name: 'Design', value: 25, color: 'bg-purple-500' },
    { name: 'Business', value: 20, color: 'bg-green-500' },
    { name: 'Marketing', value: 12, color: 'bg-yellow-500' },
    { name: 'Other', value: 8, color: 'bg-gray-500' },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [analyticsData, studentsData] = await Promise.all([
        getPlatformAnalytics(),
        getAllStudentsProgress(),
      ]);
      setAnalytics(analyticsData.data);
      setStudents(studentsData.data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Loading analytics...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics Dashboard</h1>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Platform Overview
            </button>
            <button
              onClick={() => setActiveTab('trends')}
              className={`${
                activeTab === 'trends'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Trends & Charts
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`${
                activeTab === 'students'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Student Progress
            </button>
          </nav>
        </div>

        {activeTab === 'overview' && analytics && (
          <div>
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-500 mb-2">Total Users</div>
                <div className="text-3xl font-bold text-gray-900">
                  {analytics.overview.totalUsers}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-500 mb-2">Total Courses</div>
                <div className="text-3xl font-bold text-gray-900">
                  {analytics.overview.totalCourses}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-500 mb-2">Total Enrollments</div>
                <div className="text-3xl font-bold text-gray-900">
                  {analytics.overview.totalEnrollments}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-500 mb-2">Total Revenue</div>
                <div className="text-3xl font-bold text-gray-900">
                  ${(analytics.overview.totalRevenue / 100).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Top Courses */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Top Courses by Enrollment</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Enrollments
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lessons
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg Completion
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analytics.topCourses.map((course: any) => (
                      <tr key={course.courseId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {course.courseTitle}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {course.enrollments}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {course.totalLessons}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${course.avgCompletionRate}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">{course.avgCompletionRate}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-8">
            {/* Monthly Growth Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Monthly Growth Trends</h2>
              <div className="space-y-6">
                {/* Enrollments Chart */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Monthly Enrollments</span>
                    <span className="text-sm text-gray-500">Last 6 months</span>
                  </div>
                  <div className="flex items-end space-x-2 h-48">
                    {monthlyData.map((data, index) => {
                      const maxValue = Math.max(...monthlyData.map(d => d.enrollments));
                      const height = (data.enrollments / maxValue) * 100;
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div className="w-full bg-gray-100 rounded-t relative group">
                            <div
                              className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all duration-500 hover:from-blue-700 hover:to-blue-500"
                              style={{ height: `${height * 1.5}px` }}
                            >
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {data.enrollments} enrollments
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Revenue Chart */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Monthly Revenue</span>
                    <span className="text-sm text-green-600 font-semibold">
                      ₹{(monthlyData[monthlyData.length - 1].revenue / 100).toFixed(0)}
                    </span>
                  </div>
                  <div className="flex items-end space-x-2 h-48">
                    {monthlyData.map((data, index) => {
                      const maxValue = Math.max(...monthlyData.map(d => d.revenue));
                      const height = (data.revenue / maxValue) * 100;
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div className="w-full bg-gray-100 rounded-t relative group">
                            <div
                              className="bg-gradient-to-t from-green-600 to-green-400 rounded-t transition-all duration-500 hover:from-green-700 hover:to-green-500"
                              style={{ height: `${height * 1.5}px` }}
                            >
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                ₹{(data.revenue / 100).toFixed(0)}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Category Distribution */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Course Categories Distribution</h2>
              <div className="space-y-4">
                {categoryData.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{category.name}</span>
                      <span className="text-sm text-gray-600">{category.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`${category.color} h-full rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${category.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Engagement Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow p-6 border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-blue-900">Avg. Completion Rate</h3>
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-4xl font-bold text-blue-900 mb-2">68%</div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
                <p className="text-xs text-blue-700 mt-2">↑ 5% from last month</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow p-6 border border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-purple-900">Active Students</h3>
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="text-4xl font-bold text-purple-900 mb-2">245</div>
                <div className="w-full bg-purple-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <p className="text-xs text-purple-700 mt-2">85% of total users</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow p-6 border border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-green-900">Avg. Rating</h3>
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div className="text-4xl font-bold text-green-900 mb-2">4.7</div>
                <div className="flex space-x-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className={`w-5 h-5 ${star <= 4.7 ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-xs text-green-700">Based on 1,234 reviews</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">All Students Progress</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Enrollments
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Courses
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student: any) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.totalEnrollments}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          {student.enrollments.map((enrollment: any) => (
                            <div key={enrollment.enrollmentId} className="text-sm">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-700">{enrollment.courseTitle}</span>
                                <span className="text-gray-500 ml-2">{enrollment.completionRate}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                <div
                                  className="bg-green-600 h-1.5 rounded-full"
                                  style={{ width: `${enrollment.completionRate}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
