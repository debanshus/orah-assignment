import { useEffect, useRef } from 'react';
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ModalProps {
  message: string;
  onClose: () => void;
}

export default function Modal({ message, onClose }: ModalProps) {
  const isHealthy = message === 'I am healthy!';
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Close when clicking backdrop
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-8 flex flex-col items-center gap-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        {/* Icon */}
        {isHealthy ? (
          <CheckCircleIcon className="h-16 w-16 text-green-500" />
        ) : (
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500" />
        )}

        {/* Message */}
        <p
          id="modal-title"
          className={`text-xl font-semibold text-center ${isHealthy ? 'text-green-700' : 'text-red-700'}`}
        >
          {message}
        </p>

        {/* Dismiss */}
        <button
          onClick={onClose}
          className={`mt-2 px-6 py-2 rounded-lg font-medium text-white transition-colors ${
            isHealthy
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

