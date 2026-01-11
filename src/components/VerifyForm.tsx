import { useEffect } from 'react';
import { useVerify } from '../hooks/useVerify';
import { KeyInput } from './KeyInput';
import { DropZone } from './DropZone';

export function VerifyForm() {
  const {
    publicKey,
    signedMessage,
    result,
    keyInfo,
    error,
    isLoading,
    setPublicKey,
    setSignedMessage,
    verify,
    clearAll,
    validateKey,
  } = useVerify();

  // Clear sensitive data when unmounting
  useEffect(() => {
    return () => {
      clearAll();
    };
  }, [clearAll]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await verify();
  };

  const handleKeyBlur = async () => {
    if (publicKey.trim()) {
      await validateKey();
    }
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Verify a Signature</h2>

        {/* Step 1: Public Key */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-medium">
              1
            </span>
            <span className="text-sm font-medium text-gray-700">
              Enter Signer's Public Key
            </span>
          </div>
          <KeyInput
            id="verify-public-key"
            label=""
            placeholder="-----BEGIN PGP PUBLIC KEY BLOCK-----&#10;&#10;Paste the signer's public key here...&#10;&#10;-----END PGP PUBLIC KEY BLOCK-----"
            value={publicKey}
            onChange={setPublicKey}
            onBlur={handleKeyBlur}
            keyInfo={keyInfo}
            error={!signedMessage && error && error.includes('public key') ? error : null}
            keyType="public"
          />
        </div>

        {/* Step 2: Signed Message */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-medium">
              2
            </span>
            <span className="text-sm font-medium text-gray-700">Paste Signed Message</span>
          </div>
          <DropZone onDrop={setSignedMessage} hint="Drop signed message file">
            <textarea
              id="signed-message-input"
              className={`w-full h-40 px-3 py-2 font-mono text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 transition-colors ${
                error && error.includes('message')
                  ? 'border-error focus:ring-error/20 focus:border-error'
                  : 'border-gray-300 focus:ring-primary/20 focus:border-primary'
              }`}
              placeholder="-----BEGIN PGP SIGNED MESSAGE-----&#10;Hash: SHA256&#10;&#10;Your signed message here...&#10;-----BEGIN PGP SIGNATURE-----&#10;...&#10;-----END PGP SIGNATURE-----"
              value={signedMessage}
              onChange={(e) => setSignedMessage(e.target.value)}
              spellCheck={false}
            />
          </DropZone>
          {error && error.includes('message') && (
            <p className="mt-1 text-sm text-error" role="alert">
              {error}
            </p>
          )}
        </div>

        {/* General error */}
        {error && !error.includes('public key') && !error.includes('message') && (
          <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg">
            <p className="text-sm text-error" role="alert">
              {error}
            </p>
          </div>
        )}

        {/* Verify button */}
        <button
          type="submit"
          disabled={isLoading || !publicKey.trim() || !signedMessage.trim()}
          className="w-full py-3 px-4 bg-primary text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Verifying...
            </span>
          ) : (
            'Verify Signature'
          )}
        </button>
      </div>

      {/* Verification Result */}
      {result && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-success text-white text-sm font-medium">
              3
            </span>
            <span className="text-sm font-medium text-gray-700">Verification Result</span>
          </div>

          {result.valid ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-success/10 border border-success/20 rounded-lg">
                <svg
                  className="w-8 h-8 text-success flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-success">Valid Signature</p>
                  <p className="text-sm text-success/80">
                    This message was signed by the provided key and has not been modified.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {result.signedBy && (
                  <div>
                    <dt className="text-xs font-medium text-secondary uppercase tracking-wide">
                      Signed By
                    </dt>
                    <dd className="mt-1 text-gray-900">{result.signedBy}</dd>
                  </div>
                )}
                {result.signedAt && (
                  <div>
                    <dt className="text-xs font-medium text-secondary uppercase tracking-wide">
                      Signed On
                    </dt>
                    <dd className="mt-1 text-gray-900">{formatDate(result.signedAt)}</dd>
                  </div>
                )}
              </div>

              {result.message && (
                <div>
                  <dt className="text-xs font-medium text-secondary uppercase tracking-wide mb-2">
                    Original Message
                  </dt>
                  <dd className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <pre className="whitespace-pre-wrap text-sm text-gray-900 font-mono">
                      {result.message}
                    </pre>
                  </dd>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-error/10 border border-error/20 rounded-lg">
              <svg
                className="w-8 h-8 text-error flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="font-semibold text-error">Invalid Signature</p>
                <p className="text-sm text-error/80">
                  {result.error || 'The signature could not be verified. The message may have been tampered with or signed by a different key.'}
                </p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={clearAll}
            className="mt-4 text-sm text-secondary hover:text-primary transition-colors"
          >
            Clear All & Verify Another
          </button>
        </div>
      )}
    </form>
  );
}
