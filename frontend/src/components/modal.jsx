import React, {
  useEffect,
  useId,
  useRef,
} from "react";

const modalStyles = `
  .secure-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: rgba(3, 7, 18, 0.75);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    animation: secure-modal-fade-in 0.2s ease;
  }

  .secure-modal {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-height: min(85vh, 850px);
    overflow: hidden;
    background: var(--surface, #111827);
    border: 1px solid var(--border, #29364a);
    border-radius: 14px;
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
    animation: secure-modal-slide-in 0.25s ease;
  }

  /* Modal Sizes */

  .secure-modal-sm {
    max-width: 400px;
  }

  .secure-modal-md {
    max-width: 560px;
  }

  .secure-modal-lg {
    max-width: 760px;
  }

  .secure-modal-xl {
    max-width: 1000px;
  }

  /* Header */

  .secure-modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border, #29364a);
  }

  .secure-modal-heading {
    min-width: 0;
  }

  .secure-modal-title {
    margin: 0;
    color: var(--text-primary, #e5eaf3);
    font-size: 18px;
    font-weight: 650;
    line-height: 1.4;
  }

  .secure-modal-description {
    margin: 6px 0 0;
    color: var(--text-secondary, #a1acc0);
    font-size: 13px;
    line-height: 1.6;
  }

  .secure-modal-close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 34px;
    height: 34px;
    padding: 0;
    color: var(--text-secondary, #a1acc0);
    background: transparent;
    border: 1px solid transparent;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .secure-modal-close:hover {
    color: var(--text-primary, #e5eaf3);
    background: var(--surface-hover, #1d293b);
    border-color: var(--border, #29364a);
  }

  .secure-modal-close:focus-visible {
    outline: 2px solid var(--accent, #22d3ee);
    outline-offset: 2px;
  }

  .secure-modal-close svg {
    width: 18px;
    height: 18px;
  }

  /* Body */

  .secure-modal-body {
    flex: 1;
    min-height: 0;
    padding: 24px;
    overflow-y: auto;
    color: var(--text-primary, #e5eaf3);
    scrollbar-width: thin;
    scrollbar-color: #35445b transparent;
  }

  .secure-modal-body::-webkit-scrollbar {
    width: 6px;
  }

  .secure-modal-body::-webkit-scrollbar-thumb {
    background: #35445b;
    border-radius: 10px;
  }

  /* Footer */

  .secure-modal-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    padding: 16px 24px;
    border-top: 1px solid var(--border, #29364a);
  }

  /* Animations */

  @keyframes secure-modal-fade-in {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes secure-modal-slide-in {
    from {
      opacity: 0;
      transform: translateY(12px) scale(0.98);
    }

    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  /* Responsive */

  @media (max-width: 600px) {
    .secure-modal-overlay {
      align-items: flex-end;
      padding: 12px;
    }

    .secure-modal {
      max-height: 90vh;
      border-radius: 14px;
    }

    .secure-modal-header {
      padding: 18px;
    }

    .secure-modal-body {
      padding: 18px;
    }

    .secure-modal-footer {
      padding: 14px 18px;
    }

    .secure-modal-title {
      font-size: 16px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .secure-modal-overlay,
    .secure-modal {
      animation: none;
    }

    .secure-modal-close {
      transition: none;
    }
  }
`;

function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = "",
}) {
  const generatedId = useId();
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  const validSizes = ["sm", "md", "lg", "xl"];

  const normalizedSize = validSizes.includes(size)
    ? size
    : "md";

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    previousFocusRef.current = document.activeElement;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const modalElement = modalRef.current;

    const focusableSelector = [
      "button:not([disabled])",
      "a[href]",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "[tabindex]:not([tabindex='-1'])",
    ].join(",");

    const getFocusableElements = () => {
      if (!modalElement) {
        return [];
      }

      return Array.from(
        modalElement.querySelectorAll(focusableSelector)
      ).filter((element) => {
        return element.getClientRects().length > 0;
      });
    };

    const initialFocusableElement = getFocusableElements()[0];

    if (initialFocusableElement) {
      initialFocusableElement.focus();
    } else {
      modalElement?.focus();
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && closeOnEscape) {
        event.preventDefault();
        onClose?.();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = getFocusableElements();

      if (focusableElements.length === 0) {
        event.preventDefault();
        modalElement?.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement =
        focusableElements[focusableElements.length - 1];

      if (
        event.shiftKey &&
        document.activeElement === firstElement
      ) {
        event.preventDefault();
        lastElement.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === lastElement
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;

      document.removeEventListener("keydown", handleKeyDown);

      if (previousFocusRef.current?.isConnected) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, onClose, closeOnEscape]);

  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (event) => {
    if (
      closeOnBackdrop &&
      event.target === event.currentTarget
    ) {
      onClose?.();
    }
  };

  const titleId = `${generatedId}-title`;
  const descriptionId = `${generatedId}-description`;

  return (
    <>
      <style>{modalStyles}</style>

      <div
        className="secure-modal-overlay"
        onMouseDown={handleBackdropClick}
      >
        <section
          ref={modalRef}
          className={[
            "secure-modal",
            `secure-modal-${normalizedSize}`,
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={
            description ? descriptionId : undefined
          }
          tabIndex={-1}
        >
          {(title || description || showCloseButton) && (
            <header className="secure-modal-header">
              <div className="secure-modal-heading">
                {title && (
                  <h2
                    id={titleId}
                    className="secure-modal-title"
                  >
                    {title}
                  </h2>
                )}

                {description && (
                  <p
                    id={descriptionId}
                    className="secure-modal-description"
                  >
                    {description}
                  </p>
                )}
              </div>

              {showCloseButton && (
                <button
                  type="button"
                  className="secure-modal-close"
                  onClick={onClose}
                  aria-label="Close dialog"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              )}
            </header>
          )}

          <div className="secure-modal-body">
            {children}
          </div>

          {footer && (
            <footer className="secure-modal-footer">
              {footer}
            </footer>
          )}
        </section>
      </div>
    </>
  );
}

export default Modal;