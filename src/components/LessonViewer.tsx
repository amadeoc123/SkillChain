import React from 'react';
import { Lesson } from '../types';

interface LessonViewerProps {
  lesson: Lesson;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({ lesson }) => {
  return (
    <div style={{ padding: '2rem', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{lesson.title}</h2>
      {lesson.duration && (
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          ⏱️ {lesson.duration}
        </p>
      )}
      
      {lesson.type === 'video' ? (
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
          <iframe
            src={lesson.content}
            title={lesson.title}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div
          style={{
            fontSize: '1rem',
            lineHeight: '1.6',
            color: '#374151',
          }}
          dangerouslySetInnerHTML={{ __html: lesson.content }}
        />
      )}
    </div>
  );
};
