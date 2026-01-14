import { Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import LessonViewer from './pages/LessonViewer';
import ProofSubmit from './pages/ProofSubmit';
import MyCertificates from './pages/MyCertificates';
import VerifyCertificate from './pages/VerifyCertificate';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId" element={<CourseDetail />} />
          <Route path="/courses/:courseId/lessons/:lessonIndex" element={<LessonViewer />} />
          <Route path="/submit-proof/:courseId" element={<ProofSubmit />} />
          <Route path="/my-certificates" element={<MyCertificates />} />
          <Route path="/verify/:tokenId" element={<VerifyCertificate />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
