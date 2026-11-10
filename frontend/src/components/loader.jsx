import React from "react";

const loaderStyles = `
  .loader-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: var(--text-secondary, #a1acc0);
    font-family: inherit;
  }

  .loader-inline {
    width: 100%;
    min-height: 80px;
  }

  .loader-fullscreen {
    position: fixed;
    inset: 0;
    z-index: 9999;
    min-height: 100vh;
    min-height: 100dvh;
    flex-direction: column;
    gap: 16px;
    background: var(--background, #080d18);
  }

  .loader-spinner {
    flex-shrink: 0;
    border: 3px solid rgba(96, 165, 250, 0.15);
    border-top-color: var(--primary, #3b82f6);
    border-right-color: var(--accent, #22d3ee);
    border-radius: 50%;
    animation: secureai-spin 0.8s linear infinite;
  }

  .loader-small {
    width: 18px;
    height: 18px;
    border-width: 2px;
  }

  .loader-medium {
    width: 36px;
    height: 36px;
    border-width: 3px;
  }

  .loader-large {
    width: 52px;
    height: 52px;
    border-width: 4px;
  }

  .loader-text {
    color: var(--text-secondary, #a1acc0);
    font-size: 14px;
    font-weight: 500;
    line-height: 1.5;
    letter-spacing: 0.01em;
  }

  .loader-fullscreen .loader-text {
    font-size: 15px;
  }

  @keyframes secureai-spin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .loader-spinner {
      animation-duration: 2s;
    }
  }

  @media (max-width: 480px) {
    .loader-fullscreen {
      padding: 20px;
    }

    .loader-text {
      font-size: 13px;
    }
  }
`;

function Loader({
  size = "medium",
  text = "Loading...",
  fullScreen = false,
  className = "",
}) {
  const validSizes = ["small", "medium", "large"];

  const normalizedSize = validSizes.includes(size)
    ? size
    : "medium";

  const containerClasses = [
    "loader-container",
    fullScreen ? "loader-fullscreen" : "loader-inline",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <style>{loaderStyles}</style>

      <div
        className={containerClasses}
        role="status"
        aria-live="polite"
        aria-label={text || "Loading"}
      >
        <div
          className={`loader-spinner loader-${normalizedSize}`}
          aria-hidden="true"
        />

        {text && (
          <span className="loader-text">
            {text}
          </span>
        )}
      </div>
    </>
  );
}

export default Loader;