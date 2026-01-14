import React, { useState } from 'react';
import { Quiz as QuizType } from '../types';

interface QuizProps {
  quiz: QuizType;
  onComplete: (score: number, passed: boolean) => void;
}

export const Quiz: React.FC<QuizProps> = ({ quiz, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSelectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    let correct = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });

    const score = (correct / quiz.questions.length) * 100;
    const passed = score >= quiz.passingScore;
    setShowResults(true);
    onComplete(score, passed);
  };

  const question = quiz.questions[currentQuestion];
  const allAnswered = selectedAnswers.length === quiz.questions.length && 
                       selectedAnswers.every(answer => answer !== undefined);

  if (showResults) {
    const correct = quiz.questions.filter((q, i) => selectedAnswers[i] === q.correctAnswer).length;
    const score = (correct / quiz.questions.length) * 100;
    const passed = score >= quiz.passingScore;

    return (
      <div style={{ padding: '2rem', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Quiz Results</h2>
        <div style={{ 
          fontSize: '3rem', 
          marginBottom: '1rem',
          color: passed ? '#10b981' : '#ef4444'
        }}>
          {passed ? '✅' : '❌'}
        </div>
        <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
          Score: {score.toFixed(0)}%
        </p>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
          {correct} out of {quiz.questions.length} correct
        </p>
        {passed ? (
          <p style={{ color: '#10b981', fontSize: '1.125rem' }}>
            🎉 Congratulations! You passed the quiz!
          </p>
        ) : (
          <p style={{ color: '#ef4444', fontSize: '1.125rem' }}>
            You need {quiz.passingScore}% to pass. Please try again.
          </p>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem' }}>Quiz</h2>
          <span style={{ color: '#6b7280' }}>
            Question {currentQuestion + 1} of {quiz.questions.length}
          </span>
        </div>
        <div style={{ 
          height: '4px', 
          background: '#e5e7eb', 
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{ 
            height: '100%', 
            background: '#4f46e5',
            width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%`,
            transition: 'width 0.3s'
          }} />
        </div>
      </div>

      <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>
        {question.question}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelectAnswer(index)}
            style={{
              padding: '1rem',
              border: `2px solid ${selectedAnswers[currentQuestion] === index ? '#4f46e5' : '#e5e7eb'}`,
              borderRadius: '8px',
              background: selectedAnswers[currentQuestion] === index ? '#eef2ff' : 'white',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ marginRight: '0.5rem' }}>
              {selectedAnswers[currentQuestion] === index ? '⦿' : '○'}
            </span>
            {option}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            border: '1px solid #e5e7eb',
            background: 'white',
            cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
            opacity: currentQuestion === 0 ? 0.5 : 1,
          }}
        >
          ← Previous
        </button>

        {currentQuestion < quiz.questions.length - 1 ? (
          <button
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestion] === undefined}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              border: 'none',
              background: selectedAnswers[currentQuestion] !== undefined ? '#4f46e5' : '#e5e7eb',
              color: 'white',
              cursor: selectedAnswers[currentQuestion] !== undefined ? 'pointer' : 'not-allowed',
            }}
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              border: 'none',
              background: allAnswered ? '#10b981' : '#e5e7eb',
              color: 'white',
              cursor: allAnswered ? 'pointer' : 'not-allowed',
              fontWeight: 'bold',
            }}
          >
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
};
