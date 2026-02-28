'use client';

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ErrorStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  showIcon?: boolean;
}

export default function ErrorState({
  title = 'Something went wrong',
  message = 'An error occurred while loading this content. Please try again.',
  actionLabel = 'Try Again',
  onAction,
  showIcon = true,
}: ErrorStateProps) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto max-w-md">
        {showIcon && (
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-400 mb-6" />
        )}
        
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 mb-6">{message}</p>
        
        {onAction && (
          <button
            type="button"
            onClick={onAction}
            className="btn-primary"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}