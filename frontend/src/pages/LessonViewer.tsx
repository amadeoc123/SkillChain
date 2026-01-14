import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCourseById } from '../utils/api';
import { completeLesson, isLessonCompleted } from '../utils/progress';
import { getSlidePath } from '../data/lessonSlides';
import { getMockCourseById } from '../data/mockCourses';
import { getQuiz, calculateScore, isQuizPassed } from '../data/lessonQuizzes';
import type { Course } from '../types';
import type { Quiz } from '../data/lessonQuizzes';

export default function LessonViewer() {
  const { courseId, lessonIndex } = useParams<{ courseId: string; lessonIndex: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const currentIndex = parseInt(lessonIndex || '0', 10);

  useEffect(() => {
    if (courseId) {
      loadCourse(courseId);
      setIsCompleted(isLessonCompleted(courseId, currentIndex));
      const lessonQuiz = getQuiz(courseId, currentIndex);
      setQuiz(lessonQuiz);
      setShowQuiz(false);
      setQuizAnswers({});
      setQuizSubmitted(false);
      setQuizScore(null);
    }
  }, [courseId, currentIndex]);

  const loadCourse = async (id: string) => {
    try {
      const data = await getCourseById(id);
      setCourse(data);
    } catch (err) {
      // On API error, fallback to mock data for MVP/demo
      console.warn('API unavailable, using mock data:', err);
      const mockCourse = getMockCourseById(id);
      if (mockCourse) {
        setCourse(mockCourse);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    if (courseId) {
      completeLesson(courseId, currentIndex);
      setIsCompleted(true);
    }
  };

  const handleQuizAnswer = (questionIndex: number, optionIndex: number) => {
    setQuizAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleQuizSubmit = () => {
    if (!quiz) return;
    const score = calculateScore(quiz, quizAnswers);
    setQuizScore(score);
    setQuizSubmitted(true);
  };

  const handleRetakeQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  const canComplete = () => {
    if (!quiz) return true; // No quiz required
    if (!quizSubmitted || quizScore === null) return false;
    return isQuizPassed(quiz, quizScore);
  };

  const handleNext = () => {
    if (course && currentIndex < course.lessons.length - 1) {
      navigate(`/courses/${courseId}/lessons/${currentIndex + 1}`);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      navigate(`/courses/${courseId}/lessons/${currentIndex - 1}`);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-16 text-center">Loading lesson...</div>;
  }

  if (!course || currentIndex >= course.lessons.length) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-red-600 mb-4">Lesson not found</p>
        <Link to={`/courses/${courseId}`} className="btn-primary">
          Back to Course
        </Link>
      </div>
    );
  }

  const lessonTitle = course.lessons[currentIndex];
  const hasNext = currentIndex < course.lessons.length - 1;
  const hasPrevious = currentIndex > 0;

  // Get actual PDF path from mapping
  const slidePath = courseId ? getSlidePath(courseId, currentIndex) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link
                to={`/courses/${courseId}`}
                className="text-sm text-gray-600 hover:text-primary mb-1 inline-block"
              >
                ← Back to {course.title}
              </Link>
              <h1 className="text-2xl font-bold">{lessonTitle}</h1>
              <p className="text-sm text-gray-600">
                Lesson {currentIndex + 1} of {course.lessons.length}
              </p>
            </div>
            
            {!isCompleted && (
              <button
                onClick={handleComplete}
                disabled={!canComplete()}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  canComplete()
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                title={!canComplete() && quiz ? 'Complete the quiz to mark as complete' : ''}
              >
                Mark as Complete
              </button>
            )}
            
            {isCompleted && (
              <div className="flex items-center text-green-600">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Completed
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Slide Viewer */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gray-100 flex items-center justify-center" style={{ minHeight: '600px' }}>
            {slidePath ? (
              /* PDF Viewer - Display actual slides */
              <iframe
                src={slidePath}
                className="w-full h-full"
                title={lessonTitle}
                style={{ minHeight: '600px', border: 'none' }}
              />
            ) : (
              /* Fallback if PDF not mapped */
              <div className="text-center p-8">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-gray-700 mb-2 font-medium">{lessonTitle}</p>
                <p className="text-sm text-gray-500 mb-4">
                  Slides for this lesson are not yet available.
                </p>
                <p className="text-xs text-gray-400">
                  Course ID: {courseId} | Lesson: {currentIndex + 1}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quiz Section */}
        {quiz && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            {!showQuiz ? (
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Lesson Assessment</h3>
                <p className="text-gray-600 mb-4">
                  Complete a short quiz to test your understanding.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Passing score: {quiz.passingScore}% ({quiz.questions.length} questions)
                </p>
                <button
                  onClick={() => setShowQuiz(true)}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 font-medium transition-colors"
                >
                  Take Quiz
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold mb-6">Quiz: {lessonTitle}</h3>
                
                {!quizSubmitted ? (
                  <div className="space-y-6">
                    {quiz.questions.map((question, qIndex) => (
                      <div key={question.id} className="border-b pb-6 last:border-0">
                        <p className="font-medium mb-3">
                          {qIndex + 1}. {question.question}
                        </p>
                        <div className="space-y-2">
                          {question.options.map((option, oIndex) => (
                            <label
                              key={oIndex}
                              className="flex items-center p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                              <input
                                type="radio"
                                name={`question-${qIndex}`}
                                checked={quizAnswers[qIndex] === oIndex}
                                onChange={() => handleQuizAnswer(qIndex, oIndex)}
                                className="mr-3"
                              />
                              <span>{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={handleQuizSubmit}
                        disabled={Object.keys(quizAnswers).length !== quiz.questions.length}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                          Object.keys(quizAnswers).length === quiz.questions.length
                            ? 'bg-primary text-white hover:bg-blue-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Submit Quiz
                      </button>
                      <button
                        onClick={() => setShowQuiz(false)}
                        className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className={`text-6xl mb-4 ${
                      quizScore !== null && isQuizPassed(quiz, quizScore) ? '✅' : '❌'
                    }`}>
                      {quizScore !== null && isQuizPassed(quiz, quizScore) ? '🎉' : '📚'}
                    </div>
                    <h4 className="text-2xl font-bold mb-2">
                      Score: {quizScore}%
                    </h4>
                    <p className={`text-lg mb-6 ${
                      quizScore !== null && isQuizPassed(quiz, quizScore)
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      {quizScore !== null && isQuizPassed(quiz, quizScore)
                        ? `Passed! (Required: ${quiz.passingScore}%)`
                        : `Failed. Required: ${quiz.passingScore}%`}
                    </p>
                    
                    {/* Show correct answers */}
                    <div className="text-left mb-6 max-w-2xl mx-auto">
                      <h5 className="font-bold mb-3">Review:</h5>
                      {quiz.questions.map((question, qIndex) => {
                        const userAnswer = quizAnswers[qIndex];
                        const isCorrect = userAnswer === question.correctAnswer;
                        return (
                          <div key={question.id} className="mb-4 p-3 rounded-lg border">
                            <p className="font-medium mb-2">
                              {qIndex + 1}. {question.question}
                            </p>
                            <p className={`text-sm ${
                              isCorrect ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {isCorrect ? '✓' : '✗'} Your answer: {question.options[userAnswer]}
                            </p>
                            {!isCorrect && (
                              <p className="text-sm text-gray-600">
                                Correct answer: {question.options[question.correctAnswer]}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="flex gap-4 justify-center">
                      {quizScore !== null && !isQuizPassed(quiz, quizScore) && (
                        <button
                          onClick={handleRetakeQuiz}
                          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 font-medium transition-colors"
                        >
                          Retake Quiz
                        </button>
                      )}
                      <button
                        onClick={() => setShowQuiz(false)}
                        className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={!hasPrevious}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              hasPrevious
                ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            ← Previous Lesson
          </button>

          {hasNext ? (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 font-medium transition-colors"
            >
              Next Lesson →
            </button>
          ) : (
            <Link
              to={`/courses/${courseId}`}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
            >
              Complete Course →
            </Link>
          )}
        </div>

        {/* Lesson List Sidebar */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="font-bold mb-4">Course Lessons</h3>
          <div className="space-y-2">
            {course.lessons.map((lesson, idx) => {
              const completed = courseId ? isLessonCompleted(courseId, idx) : false;
              const isCurrent = idx === currentIndex;

              return (
                <Link
                  key={idx}
                  to={`/courses/${courseId}/lessons/${idx}`}
                  className={`block p-3 rounded-lg transition-colors ${
                    isCurrent
                      ? 'bg-primary text-white'
                      : completed
                      ? 'bg-green-50 text-green-800 hover:bg-green-100'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {idx + 1}. {lesson}
                    </span>
                    {completed && !isCurrent && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
