import { useLocation } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  const location = useLocation();
  const message = (location.state as any)?.message;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full">
        {message && (
          <div className="max-w-md mx-auto mb-4">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {message}
            </div>
          </div>
        )}
        <LoginForm />
      </div>
    </div>
  );
}
