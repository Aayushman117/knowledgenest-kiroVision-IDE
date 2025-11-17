import { Course } from '../api/courses';
import { Link } from 'react-router-dom';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const formatPrice = (cents: number) => {
    return `₹${(cents / 100).toFixed(2)}`;
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'text-yellow-400' : 'text-gray-300'}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <Link to={`/courses/${course.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
        {/* Thumbnail */}
        <div className="h-48 bg-gray-200 overflow-hidden">
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
              <span className="text-white text-4xl font-bold">
                {course.title.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {course.title}
          </h3>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
            {course.description}
          </p>

          {/* Instructor */}
          <div className="mb-3 flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm mr-2">
              {course.instructor.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {course.instructor.name}
              </p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex">{renderStars(Math.round(course.averageRating))}</div>
            <span className="ml-2 text-sm text-gray-600">
              {course.averageRating.toFixed(1)} ({course.totalReviews})
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <span>📚 {course._count.lessons} lessons</span>
            <span>👥 {course._count.enrollments} students</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-3 border-t">
            {course.price === 0 ? (
              <span className="text-2xl font-bold text-green-600">FREE</span>
            ) : (
              <span className="text-2xl font-bold text-blue-600">
                {formatPrice(course.price)}
              </span>
            )}
            {course.isEnrolled && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Enrolled
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
