import { useEffect } from 'react';
import { useInspect } from '../hooks/useInspect';
import { DropZone } from './DropZone';
import { formatFingerprint, getExpiryStatus, getDaysUntilExpiry } from '../utils/pgp';
import { useClipboard } from '../hooks/useClipboard';

export function KeyInspector() {
  const {
    keyText,
    keyInfo,
    error,
    isLoading,
    setKeyText,
    inspect,
    clearAll,
  } = useInspect();

  const { copied: fingerprintCopied, copy: copyFingerprint } = useClipboard();
  const { copied: keyIdCopied, copy: copyKeyId } = useClipboard();

  useEffect(() => {
    return () => {
      clearAll();
    };
  }, [clearAll]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await inspect();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getExpiryDisplay = (expirationDate: Date | null) => {
    if (!expirationDate) return 'Never';
    const status = getExpiryStatus(expirationDate);
    const days = getDaysUntilExpiry(expirationDate);
    const dateStr = formatDate(expirationDate);

    if (status === 'expired') {
      return <span className="text-error">{dateStr} (Expired)</span>;
    } else if (status === 'expiring-week') {
      return <span className="text-warning">{dateStr} (in {days} days)</span>;
    } else if (status === 'expiring-soon') {
      return <span className="text-yellow-600">{dateStr} (in {days} days)</span>;
    }
    return dateStr;
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Inspector</h2>
          <p className="text-sm text-secondary mb-4">
            Paste any PGP key (public or private) to view its detailed information.
          </p>

          <div className="space-y-2">
            <DropZone onDrop={setKeyText} hint="Drop key file here">
              <textarea
                id="inspect-key"
                className={`w-full h-40 px-3 py-2 font-mono text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 transition-colors ${
                  error
                    ? 'border-error focus:ring-error/20 focus:border-error'
                    : 'border-gray-300 focus:ring-primary/20 focus:border-primary'
                }`}
                placeholder="-----BEGIN PGP PUBLIC KEY BLOCK-----&#10;or&#10;-----BEGIN PGP PRIVATE KEY BLOCK-----"
                value={keyText}
                onChange={(e) => setKeyText(e.target.value)}
                spellCheck={false}
              />
            </DropZone>

            {error && (
              <p className="text-sm text-error" role="alert">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !keyText.trim()}
            className="mt-4 w-full py-3 px-4 bg-primary text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Inspecting...' : 'Inspect Key'}
          </button>
        </div>
      </form>

      {keyInfo && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Key Details</h3>
            <span
              className={`px-2 py-1 text-xs font-medium rounded ${
                keyInfo.type === 'private'
                  ? 'bg-warning/10 text-warning'
                  : 'bg-primary/10 text-primary'
              }`}
            >
              {keyInfo.type === 'private' ? 'Private Key' : 'Public Key'}
            </span>
          </div>

          <div className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-xs font-medium text-secondary uppercase tracking-wide">
                  Algorithm
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {keyInfo.algorithm}
                  {keyInfo.curve && ` (${keyInfo.curve})`}
                  {keyInfo.bitSize && ` ${keyInfo.bitSize}-bit`}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-secondary uppercase tracking-wide">
                  Key ID
                </dt>
                <dd className="mt-1 text-sm text-gray-900 font-mono flex items-center gap-2">
                  0x{keyInfo.keyId.slice(-16)}
                  <button
                    type="button"
                    onClick={() => copyKeyId(keyInfo.keyId)}
                    className="text-secondary hover:text-primary"
                    title="Copy Key ID"
                  >
                    {keyIdCopied ? (
                      <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-secondary uppercase tracking-wide">
                  Created
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(keyInfo.created)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-secondary uppercase tracking-wide">
                  Expires
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {getExpiryDisplay(keyInfo.expirationDate)}
                </dd>
              </div>
            </div>

            {/* Fingerprint */}
            <div>
              <dt className="text-xs font-medium text-secondary uppercase tracking-wide">
                Fingerprint
              </dt>
              <dd className="mt-1 flex items-center gap-2">
                <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                  {formatFingerprint(keyInfo.fingerprint)}
                </code>
                <button
                  type="button"
                  onClick={() => copyFingerprint(keyInfo.fingerprint)}
                  className="text-secondary hover:text-primary"
                  title="Copy Fingerprint"
                >
                  {fingerprintCopied ? (
                    <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </dd>
            </div>

            {/* User IDs */}
            {keyInfo.userIds.length > 0 && (
              <div>
                <dt className="text-xs font-medium text-secondary uppercase tracking-wide mb-2">
                  User IDs
                </dt>
                <dd>
                  <ul className="space-y-1">
                    {keyInfo.userIds.map((uid, i) => (
                      <li key={i} className="text-sm text-gray-900 flex items-center gap-2">
                        <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {uid}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}

            {/* Capabilities */}
            <div>
              <dt className="text-xs font-medium text-secondary uppercase tracking-wide mb-2">
                Capabilities
              </dt>
              <dd className="flex flex-wrap gap-2">
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    keyInfo.capabilities.certify
                      ? 'bg-success/10 text-success'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {keyInfo.capabilities.certify ? '✓' : '✗'} Certify
                </span>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    keyInfo.capabilities.sign
                      ? 'bg-success/10 text-success'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {keyInfo.capabilities.sign ? '✓' : '✗'} Sign
                </span>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    keyInfo.capabilities.encrypt
                      ? 'bg-success/10 text-success'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {keyInfo.capabilities.encrypt ? '✓' : '✗'} Encrypt
                </span>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    keyInfo.capabilities.authenticate
                      ? 'bg-success/10 text-success'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {keyInfo.capabilities.authenticate ? '✓' : '✗'} Authenticate
                </span>
              </dd>
            </div>

            {/* Subkeys */}
            {keyInfo.subkeys.length > 0 && (
              <div>
                <dt className="text-xs font-medium text-secondary uppercase tracking-wide mb-2">
                  Subkeys ({keyInfo.subkeys.length})
                </dt>
                <dd className="space-y-2">
                  {keyInfo.subkeys.map((subkey, i) => (
                    <div
                      key={i}
                      className="bg-gray-50 rounded-lg p-3 text-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs">
                          {subkey.algorithm} - 0x{subkey.keyId.slice(-8)}
                        </span>
                        <div className="flex gap-1">
                          {subkey.capabilities.map((cap) => (
                            <span
                              key={cap}
                              className="px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded"
                            >
                              {cap}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="mt-1 text-xs text-secondary">
                        Created: {formatDate(subkey.created)}
                        {subkey.expirationDate && (
                          <> · Expires: {formatDate(subkey.expirationDate)}</>
                        )}
                      </div>
                    </div>
                  ))}
                </dd>
              </div>
            )}

            {/* Private key warning */}
            {keyInfo.type === 'private' && (
              <div className="mt-4 p-3 bg-warning/10 border border-warning/30 rounded-lg">
                <div className="flex items-start gap-2 text-warning">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="text-sm">
                    <p className="font-medium">This is a private key</p>
                    <p className="mt-0.5 text-warning/80">
                      {keyInfo.isEncrypted
                        ? 'This key is passphrase-protected.'
                        : 'This key is NOT passphrase-protected. Consider adding one for security.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={clearAll}
            className="mt-6 text-sm text-secondary hover:text-primary transition-colors"
          >
            Clear & Inspect Another Key
          </button>
        </div>
      )}
    </div>
  );
}
