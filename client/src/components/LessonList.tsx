import { useState } from 'react';
import { Lesson } from '../api/courses';

interface LessonListProps {
  lessons: Lesson[];
  onReorder?: (lessonIds: string[]) => void;
  editable?: boolean;
}

export default function LessonList({ lessons, onReorder, editable = false }: LessonListProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [orderedLessons, setOrderedLessons] = useState(lessons);

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleDragStart = (index: number) => {
    if (!editable) return;
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (!editable || draggedIndex === null || draggedIndex === index) return;

    const newLessons = [...orderedLessons];
    const draggedLesson = newLessons[draggedIndex];
    newLessons.splice(draggedIndex, 1);
    newLessons.splice(index, 0, draggedLesson);

    setOrderedLessons(newLessons);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    if (!editable) return;
    setDraggedIndex(null);
    
    if (onReorder) {
      const lessonIds = orderedLessons.map(lesson => lesson.id);
      onReorder(lessonIds);
    }
  };

  const displayLessons = editable ? orderedLessons : lessons;

  if (displayLessons.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No lessons available yet
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {displayLessons.map((lesson, index) => (
        <div
          key={lesson.id}
          draggable={editable}
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          className={`
            bg-white border rounded-lg p-4 flex items-center justify-between
            ${editable ? 'cursor-move hover:shadow-md transition-shadow' : ''}
            ${draggedIndex === index ? 'opacity-50' : ''}
          `}
        >
          <div className="flex items-center gap-4 flex-1">
            {editable && (
              <div className="text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
              </div>
            )}
            
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold text-sm">
              {index + 1}
            </div>

            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{lesson.title}</h4>
              {lesson.duration && (
                <p className="text-sm text-gray-500 mt-1">
                  Duration: {formatDuration(lesson.duration)}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {lesson.videoUrl && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Video
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
