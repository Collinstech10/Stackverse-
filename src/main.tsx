import React, {StrictMode, ErrorInfo, ReactNode, useState, useEffect} from 'react';
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

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: (error: Error) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ClerkErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public props: ErrorBoundaryProps;
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Clerk loading or lifecycle error caught by ErrorBoundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback(this.state.error || new Error("Clerk failed to load or initialize"));
    }
    return this.props.children;
  }
}

function Root() {
  const [clerkFailed, setClerkFailed] = useState(false);
  const [clerkError, setClerkError] = useState<Error | null>(null);

  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      const msg = event.message || '';
      if (
        msg.includes('Clerk') || 
        msg.includes('clerk-js') || 
        msg.includes('failed_to_load_clerk') || 
        (event.error && String(event.error).includes('Clerk'))
      ) {
        console.warn("Captured Clerk-related global error, falling back to guest mode:", event);
        setClerkFailed(true);
        setClerkError(new Error(msg || "Clerk script loading timed out or was blocked by an adblocker/firewall."));
        event.preventDefault();
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const msg = reason?.message || String(reason || '');
      if (
        msg.includes('Clerk') || 
        msg.includes('clerk-js') || 
        msg.includes('failed_to_load_clerk')
      ) {
        console.warn("Captured Clerk-related unhandled promise rejection, falling back to guest mode:", event);
        setClerkFailed(true);
        setClerkError(new Error(msg || "Clerk initialization timed out."));
        event.preventDefault();
      }
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (!PUBLISHABLE_KEY || clerkFailed) {
    return <App isClerkConfigured={false} clerkError={clerkError} />;
  }

  return (
    <ClerkErrorBoundary fallback={(err) => <App isClerkConfigured={false} clerkError={err} />}>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <App isClerkConfigured={true} />
      </ClerkProvider>
    </ClerkErrorBoundary>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <Root />
    </ToastProvider>
  </StrictMode>,
);
