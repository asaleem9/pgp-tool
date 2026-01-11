import { useEffect } from 'react';
import { useSign } from '../hooks/useSign';
import { KeyInput } from './KeyInput';
import { MessageInput } from './MessageInput';
import { OutputDisplay } from './OutputDisplay';

export function SignForm() {
  const {
    privateKey,
    passphrase,
    message,
    signedOutput,
    keyInfo,
    error,
    isLoading,
    needsPassphrase,
    detachedSignature,
    setPrivateKey,
    setPassphrase,
    setMessage,
    setDetachedSignature,
    sign,
    clearAll,
    validateKey,
  } = useSign();

  // Clear sensitive data when unmounting
  useEffect(() => {
    return () => {
      clearAll();
    };
  }, [clearAll]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sign();
  };

  const handleKeyBlur = async () => {
    if (privateKey.trim()) {
      await validateKey();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sign a Message</h2>

        {/* Step 1: Private Key */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-medium">
              1
            </span>
            <span className="text-sm font-medium text-gray-700">
              Enter Your Private Key
            </span>
          </div>
          <KeyInput
            id="private-key"
            label=""
            placeholder="-----BEGIN PGP PRIVATE KEY BLOCK-----&#10;&#10;Paste your private key here...&#10;&#10;-----END PGP PRIVATE KEY BLOCK-----"
            value={privateKey}
            onChange={setPrivateKey}
            onBlur={handleKeyBlur}
            keyInfo={keyInfo}
            error={!message && error && error.includes('private key') ? error : null}
            keyType="private"
          />
        </div>

        {/* Step 2: Passphrase (if needed) */}
        {(needsPassphrase || keyInfo?.isEncrypted) && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-medium">
                2
              </span>
              <span className="text-sm font-medium text-gray-700">
                Enter Passphrase
              </span>
            </div>
            <input
              type="password"
              id="passphrase"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
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
              <p className="mt-1 text-sm text-error" role="alert">
                {error}
              </p>
            )}
          </div>
        )}

        {/* Step 3: Message */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-medium">
              {needsPassphrase || keyInfo?.isEncrypted ? '3' : '2'}
            </span>
            <span className="text-sm font-medium text-gray-700">Enter Message to Sign</span>
          </div>
          <MessageInput
            id="message-to-sign"
            label=""
            placeholder="Type the message you want to sign..."
            value={message}
            onChange={setMessage}
            error={error && error.includes('Message') ? error : null}
            rows={6}
          />
        </div>

        {/* Signature Options */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-3">Signature Type</p>
          <div className="space-y-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="signatureType"
                checked={!detachedSignature}
                onChange={() => setDetachedSignature(false)}
                className="mt-1 text-primary focus:ring-primary"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Clear-signed message</span>
                <p className="text-xs text-secondary">
                  Message and signature combined into a single readable document
                </p>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="signatureType"
                checked={detachedSignature}
                onChange={() => setDetachedSignature(true)}
                className="mt-1 text-primary focus:ring-primary"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Detached signature</span>
                <p className="text-xs text-secondary">
                  Signature only, separate from the original message
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* General error */}
        {error && !error.includes('private key') && !error.includes('Message') && !error.includes('passphrase') && (
          <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg">
            <p className="text-sm text-error" role="alert">
              {error}
            </p>
          </div>
        )}

        {/* Sign button */}
        <button
          type="submit"
          disabled={isLoading || !privateKey.trim() || !message.trim()}
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
              Signing...
            </span>
          ) : (
            'Sign Message'
          )}
        </button>
      </div>

      {/* Step 4: Output */}
      {signedOutput && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-success text-white text-sm font-medium">
              {needsPassphrase || keyInfo?.isEncrypted ? '4' : '3'}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {detachedSignature ? 'Detached Signature' : 'Signed Message'}
            </span>
          </div>
          <OutputDisplay
            id="signed-output"
            label=""
            value={signedOutput}
            showDownload
            downloadFilename={detachedSignature ? 'signature.asc' : 'signed-message.asc'}
          />

          <button
            type="button"
            onClick={clearAll}
            className="mt-4 text-sm text-secondary hover:text-primary transition-colors"
          >
            Clear All & Sign Another Message
          </button>
        </div>
      )}
    </form>
  );
}
