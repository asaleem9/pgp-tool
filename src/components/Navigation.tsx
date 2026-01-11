export type TabType = 'encrypt' | 'decrypt' | 'sign' | 'verify' | 'inspect';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string }[] = [
  { id: 'encrypt', label: 'Encrypt' },
  { id: 'decrypt', label: 'Decrypt' },
  { id: 'sign', label: 'Sign' },
  { id: 'verify', label: 'Verify' },
  { id: 'inspect', label: 'Inspect' },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg blur-md opacity-30 group-hover:opacity-50 transition-opacity" />
              <svg
                className="w-8 h-8 text-primary relative z-10 group-hover:scale-110 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" strokeWidth={2} />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth={2} />
              </svg>
            </div>
            <span className="font-semibold text-lg text-primary tracking-tight">PGP Tool</span>
          </div>

          {/* Tab Navigation */}
          <nav className="flex overflow-x-auto gap-1" role="tablist" aria-label="Main navigation">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`${tab.id}-panel`}
                className={`relative px-3 sm:px-4 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap rounded-lg ${
                  activeTab === tab.id
                    ? 'text-primary'
                    : 'text-secondary hover:text-primary hover:bg-gray-50'
                }`}
                onClick={() => onTabChange(tab.id)}
              >
                {activeTab === tab.id && (
                  <span className="absolute inset-x-0 -bottom-px h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full" />
                )}
                {tab.label}
              </button>
            ))}
          </nav>

          {/* About link - can be expanded later */}
          <div className="hidden sm:block">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-secondary hover:text-primary transition-colors font-medium"
            >
              About
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
