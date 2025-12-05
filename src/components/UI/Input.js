import React, { useState, forwardRef } from 'react';
import { FaExclamationTriangle, FaCheckCircle, FaEye, FaEyeSlash } from 'react-icons/fa';

const Input = forwardRef(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  success,
  disabled = false,
  required = false,
  icon,
  iconPosition = 'left',
  size = 'md',
  variant = 'default',
  className = '',
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg'
  };

  const variants = {
    default: 'bg-white/10 border-white/20 focus:border-primary-400',
    glass: 'bg-white/5 backdrop-blur-md border-white/10 focus:border-white/30',
    solid: 'bg-white border-gray-300 focus:border-primary-500 text-gray-900 placeholder-gray-500'
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-white">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            w-full ${sizeClasses[size]}
            ${variants[variant]}
            border rounded-xl text-white placeholder-white/50
            focus:outline-none focus:ring-2 focus:ring-primary-400/50
            transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${type === 'password' ? 'pr-10' : ''}
            ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/50' : ''}
            ${success ? 'border-green-400 focus:border-green-400 focus:ring-green-400/50' : ''}
            ${isFocused ? 'scale-[1.02]' : ''}
          `}
          {...props}
        />
        
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
        
        {icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50">
            {icon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-red-400 text-sm flex items-center">
          <FaExclamationTriangle className="mr-1" />
          {error}
        </p>
      )}
      
      {success && (
        <p className="text-green-400 text-sm flex items-center">
          <FaCheckCircle className="mr-1" />
          {success}
        </p>
      )}
    </div>
  );
});

export const TextArea = forwardRef(({
  label,
  placeholder,
  value,
  onChange,
  error,
  success,
  disabled = false,
  required = false,
  rows = 4,
  size = 'md',
  variant = 'default',
  className = '',
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg'
  };

  const variants = {
    default: 'bg-white/10 border-white/20 focus:border-primary-400',
    glass: 'bg-white/5 backdrop-blur-md border-white/10 focus:border-white/30',
    solid: 'bg-white/95 border-gray-200 focus:border-primary-500 text-gray-900'
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-white">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        ref={ref}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        className={`
          w-full ${sizeClasses[size]}
          ${variants[variant]}
          border rounded-xl text-white placeholder-white/50
          focus:outline-none focus:ring-2 focus:ring-blue-400/50
          transition-all duration-300 resize-none
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/50' : ''}
          ${success ? 'border-green-400 focus:border-green-400 focus:ring-green-400/50' : ''}
          ${isFocused ? 'scale-[1.02]' : ''}
        `}
        {...props}
      />
      
      {error && (
        <p className="text-red-400 text-sm flex items-center">
          <FaExclamationTriangle className="mr-1" />
          {error}
        </p>
      )}
      
      {success && (
        <p className="text-green-400 text-sm flex items-center">
          <FaCheckCircle className="mr-1" />
          {success}
        </p>
      )}
    </div>
  );
});

export const Select = forwardRef(({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Seleccionar...',
  error,
  success,
  disabled = false,
  required = false,
  size = 'md',
  variant = 'default',
  className = '',
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg'
  };

  const variants = {
    default: 'bg-white/10 border-white/20 focus:border-primary-400',
    glass: 'bg-white/5 backdrop-blur-md border-white/10 focus:border-white/30',
    solid: 'bg-white/95 border-gray-200 focus:border-primary-500 text-gray-900'
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-white">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <select
        ref={ref}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        required={required}
        className={`
          w-full ${sizeClasses[size]}
          ${variants[variant]}
          border rounded-xl text-white
          focus:outline-none focus:ring-2 focus:ring-blue-400/50
          transition-all duration-300
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/50' : ''}
          ${success ? 'border-green-400 focus:border-green-400 focus:ring-green-400/50' : ''}
          ${isFocused ? 'scale-[1.02]' : ''}
        `}
        {...props}
      >
        <option value="" disabled className="bg-gray-800 text-white">
          {placeholder}
        </option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-gray-800 text-white"
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="text-red-400 text-sm flex items-center">
          <FaExclamationTriangle className="mr-1" />
          {error}
        </p>
      )}
      
      {success && (
        <p className="text-green-400 text-sm flex items-center">
          <FaCheckCircle className="mr-1" />
          {success}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
TextArea.displayName = 'TextArea';
Select.displayName = 'Select';

export default Input;
