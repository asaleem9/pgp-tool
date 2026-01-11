import { useState, useEffect } from 'react';
import { Navigation, TabType } from './components/Navigation';
import { EncryptForm } from './components/EncryptForm';
import { DecryptForm } from './components/DecryptForm';
import { SignForm } from './components/SignForm';
import { VerifyForm } from './components/VerifyForm';
import { KeyInspector } from './components/KeyInspector';
import { TrustBadge } from './components/TrustBadge';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('encrypt');

  // Warn user before leaving if there's sensitive data
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Check if any forms have data - simple check
      const textarea = document.querySelector('textarea') as HTMLTextAreaElement | null;
      const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement | null;
      const hasData = textarea?.value || passwordInput?.value;

      if (hasData) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-mesh bg-gray-50 flex flex-col relative overflow-hidden">
      {/* Animated gradient orbs in background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-primary-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-accent-purple/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-accent-cyan/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 relative z-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
          {/* Tab panels */}
          <div
            id="encrypt-panel"
            role="tabpanel"
            aria-labelledby="encrypt-tab"
            hidden={activeTab !== 'encrypt'}
            className="animate-slide-up"
          >
            {activeTab === 'encrypt' && <EncryptForm />}
          </div>

          <div
            id="decrypt-panel"
            role="tabpanel"
            aria-labelledby="decrypt-tab"
            hidden={activeTab !== 'decrypt'}
            className="animate-slide-up"
          >
            {activeTab === 'decrypt' && <DecryptForm />}
          </div>

          <div
            id="sign-panel"
            role="tabpanel"
            aria-labelledby="sign-tab"
            hidden={activeTab !== 'sign'}
            className="animate-slide-up"
          >
            {activeTab === 'sign' && <SignForm />}
          </div>

          <div
            id="verify-panel"
            role="tabpanel"
            aria-labelledby="verify-tab"
            hidden={activeTab !== 'verify'}
            className="animate-slide-up"
          >
            {activeTab === 'verify' && <VerifyForm />}
          </div>

          <div
            id="inspect-panel"
            role="tabpanel"
            aria-labelledby="inspect-tab"
            hidden={activeTab !== 'inspect'}
            className="animate-slide-up"
          >
            {activeTab === 'inspect' && <KeyInspector />}
          </div>

          {/* Trust Badge */}
          <TrustBadge className="mt-8" />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/50 bg-white/60 backdrop-blur-lg relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-secondary">
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors font-medium"
              >
                Open Source
              </a>
              <span className="text-gray-300">|</span>
              <a href="#" className="hover:text-primary transition-colors font-medium">
                Privacy Policy
              </a>
              <span className="text-gray-300">|</span>
              <a href="#" className="hover:text-primary transition-colors font-medium">
                How It Works
              </a>
            </div>
            <div className="text-gray-400">
              Powered by{' '}
              <a
                href="https://openpgpjs.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors font-medium"
              >
                OpenPGP.js
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
