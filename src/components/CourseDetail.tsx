import React, { useState } from 'react';
import { Course, UserProgress } from '../types';
import { LessonViewer } from './LessonViewer';
import { Quiz } from './Quiz';
import { Badge } from './Badge';

interface CourseDetailProps {
  course: Course;
  onBack: () => void;
}

export const CourseDetail: React.FC<CourseDetailProps> = ({ course, onBack }) => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [progress, setProgress] = useState<UserProgress>({
    courseId: course.id,
    completedLessons: [],
    badgeEarned: false,
  });

  const currentLesson = course.lessons[currentLessonIndex];
  const isLastLesson = currentLessonIndex === course.lessons.length - 1;

  const markLessonComplete = () => {
    if (!progress.completedLessons.includes(currentLesson.id)) {
      setProgress({
        ...progress,
        completedLessons: [...progress.completedLessons, currentLesson.id],
      });
    }
  };

  const handleNext = () => {
    markLessonComplete();
    if (!isLastLesson) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  const handleStartQuiz = () => {
    markLessonComplete();
    setShowQuiz(true);
  };

  const handleQuizComplete = (score: number, passed: boolean) => {
    setProgress({
      ...progress,
      quizScore: score,
      badgeEarned: passed,
    });
  };

  const allLessonsCompleted = progress.completedLessons.length === course.lessons.length;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <button
        onClick={onBack}
        style={{
          padding: '0.5rem 1rem',
          marginBottom: '1.5rem',
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        ← Back to Courses
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
        {/* Sidebar */}
        <div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{course.title}</h2>
          <div style={{ 
            background: 'white', 
            borderRadius: '8px', 
            padding: '1rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '1rem', color: '#6b7280' }}>
              COURSE CONTENT
            </h3>
            {course.lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                onClick={() => {
                  setCurrentLessonIndex(index);
                  setShowQuiz(false);
                }}
                style={{
                  padding: '0.75rem',
                  marginBottom: '0.5rem',
                  background: currentLessonIndex === index && !showQuiz ? '#eef2ff' : 'transparent',
                  borderLeft: `3px solid ${currentLessonIndex === index && !showQuiz ? '#4f46e5' : 'transparent'}`,
                  cursor: 'pointer',
                  borderRadius: '4px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.875rem' }}>{lesson.title}</span>
                  {progress.completedLessons.includes(lesson.id) && (
                    <span style={{ color: '#10b981' }}>✓</span>
                  )}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  {lesson.type === 'video' ? '📹' : '📄'} {lesson.duration}
                </span>
              </div>
            ))}
            <div
              onClick={() => allLessonsCompleted && setShowQuiz(true)}
              style={{
                padding: '0.75rem',
                marginTop: '1rem',
                background: showQuiz ? '#eef2ff' : allLessonsCompleted ? '#fef3c7' : '#f3f4f6',
                borderLeft: `3px solid ${showQuiz ? '#4f46e5' : allLessonsCompleted ? '#f59e0b' : '#e5e7eb'}`,
                cursor: allLessonsCompleted ? 'pointer' : 'not-allowed',
                borderRadius: '4px',
                opacity: allLessonsCompleted ? 1 : 0.5,
              }}
            >
              <span style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>
                📝 Final Quiz
              </span>
            </div>
          </div>

          {/* Progress */}
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            background: 'white', 
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Progress
            </h3>
            <div style={{ 
              height: '8px', 
              background: '#e5e7eb', 
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '0.5rem'
            }}>
              <div style={{ 
                height: '100%', 
                background: '#10b981',
                width: `${(progress.completedLessons.length / course.lessons.length) * 100}%`,
                transition: 'width 0.3s'
              }} />
            </div>
            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              {progress.completedLessons.length} of {course.lessons.length} lessons completed
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div>
          {progress.badgeEarned ? (
            <Badge badge={course.badge} score={progress.quizScore!} />
          ) : showQuiz ? (
            <Quiz quiz={course.quiz} onComplete={handleQuizComplete} />
          ) : (
            <>
              <LessonViewer lesson={currentLesson} />
              
              <div style={{ 
                marginTop: '2rem', 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '1.5rem',
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <button
                  onClick={handlePrevious}
                  disabled={currentLessonIndex === 0}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '4px',
                    border: '1px solid #e5e7eb',
                    background: 'white',
                    cursor: currentLessonIndex === 0 ? 'not-allowed' : 'pointer',
                    opacity: currentLessonIndex === 0 ? 0.5 : 1,
                  }}
                >
                  ← Previous Lesson
                </button>

                {isLastLesson ? (
                  <button
                    onClick={handleStartQuiz}
                    style={{
                      padding: '0.75rem 2rem',
                      borderRadius: '4px',
                      border: 'none',
                      background: '#10b981',
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                    }}
                  >
                    Start Final Quiz →
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    style={{
                      padding: '0.75rem 1.5rem',
                      borderRadius: '4px',
                      border: 'none',
                      background: '#4f46e5',
                      color: 'white',
                      cursor: 'pointer',
                    }}
                  >
                    Next Lesson →
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
