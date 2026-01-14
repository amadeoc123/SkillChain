import { useEffect, useState } from 'react';
import { getCourseCompletionPercentage } from '../utils/progress';

interface ProgressBarProps {
  courseId: string;
  totalLessons: number;
}

export default function ProgressBar({ courseId, totalLessons }: ProgressBarProps) {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const progress = getCourseCompletionPercentage(courseId, totalLessons);
    setPercentage(progress);
  }, [courseId, totalLessons]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Course Progress</span>
        <span className="text-sm font-medium text-primary">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
