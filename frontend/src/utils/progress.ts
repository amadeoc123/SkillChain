import type { CourseProgress, LessonProgress } from '../types';

const STORAGE_KEY = 'skillchain_progress';

/**
 * Get all course progress from localStorage
 */
export const getProgress = (): CourseProgress => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

/**
 * Get progress for a specific course
 */
export const getCourseProgress = (courseId: string): LessonProgress | null => {
  const allProgress = getProgress();
  return allProgress[courseId] || null;
};

/**
 * Mark a lesson as completed
 */
export const completeLesson = (courseId: string, lessonIndex: number): void => {
  const allProgress = getProgress();
  const courseProgress = allProgress[courseId] || {
    courseId,
    completedLessons: [],
    lastAccessedLesson: 0,
  };

  if (!courseProgress.completedLessons.includes(lessonIndex)) {
    courseProgress.completedLessons.push(lessonIndex);
    courseProgress.completedLessons.sort((a, b) => a - b);
  }

  courseProgress.lastAccessedLesson = lessonIndex;
  allProgress[courseId] = courseProgress;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
};

/**
 * Check if a lesson is completed
 */
export const isLessonCompleted = (courseId: string, lessonIndex: number): boolean => {
  const progress = getCourseProgress(courseId);
  return progress ? progress.completedLessons.includes(lessonIndex) : false;
};

/**
 * Get completion percentage for a course
 */
export const getCourseCompletionPercentage = (courseId: string, totalLessons: number): number => {
  const progress = getCourseProgress(courseId);
  if (!progress || totalLessons === 0) return 0;
  return Math.round((progress.completedLessons.length / totalLessons) * 100);
};

/**
 * Check if all lessons in a course are completed
 */
export const isCourseCompleted = (courseId: string, totalLessons: number): boolean => {
  const progress = getCourseProgress(courseId);
  return progress ? progress.completedLessons.length === totalLessons : false;
};
