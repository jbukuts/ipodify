import { sdk } from '../lib/sdk';

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
