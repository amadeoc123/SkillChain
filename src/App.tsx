import { useState } from 'react';
import { CourseList } from './components/CourseList';
import { CourseDetail } from './components/CourseDetail';
import { mockCourses } from './data/mockData';
import { Course } from './types';

function App() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const handleSelectCourse = (courseId: string) => {
    const course = mockCourses.find(c => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
    }
  };

  const handleBack = () => {
    setSelectedCourse(null);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f9fafb',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <header style={{ 
        background: 'white', 
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem 2rem',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: '1.5rem',
          color: '#4f46e5',
          fontWeight: 'bold'
        }}>
          🎓 SkillChain LMS
        </h1>
      </header>

      <main>
        {selectedCourse ? (
          <CourseDetail course={selectedCourse} onBack={handleBack} />
        ) : (
          <CourseList courses={mockCourses} onSelectCourse={handleSelectCourse} />
        )}
      </main>
    </div>
  );
}

export default App;
