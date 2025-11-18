import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';

export default function EnrollmentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseTitle = searchParams.get('courseTitle') || 'the course';
  const courseId = searchParams.get('courseId');
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Stop confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleStartLearning = () => {
    if (courseId) {
      navigate(`/learn/${courseId}`);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <Layout>
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe'][
                  Math.floor(Math.random() * 6)
                ],
              }}
            />
          ))}
        </div>
      )}

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
        <div className="max-w-2xl w-full">
          {/* Success Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
            {/* Header with animated checkmark */}
            <div className="bg-gradient-to-r from-green-400 to-blue-500 p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-white opacity-10 animate-pulse"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-4 animate-bounce-in">
                  <svg
                    className="w-16 h-16 text-green-500 animate-check"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold text-white mb-2 animate-slide-up">
                  🎉 Congratulations! 🎉
                </h1>
                <p className="text-xl text-white opacity-90 animate-slide-up-delay">
                  You're enrolled!
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              <div className="text-center animate-fade-in">
                <p className="text-2xl text-gray-800 font-semibold mb-2">
                  Welcome to
                </p>
                <p className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-bold mb-4">
                  {courseTitle}
                </p>
                <p className="text-gray-600 text-lg">
                  Your learning journey starts now! 🚀
                </p>
              </div>

              {/* Animated Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
                <div className="text-center p-4 rounded-xl bg-blue-50 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  <div className="text-4xl mb-2">📚</div>
                  <p className="text-sm font-semibold text-gray-700">Access All Lessons</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-purple-50 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                  <div className="text-4xl mb-2">🎓</div>
                  <p className="text-sm font-semibold text-gray-700">Track Your Progress</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-pink-50 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                  <div className="text-4xl mb-2">⭐</div>
                  <p className="text-sm font-semibold text-gray-700">Earn Certificate</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleStartLearning}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl animate-pulse-slow"
                >
                  Start Learning Now →
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-200 transform hover:scale-105 transition-all duration-200"
                >
                  Go to Dashboard
                </button>
              </div>

              {/* Additional Info */}
              <div className="text-center pt-4 border-t border-gray-200 animate-fade-in-delay">
                <p className="text-sm text-gray-500 mb-2">
                  💡 Pro Tip: Set aside dedicated time each day for learning
                </p>
                <p className="text-xs text-gray-400">
                  You can access this course anytime from your dashboard
                </p>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="mt-8 text-center animate-bounce-slow">
            <p className="text-gray-600">
              Ready to become an expert? Let's go! 🎯
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes scale-in {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes bounce-in {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes check {
          0% {
            stroke-dasharray: 0, 100;
          }
          100% {
            stroke-dasharray: 100, 0;
          }
        }

        @keyframes slide-up {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          animation: confetti-fall 3s linear infinite;
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .animate-check {
          animation: check 0.6s ease-in-out 0.3s forwards;
          stroke-dasharray: 0, 100;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .animate-slide-up-delay {
          animation: slide-up 0.6s ease-out 0.2s both;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out 0.4s both;
        }

        .animate-fade-in-delay {
          animation: fade-in 1s ease-out 0.6s both;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </Layout>
  );
}
