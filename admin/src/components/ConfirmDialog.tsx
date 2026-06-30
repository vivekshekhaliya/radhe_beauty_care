import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Yes, Delete',
  cancelText = 'Cancel',
  type = 'danger',
  isLoading = false,
}) => {
  const typeColors = {
    danger: {
      btn: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
      icon: 'text-red-500 bg-red-500/10 border-red-500/20',
    },
    warning: {
      btn: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500',
      icon: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    },
    info: {
      btn: 'bg-primary hover:bg-primary/90 text-black font-semibold focus:ring-primary',
      icon: 'text-primary bg-primary/10 border-primary/20',
    },
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center p-2">
        {/* Warning Icon */}
        <div className={`p-4 rounded-full border mb-4 ${typeColors[type].icon}`}>
          <AlertTriangle className="w-8 h-8" />
        </div>

        {/* Message */}
        <p className="text-sm sm:text-base text-muted font-sans leading-relaxed mb-8">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 w-full mt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 text-white text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition-colors border border-white/5 cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 py-3 px-4 text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition-colors shadow-lg cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 ${typeColors[type].btn}`}
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                <span>Processing...</span>
              </>
            ) : (
              <span>{confirmText}</span>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
