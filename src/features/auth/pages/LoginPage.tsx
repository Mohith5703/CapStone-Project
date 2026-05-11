import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';  // ✅ Relative path
import { LoginForm } from '../components/LoginForm';

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (username: string, password: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      await login(username, password);
      navigate('/home');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />;
};

export default LoginPage;

// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { LoginForm } from '../components/LoginForm';
// import { useAuth } from '../context/AuthContext';

// const LoginPage = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleLogin = async (username: string, password: string) => {
//     setIsLoading(true);
//     setError('');
    
//     try {
//       await login(username, password);
//       navigate('/employees');
//     } catch (err: any) {
//       console.error('Login failed:', err);
//       setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="login-container">
//       <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />
//     </div>
//   );
// };

// export default LoginPage;