'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ValidatedInput = ValidatedInput;
exports.ValidatedTextarea = ValidatedTextarea;
exports.FormValidationSummary = FormValidationSummary;
exports.ValidationStatus = ValidationStatus;
exports.FormField = FormField;
const react_1 = require('react');
const utils_1 = require('@/lib/utils');
const validation_1 = require('@/lib/validation');
const lucide_react_1 = require('lucide-react');
function ValidatedInput({
  validation,
  onValidationChange,
  showValidationOn = 'blur',
  errorClassName,
  successClassName,
  className,
  onBlur,
  onChange,
  value,
  ...props
}) {
  const [validationResult, setValidationResult] = (0, react_1.useState)({
    isValid: true,
    errors: [],
  });
  const [touched, setTouched] = (0, react_1.useState)(false);
  const [shouldShowValidation, setShouldShowValidation] = (0, react_1.useState)(
    false
  );
  const debouncedValidator = (0, react_1.useCallback)(
    (0, validation_1.createDebouncedValidator)(val => {
      if (!validation) return { isValid: true, errors: [] };
      return (0, validation_1.validateField)(val, validation);
    }, 300),
    [validation]
  );
  (0, react_1.useEffect)(() => {
    if (!validation || !shouldShowValidation) return;
    const validate = () => {
      const result = (0, validation_1.validateField)(value, validation);
      setValidationResult(result);
      onValidationChange?.(result);
    };
    if (showValidationOn === 'change' || showValidationOn === 'always') {
      debouncedValidator(value, validate);
    } else {
      validate();
    }
  }, [
    value,
    validation,
    shouldShowValidation,
    showValidationOn,
    debouncedValidator,
    onValidationChange,
  ]);
  const handleBlur = e => {
    setTouched(true);
    if (showValidationOn === 'blur' || showValidationOn === 'always') {
      setShouldShowValidation(true);
    }
    onBlur?.(e);
  };
  const handleChange = e => {
    if (showValidationOn === 'change' || showValidationOn === 'always') {
      setShouldShowValidation(true);
    }
    onChange?.(e);
  };
  const getInputClassName = () => {
    if (!shouldShowValidation || !validation) return className;
    if (validationResult.isValid && touched) {
      return (0, utils_1.cn)(
        'border-green-500 focus:border-green-500 focus:ring-green-500',
        successClassName,
        className
      );
    }
    if (!validationResult.isValid && touched) {
      return (0, utils_1.cn)(
        'border-destructive focus:border-destructive focus:ring-destructive',
        errorClassName,
        className
      );
    }
    return className;
  };
  return (
    <div className="space-y-1">
      <input
        {...props}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className={(0, utils_1.cn)(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
          'ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed',
          'disabled:opacity-50 transition-colors',
          getInputClassName()
        )}
      />

      {shouldShowValidation && validation && (
        <div className="space-y-1">
          {validationResult.errors.map((error, index) => (
            <div
              key={index}
              className="flex items-center space-x-1 text-xs text-destructive"
            >
              <lucide_react_1.AlertTriangle className="h-3 w-3 flex-shrink-0" />
              <span>{error}</span>
            </div>
          ))}
          {validationResult.isValid && touched && (
            <div className="flex items-center space-x-1 text-xs text-green-600">
              <lucide_react_1.CheckCircle className="h-3 w-3 flex-shrink-0" />
              <span>Valid</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
function ValidatedTextarea({
  validation,
  onValidationChange,
  showValidationOn = 'blur',
  errorClassName,
  successClassName,
  className,
  onBlur,
  onChange,
  value,
  ...props
}) {
  const [validationResult, setValidationResult] = (0, react_1.useState)({
    isValid: true,
    errors: [],
  });
  const [touched, setTouched] = (0, react_1.useState)(false);
  const [shouldShowValidation, setShouldShowValidation] = (0, react_1.useState)(
    false
  );
  const debouncedValidator = (0, react_1.useCallback)(
    (0, validation_1.createDebouncedValidator)(val => {
      if (!validation) return { isValid: true, errors: [] };
      return (0, validation_1.validateField)(val, validation);
    }, 300),
    [validation]
  );
  (0, react_1.useEffect)(() => {
    if (!validation || !shouldShowValidation) return;
    const validate = () => {
      const result = (0, validation_1.validateField)(value, validation);
      setValidationResult(result);
      onValidationChange?.(result);
    };
    if (showValidationOn === 'change' || showValidationOn === 'always') {
      debouncedValidator(value, validate);
    } else {
      validate();
    }
  }, [
    value,
    validation,
    shouldShowValidation,
    showValidationOn,
    debouncedValidator,
    onValidationChange,
  ]);
  const handleBlur = e => {
    setTouched(true);
    if (showValidationOn === 'blur' || showValidationOn === 'always') {
      setShouldShowValidation(true);
    }
    onBlur?.(e);
  };
  const handleChange = e => {
    if (showValidationOn === 'change' || showValidationOn === 'always') {
      setShouldShowValidation(true);
    }
    onChange?.(e);
  };
  const getTextareaClassName = () => {
    if (!shouldShowValidation || !validation) return className;
    if (validationResult.isValid && touched) {
      return (0, utils_1.cn)(
        'border-green-500 focus:border-green-500 focus:ring-green-500',
        successClassName,
        className
      );
    }
    if (!validationResult.isValid && touched) {
      return (0, utils_1.cn)(
        'border-destructive focus:border-destructive focus:ring-destructive',
        errorClassName,
        className
      );
    }
    return className;
  };
  return (
    <div className="space-y-1">
      <textarea
        {...props}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className={(0, utils_1.cn)(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
          'ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
          getTextareaClassName()
        )}
      />

      {shouldShowValidation && validation && (
        <div className="space-y-1">
          {validationResult.errors.map((error, index) => (
            <div
              key={index}
              className="flex items-center space-x-1 text-xs text-destructive"
            >
              <lucide_react_1.AlertTriangle className="h-3 w-3 flex-shrink-0" />
              <span>{error}</span>
            </div>
          ))}
          {validationResult.isValid && touched && (
            <div className="flex items-center space-x-1 text-xs text-green-600">
              <lucide_react_1.CheckCircle className="h-3 w-3 flex-shrink-0" />
              <span>Valid</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
function FormValidationSummary({ errors, className }) {
  const allErrors = Object.values(errors).flat();
  if (allErrors.length === 0) return null;
  return (
    <div
      className={(0, utils_1.cn)(
        'glass-card border-destructive/20 bg-destructive/5 p-4',
        className
      )}
    >
      <div className="flex items-start space-x-3">
        <lucide_react_1.AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-medium text-destructive mb-2">
            Please fix the following errors:
          </h4>
          <ul className="space-y-1">
            {allErrors.map((error, index) => (
              <li key={index} className="text-sm text-destructive">
                • {error}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
function ValidationStatus({ isValid, isTouched, errors, className }) {
  if (!isTouched) return null;
  if (isValid) {
    return (
      <div
        className={(0, utils_1.cn)(
          'flex items-center space-x-1 text-xs text-green-600',
          className
        )}
      >
        <lucide_react_1.CheckCircle className="h-3 w-3" />
        <span>Valid</span>
      </div>
    );
  }
  return (
    <div className={(0, utils_1.cn)('space-y-1', className)}>
      {errors.map((error, index) => (
        <div
          key={index}
          className="flex items-center space-x-1 text-xs text-destructive"
        >
          <lucide_react_1.AlertTriangle className="h-3 w-3 flex-shrink-0" />
          <span>{error}</span>
        </div>
      ))}
    </div>
  );
}
function FormField({
  label,
  required = false,
  description,
  error,
  children,
  className,
}) {
  return (
    <div className={(0, utils_1.cn)('space-y-2', className)}>
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>

      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      {children}

      {error && (
        <div className="flex items-center space-x-1 text-xs text-destructive">
          <lucide_react_1.AlertTriangle className="h-3 w-3 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
