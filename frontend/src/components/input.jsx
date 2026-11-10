import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function Input({
  label,
  name,
  type = "text",
  placeholder = "",
  value,
  defaultValue,
  onChange,
  onBlur,
  error,
  helperText,
  leftIcon,
  rightIcon,
  required = false,
  disabled = false,
  readOnly = false,
  autoComplete,
  className = "",
  inputClassName = "",
  wrapperClassName = "",
  id,
  ...props
}) {
  const generatedId = useId();
  const inputId = id || name || generatedId;

  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const hasError = Boolean(error);

  const describedBy = [
    hasError ? errorId : null,
    helperText ? helperId : null,
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <div className={`flex w-full flex-col gap-1.5 ${wrapperClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-text-primary"
        >
          {label}

          {required && (
            <span className="ml-1 text-danger" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div
        className={`
          relative flex h-11 w-full items-center
          rounded-lg border bg-surface
          transition-all duration-200
          ${
            hasError
              ? "border-danger/70 focus-within:border-danger focus-within:ring-2 focus-within:ring-danger/10"
              : "border-border hover:border-slate-600 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15"
          }
          ${disabled ? "cursor-not-allowed opacity-50" : ""}
          ${className}
        `}
      >
        {leftIcon && (
          <span
            className="ml-3 flex shrink-0 items-center text-text-muted"
            aria-hidden="true"
          >
            {leftIcon}
          </span>
        )}

        <input
          id={inputId}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          autoComplete={autoComplete}
          aria-invalid={hasError}
          aria-describedby={describedBy}
          className={`
            h-full min-w-0 flex-1 bg-transparent
            px-3 text-sm text-text-primary
            placeholder:text-text-muted
            outline-none
            disabled:cursor-not-allowed
            read-only:cursor-default
            ${leftIcon ? "pl-2" : ""}
            ${rightIcon || isPassword ? "pr-2" : ""}
            ${inputClassName}
          `}
          {...props}
        />

        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword((previous) => !previous)}
            disabled={disabled}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="
              mr-3 flex shrink-0 items-center justify-center
              text-text-muted transition-colors
              hover:text-text-primary
              focus-visible:rounded focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-accent
              disabled:cursor-not-allowed
            "
          >
            {showPassword ? (
              <EyeOff size={17} />
            ) : (
              <Eye size={17} />
            )}
          </button>
        ) : (
          rightIcon && (
            <span
              className="mr-3 flex shrink-0 items-center text-text-muted"
              aria-hidden="true"
            >
              {rightIcon}
            </span>
          )
        )}
      </div>

      {hasError && (
        <p
          id={errorId}
          role="alert"
          className="text-xs font-medium text-danger"
        >
          {error}
        </p>
      )}

      {!hasError && helperText && (
        <p
          id={helperId}
          className="text-xs text-text-muted"
        >
          {helperText}
        </p>
      )}
    </div>
  );
}

export default Input;