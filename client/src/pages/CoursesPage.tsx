import CourseList from '../components/CourseList';

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Browse Courses</h1>
          <p className="text-gray-600 mt-2">
            Discover and enroll in courses to start your learning journey
          </p>
        </div>
      </div>

      {/* Course List */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <CourseList />
      </div>
    </div>
  );
}


