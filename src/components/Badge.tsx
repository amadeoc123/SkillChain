import React from 'react';
import { Badge as BadgeType } from '../types';

interface BadgeProps {
  badge: BadgeType;
  score: number;
}

export const Badge: React.FC<BadgeProps> = ({ badge, score }) => {
  return (
    <div style={{ 
      padding: '3rem 2rem', 
      background: 'white', 
      borderRadius: '8px', 
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      textAlign: 'center',
      maxWidth: '500px',
      margin: '0 auto'
    }}>
      <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>
        {badge.imageUrl || '🏆'}
      </div>
      
      <h2 style={{ 
        fontSize: '1.75rem', 
        marginBottom: '0.5rem',
        color: '#10b981'
      }}>
        Congratulations!
      </h2>
      
      <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
        {badge.title}
      </h3>
      
      <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
        {badge.description}
      </p>
      
      <div style={{ 
        background: '#f3f4f6', 
        padding: '1rem', 
        borderRadius: '8px',
        marginBottom: '1.5rem'
      }}>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
          Final Score
        </p>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4f46e5' }}>
          {score.toFixed(0)}%
        </p>
      </div>
      
      <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
        You have successfully completed this course and earned this badge.
      </p>
    </div>
  );
};
