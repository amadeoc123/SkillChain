import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCourses } from '../utils/api';
import { mockCourses } from '../data/mockCourses';
import type { Course } from '../types';

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      // Try to load from API first
      const data = await getCourses();
      
      // If API returns empty array, use mock data for MVP/demo
      if (data.length === 0) {
        setCourses(mockCourses);
      } else {
        setCourses(data);
      }
    } catch (err) {
      // On API error, fallback to mock data for MVP/demo
      console.warn('API unavailable, using mock data:', err);
      setCourses(mockCourses);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-600">Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Available Courses</h1>

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No courses available yet.</p>
          <p className="text-sm text-gray-500">Check back soon!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course._id}
              to={`/courses/${course._id}`}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                  course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {course.level}
                </span>
                <span className="text-sm text-gray-500">
                  {course.lessons.length} lessons
                </span>
              </div>

              <h3 className="text-xl font-bold mb-2">{course.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary">
                  #{course.skillTag}
                </span>
                <span className="text-sm text-primary hover:underline">
                  View Details →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
