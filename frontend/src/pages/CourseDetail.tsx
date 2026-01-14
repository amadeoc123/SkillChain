import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseById } from '../utils/api';
import { useActiveAccount } from 'thirdweb/react';
import { isLessonCompleted } from '../utils/progress';
import { getMockCourseById } from '../data/mockCourses';
import ProgressBar from '../components/ProgressBar';
import type { Course } from '../types';

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const account = useActiveAccount();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (courseId) loadCourse(courseId);
  }, [courseId]);

  useEffect(() => {
    const handleFocus = () => setRefreshKey(prev => prev + 1);
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const loadCourse = async (courseId: string) => {
    try {
      const data = await getCourseById(courseId);
      setCourse(data);
    } catch (err) {
      // On API error, fallback to mock data for MVP/demo
      console.warn('API unavailable, using mock data:', err);
      const mockCourse = getMockCourseById(courseId);
      if (mockCourse) {
        setCourse(mockCourse);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-16 text-center">Loading...</div>;
  if (!course) return <div className="container mx-auto px-4 py-16 text-center">Course not found</div>;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
            course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {course.level}
          </span>
        </div>

        <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
        <p className="text-xl text-gray-600 mb-8">{course.description}</p>

        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar key={refreshKey} courseId={course._id} totalLessons={course.lessons.length} />
        </div>

        <div className="card mb-8">
          <h2 className="text-2xl font-bold mb-4">Lessons</h2>
          <ul className="space-y-3" key={refreshKey}>
            {course.lessons.map((lesson, idx) => {
              const completed = isLessonCompleted(course._id, idx);
              
              return (
                <li key={idx}>
                  <Link
                    to={`/courses/${course._id}/lessons/${idx}`}
                    className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                      completed
                        ? 'bg-green-50 border border-green-200 hover:bg-green-100'
                        : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-3 text-lg">{completed ? '✅' : '📚'}</span>
                      <div>
                        <p className="font-medium text-gray-900">
                          Lesson {idx + 1}: {lesson}
                        </p>
                        {completed && (
                          <p className="text-sm text-green-600">Completed</p>
                        )}
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {account ? (
          <Link
            to={`/submit-proof/${course._id}`}
            className="btn-primary inline-block"
          >
            Submit Proof of Completion
          </Link>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              Connect your wallet to submit proof and earn a certificate.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
