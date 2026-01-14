export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold mb-2">SkillChain</h3>
            <p className="text-gray-400 text-sm">
              Decentralized Proof-of-Skill Learning Platform
            </p>
          </div>

          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm mb-2">
              Academic MVP - Not for Production Use
            </p>
            <p className="text-gray-500 text-xs">
              © 2026 SkillChain. Master's Thesis Project.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-800 text-center text-gray-500 text-xs">
          <p>
            ⚠️ Disclaimer: This platform is a proof-of-concept for academic research.
            It does not replace formal education or official certifications.
          </p>
        </div>
      </div>
    </footer>
  );
}
