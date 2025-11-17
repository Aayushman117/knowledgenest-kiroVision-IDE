import { Progress } from '../api/progress';
import { Lesson } from '../api/courses';

interface ProgressTrackerProps {
  lessons: Lesson[];
  progress: Progress[];
}

export default function ProgressTracker({ lessons, progress }: ProgressTrackerProps) {
  const progressMap = new Map(progress.map(p => [p.lessonId, p]));
  
  const completedCount = progress.filter(p => p.completed).length;
  const totalLessons = lessons.length;
  const completionPercentage = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Your Progress</h3>

      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Course Completion</span>
          <span className="text-sm font-semibold text-gray-900">
            {completedCount} / {totalLessons} lessons
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {Math.round(completionPercentage)}% complete
        </p>
      </div>

      {/* Lesson Progress List */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Lessons</h4>
        {lessons.map((lesson, index) => {
          const lessonProgress = progressMap.get(lesson.id);
          const isCompleted = lessonProgress?.completed || false;
          const watchTime = lessonProgress?.watchTime || 0;
          const duration = lesson.duration || 0;
          const watchPercentage = duration > 0 ? (watchTime / duration) * 100 : 0;

          return (
            <div
              key={lesson.id}
              className="flex items-center gap-3 p-2 rounded hover:bg-gray-50"
            >
              {/* Status Icon */}
              <div className={`
                flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0
                ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
              `}>
                {isCompleted ? (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-xs text-gray-500">{index + 1}</span>
                )}
              </div>

              {/* Lesson Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {lesson.title}
                </p>
                {!isCompleted && watchPercentage > 0 && (
                  <div className="mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div
                        className="bg-blue-500 h-1 rounded-full"
                        style={{ width: `${watchPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Badge */}
              {isCompleted && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  Done
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Completion Message */}
      {completionPercentage === 100 && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 font-medium">
            🎉 Congratulations! You've completed this course!
          </p>
        </div>
      )}
    </div>
  );
}
