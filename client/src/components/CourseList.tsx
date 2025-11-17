import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCourses, CourseFilters } from '../api/courses';
import CourseCard from './CourseCard';

export default function CourseList() {
  const [filters, setFilters] = useState<CourseFilters>({});
  const [searchInput, setSearchInput] = useState('');

  const { data: courses, isLoading, error } = useQuery({
    queryKey: ['courses', filters],
    queryFn: () => getCourses(filters),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchInput });
  };

  const clearFilters = () => {
    setFilters({});
    setSearchInput('');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Failed to load courses. Please try again later.
      </div>
    );
  }

  return (
    <div>
      {/* Search and Filters */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search courses..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Search
          </button>
        </form>

        {/* Price Range Filter */}
        <div className="flex gap-4 items-center flex-wrap">
          <div className="flex gap-2 items-center">
            <label className="text-sm text-gray-600">Min Price:</label>
            <input
              type="number"
              placeholder="$0"
              className="w-24 px-2 py-1 border rounded text-sm"
              onChange={(e) => {
                const value = e.target.value ? parseInt(e.target.value) * 100 : undefined;
                setFilters({ ...filters, minPrice: value });
              }}
            />
          </div>

          <div className="flex gap-2 items-center">
            <label className="text-sm text-gray-600">Max Price:</label>
            <input
              type="number"
              placeholder="$999"
              className="w-24 px-2 py-1 border rounded text-sm"
              onChange={(e) => {
                const value = e.target.value ? parseInt(e.target.value) * 100 : undefined;
                setFilters({ ...filters, maxPrice: value });
              }}
            />
          </div>

          {(filters.search || filters.minPrice || filters.maxPrice) && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          {courses?.length || 0} course{courses?.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Course Grid */}
      {courses && courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No courses found</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
