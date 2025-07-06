import { sdk } from '../lib/auth';

export default function LoginView() {
  const handleLogin = () => {
    sdk.authenticate();
  };

  return (
    <>
      <button onClick={handleLogin}>Login</button>
    </>
  );
}
