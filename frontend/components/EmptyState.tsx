'use client';

import Image from 'next/image';
import { PlusIcon } from '@heroicons/react/24/outline';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ElementType;
  imageSrc?: string;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon,
  imageSrc,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto max-w-md">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt="Empty state"
            width={200}
            height={200}
            className="mx-auto mb-6"
          />
        ) : Icon ? (
          <Icon className="mx-auto h-12 w-12 text-gray-400 mb-6" />
        ) : (
          <div className="mx-auto h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
            <span className="text-2xl text-gray-400">📋</span>
          </div>
        )}
        
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 mb-6">{description}</p>
        
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="btn-primary inline-flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-2" aria-hidden="true" />
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}