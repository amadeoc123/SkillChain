import React from 'react';
import { Course } from '../types';

interface CourseListProps {
  courses: Course[];
  onSelectCourse: (courseId: string) => void;
}

export const CourseList: React.FC<CourseListProps> = ({ courses, onSelectCourse }) => {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Available Courses</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {courses.map((course) => (
          <div
            key={course.id}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onClick={() => onSelectCourse(course.id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {course.imageUrl && (
              <img
                src={course.imageUrl}
                alt={course.title}
                style={{ width: '100%', height: '150px', objectFit: 'cover' }}
              />
            )}
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{course.title}</h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
                {course.description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#4f46e5', fontSize: '0.875rem' }}>
                  {course.lessons.length} lessons
                </span>
                <button
                  style={{
                    background: '#4f46e5',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Start Course
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
