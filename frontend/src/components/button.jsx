import React from "react";

const buttonStyles = `
  .secure-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    position: relative;
    border: 1px solid transparent;
    border-radius: 9px;
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease,
      color 0.2s ease,
      box-shadow 0.2s ease,
      transform 0.2s ease;
  }

  .secure-button:focus-visible {
    outline: 2px solid var(--accent, #22d3ee);
    outline-offset: 3px;
  }

  .secure-button:active:not(:disabled) {
    transform: scale(0.98);
  }

  .secure-button:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* Button Variants */

  .secure-button-primary {
    color: #ffffff;
    background: var(--primary, #3b82f6);
    border-color: var(--primary, #3b82f6);
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
  }

  .secure-button-primary:hover:not(:disabled) {
    background: var(--primary-hover, #2563eb);
    border-color: var(--primary-hover, #2563eb);
    box-shadow: 0 4px 14px rgba(59, 130, 246, 0.25);
  }

  .secure-button-secondary {
    color: var(--text-primary, #e5eaf3);
    background: var(--surface, #151e2e);
    border-color: var(--border, #29364a);
  }

  .secure-button-secondary:hover:not(:disabled) {
    background: var(--surface-hover, #1d293b);
    border-color: var(--border-hover, #3d4b62);
  }

  .secure-button-outline {
    color: var(--text-primary, #e5eaf3);
    background: transparent;
    border-color: var(--border, #29364a);
  }

  .secure-button-outline:hover:not(:disabled) {
    color: var(--accent, #22d3ee);
    border-color: var(--accent, #22d3ee);
    background: rgba(34, 211, 238, 0.05);
  }

  .secure-button-ghost {
    color: var(--text-secondary, #a1acc0);
    background: transparent;
    border-color: transparent;
  }

  .secure-button-ghost:hover:not(:disabled) {
    color: var(--text-primary, #e5eaf3);
    background: var(--surface-hover, #1d293b);
  }

  .secure-button-danger {
    color: #ffffff;
    background: #dc2626;
    border-color: #dc2626;
  }

  .secure-button-danger:hover:not(:disabled) {
    background: #b91c1c;
    border-color: #b91c1c;
  }

  .secure-button-success {
    color: #ffffff;
    background: #16a34a;
    border-color: #16a34a;
  }

  .secure-button-success:hover:not(:disabled) {
    background: #15803d;
    border-color: #15803d;
  }

  /* Button Sizes */

  .secure-button-sm {
    min-height: 32px;
    padding: 7px 12px;
    font-size: 12px;
    border-radius: 7px;
  }

  .secure-button-md {
    min-height: 40px;
    padding: 10px 16px;
  }

  .secure-button-lg {
    min-height: 48px;
    padding: 13px 22px;
    font-size: 15px;
  }

  .secure-button-icon {
    width: 40px;
    height: 40px;
    padding: 0;
  }

  .secure-button-full {
    display: flex;
    width: 100%;
  }

  /* Icons */

  .secure-button-icon-wrapper {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .secure-button-icon-wrapper svg {
    width: 17px;
    height: 17px;
  }

  .secure-button-sm .secure-button-icon-wrapper svg {
    width: 14px;
    height: 14px;
  }

  .secure-button-lg .secure-button-icon-wrapper svg {
    width: 19px;
    height: 19px;
  }

  /* Loading State */

  .secure-button-spinner {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: secure-button-spin 0.7s linear infinite;
  }

  @keyframes secure-button-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .secure-button {
      transition: none;
    }

    .secure-button-spinner {
      animation-duration: 2s;
    }
  }
`;

function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  isLoading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = "",
  loadingText,
  onClick,
  ...rest
}) {
  const validVariants = [
    "primary",
    "secondary",
    "outline",
    "ghost",
    "danger",
    "success",
  ];

  const validSizes = ["sm", "md", "lg", "icon"];

  const normalizedVariant = validVariants.includes(variant)
    ? variant
    : "primary";

  const normalizedSize = validSizes.includes(size)
    ? size
    : "md";

  const buttonClasses = [
    "secure-button",
    `secure-button-${normalizedVariant}`,
    `secure-button-${normalizedSize}`,
    fullWidth ? "secure-button-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const isDisabled = disabled || isLoading;

  return (
    <>
      <style>{buttonStyles}</style>

      <button
        type={type}
        className={buttonClasses}
        disabled={isDisabled}
        aria-busy={isLoading}
        onClick={onClick}
        {...rest}
      >
        {isLoading ? (
          <>
            <span
              className="secure-button-spinner"
              aria-hidden="true"
            />

            <span>
              {loadingText || "Please wait..."}
            </span>
          </>
        ) : (
          <>
            {leftIcon && (
              <span className="secure-button-icon-wrapper">
                {leftIcon}
              </span>
            )}

            {children}

            {rightIcon && (
              <span className="secure-button-icon-wrapper">
                {rightIcon}
              </span>
            )}
          </>
        )}
      </button>
    </>
  );
}

export default Button;