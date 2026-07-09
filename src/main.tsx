import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {ClerkProvider} from '@clerk/clerk-react';
import App from './App.tsx';
import { ToastProvider } from './components/ToastContext.tsx';
import './index.css';

declare global {
  interface ImportMeta {
    readonly env: {
      readonly VITE_CLERK_PUBLISHABLE_KEY?: string;
      readonly [key: string]: any;
    };
  }
}

const PUBLISHABLE_KEY = 
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 
  (window as any).VITE_CLERK_PUBLISHABLE_KEY;

function Root() {
  if (!PUBLISHABLE_KEY) {
    return <App isClerkConfigured={false} />;
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <App isClerkConfigured={true} />
    </ClerkProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <Root />
    </ToastProvider>
  </StrictMode>,
);
