import { useEffect } from 'react';
import { useDecrypt } from '../hooks/useDecrypt';
import { KeyInput } from './KeyInput';
import { MessageInput } from './MessageInput';
import { OutputDisplay } from './OutputDisplay';

export function DecryptForm() {
  const {
    privateKey,
    passphrase,
    encryptedMessage,
    decryptedOutput,
    keyInfo,
    error,
    isLoading,
    needsPassphrase,
    setPrivateKey,
    setPassphrase,
    setEncryptedMessage,
    decrypt,
    clearAll,
    validateKey,
  } = useDecrypt();

  // Clear sensitive data when unmounting
  useEffect(() => {
    return () => {
      clearAll();
    };
  }, [clearAll]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await decrypt();
  };

  const handleKeyBlur = async () => {
    if (privateKey.trim()) {
      await validateKey();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Decrypt a Message</h2>

        {/* Step 1: Private Key */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-medium">
              1
            </span>
            <span className="text-sm font-medium text-gray-700">Enter Your Private Key</span>
          </div>
          <KeyInput
            id="private-key"
            label=""
            placeholder="-----BEGIN PGP PRIVATE KEY BLOCK-----&#10;&#10;Paste your private key here...&#10;&#10;-----END PGP PRIVATE KEY BLOCK-----"
            value={privateKey}
            onChange={setPrivateKey}
            onBlur={handleKeyBlur}
            keyInfo={keyInfo}
            error={error && error.includes('private key') ? error : null}
            keyType="private"
          />
        </div>

        {/* Step 2: Passphrase (conditional) */}
        {(needsPassphrase || (keyInfo && keyInfo.isEncrypted)) && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-medium">
                2
              </span>
              <span className="text-sm font-medium text-gray-700">
                Enter Passphrase (key is protected)
              </span>
            </div>
            <div className="space-y-2">
              <input
                type="password"
                id="passphrase"
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  error && error.includes('passphrase')
                    ? 'border-error focus:ring-error/20 focus:border-error'
                    : 'border-gray-300 focus:ring-primary/20 focus:border-primary'
                }`}
                placeholder="Enter your passphrase"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                autoComplete="current-password"
              />
              {error && error.includes('passphrase') && (
                <p className="text-sm text-error" role="alert">
                  {error}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Encrypted Message */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-medium">
              {needsPassphrase || (keyInfo && keyInfo.isEncrypted) ? '3' : '2'}
            </span>
            <span className="text-sm font-medium text-gray-700">Paste Encrypted Message</span>
          </div>
          <MessageInput
            id="encrypted-message"
            label=""
            placeholder="-----BEGIN PGP MESSAGE-----&#10;&#10;Paste the encrypted message here...&#10;&#10;-----END PGP MESSAGE-----"
            value={encryptedMessage}
            onChange={setEncryptedMessage}
            error={error && error.includes('PGP message') ? error : null}
            rows={8}
            allowFileUpload
          />
        </div>

        {/* General error */}
        {error &&
          !error.includes('private key') &&
          !error.includes('passphrase') &&
          !error.includes('PGP message') && (
            <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg">
              <p className="text-sm text-error" role="alert">
                {error}
              </p>
            </div>
          )}

        {/* Decrypt button */}
        <button
          type="submit"
          disabled={isLoading || !privateKey.trim() || !encryptedMessage.trim()}
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
              Decrypting...
            </span>
          ) : (
            'Decrypt Message'
          )}
        </button>
      </div>

      {/* Step 4: Output */}
      {decryptedOutput && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-success text-white text-sm font-medium">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </span>
            <span className="text-sm font-medium text-gray-700">Decrypted Message</span>
          </div>
          <OutputDisplay
            id="decrypted-output"
            label=""
            value={decryptedOutput}
            showDownload={false}
            monospace={false}
          />

          <button
            type="button"
            onClick={clearAll}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-error border border-error/30 rounded-lg hover:bg-error/10 focus:outline-none focus:ring-2 focus:ring-error/50 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Clear All (Secure Wipe)
          </button>
        </div>
      )}
    </form>
  );
}
