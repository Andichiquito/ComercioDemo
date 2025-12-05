import React, { useState, useEffect, useCallback } from 'react';
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const Toast = ({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose, 
  position = 'top-right' 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  const handleClose = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, handleClose]);

  if (!isVisible) return null;

  const typeConfig = {
    success: {
      icon: FaCheckCircle,
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-400/30',
      textColor: 'text-green-200',
      iconColor: 'text-green-400'
    },
    error: {
      icon: FaTimesCircle,
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-400/30',
      textColor: 'text-red-200',
      iconColor: 'text-red-400'
    },
    warning: {
      icon: FaExclamationTriangle,
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-400/30',
      textColor: 'text-yellow-200',
      iconColor: 'text-yellow-400'
    },
    info: {
      icon: FaInfoCircle,
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-400/30',
      textColor: 'text-blue-200',
      iconColor: 'text-blue-400'
    }
  };

  const config = typeConfig[type];

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  };

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 max-w-sm w-full mx-4`}
    >
      <div
        className={`
          ${config.bgColor} ${config.borderColor} ${config.textColor}
          backdrop-blur-md border rounded-xl p-4 shadow-lg
          transform transition-all duration-300 ease-out
          ${isLeaving ? 'translate-x-full opacity-0 scale-95' : 'translate-x-0 opacity-100 scale-100'}
        `}
      >
        <div className="flex items-start space-x-3">
          <span className={`text-lg ${config.iconColor} flex-shrink-0`}>
            <config.icon />
          </span>
          <div className="flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 text-white/50 hover:text-white transition-colors"
          >
            <FaTimes />
          </button>
        </div>
      </div>
    </div>
  );
};

export const ToastContainer = ({ toasts, onRemove }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          position={toast.position}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
};

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 5000, position = 'top-right') => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration, position };
    
    setToasts(prev => [...prev, newToast]);
    
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const success = (message, duration, position) => 
    addToast(message, 'success', duration, position);
  
  const error = (message, duration, position) => 
    addToast(message, 'error', duration, position);
  
  const warning = (message, duration, position) => 
    addToast(message, 'warning', duration, position);
  
  const info = (message, duration, position) => 
    addToast(message, 'info', duration, position);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  };
};

export default Toast;
