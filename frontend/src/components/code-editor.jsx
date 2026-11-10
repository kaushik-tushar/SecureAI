import React, { useMemo, useState } from "react";
import {
  Code2,
  Copy,
  Check,
  FileCode2,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

const styles = `
  .secure-code-editor {
    width: 100%;
    overflow: hidden;
    border: 1px solid var(--border, #243147);
    border-radius: 12px;
    background: #0b1220;
    color: #e2e8f0;
  }

  .code-editor-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border, #243147);
    background: #111a2b;
  }

  .code-editor-file {
    display: flex;
    align-items: center;
    gap: 9px;
    min-width: 0;
  }

  .code-editor-file-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #60a5fa;
    flex-shrink: 0;
  }

  .code-editor-file-info {
    display: flex;
    flex-direction: column;
    min-width: 0;
    gap: 3px;
  }

  .code-editor-file-name {
    color: #e2e8f0;
    font-size: 12px;
    font-weight: 600;
    overflow-wrap: anywhere;
  }

  .code-editor-language {
    color: #8492a8;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .code-editor-toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .code-editor-copy {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 31px;
    padding: 6px 10px;
    border: 1px solid #29364b;
    border-radius: 7px;
    background: #172338;
    color: #aebbd0;
    font-family: inherit;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .code-editor-copy:hover {
    color: #e2e8f0;
    border-color: #4b6a96;
    background: #1b2c46;
  }

  .code-editor-copy:focus-visible,
  .code-editor-tab:focus-visible,
  .code-editor-apply:focus-visible {
    outline: 2px solid #60a5fa;
    outline-offset: 3px;
  }

  .code-editor-tabs {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 9px 14px 0;
    border-bottom: 1px solid #243147;
    background: #0e1727;
  }

  .code-editor-tab {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 9px 12px 11px;
    border: none;
    background: transparent;
    color: #8492a8;
    font-family: inherit;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
  }

  .code-editor-tab:hover {
    color: #dbeafe;
  }

  .code-editor-tab.active {
    color: #93c5fd;
  }

  .code-editor-tab.active::after {
    position: absolute;
    right: 10px;
    bottom: -1px;
    left: 10px;
    height: 2px;
    border-radius: 2px;
    background: #3b82f6;
    content: "";
  }

  .code-editor-tab.suggested.active {
    color: #86efac;
  }

  .code-editor-tab.suggested.active::after {
    background: #22c55e;
  }

  .code-editor-status {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 10px 15px;
    border-bottom: 1px solid #243147;
    background: rgba(239, 68, 68, 0.055);
    color: #fca5a5;
    font-size: 11px;
    line-height: 1.5;
  }

  .code-editor-status.success {
    background: rgba(34, 197, 94, 0.055);
    color: #86efac;
  }

  .code-editor-status svg {
    flex-shrink: 0;
  }

  .code-editor-viewport {
    width: 100%;
    max-height: 480px;
    overflow: auto;
    scrollbar-width: thin;
    scrollbar-color: #34445e #0b1220;
  }

  .code-editor-content {
    display: flex;
    width: max-content;
    min-width: 100%;
    padding: 13px 0;
    font-family: var(--font-mono, "JetBrains Mono", monospace);
    font-size: 12px;
    line-height: 1.8;
  }

  .code-editor-gutter {
    position: sticky;
    left: 0;
    z-index: 1;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    min-width: 52px;
    padding: 0 12px;
    border-right: 1px solid #1d293b;
    background: #0b1220;
    color: #64748b;
    text-align: right;
    user-select: none;
  }

  .code-editor-line-number {
    min-height: 21.6px;
    line-height: 21.6px;
  }

  .code-editor-lines {
    min-width: 100%;
    padding-right: 24px;
  }

  .code-editor-line {
    display: flex;
    min-height: 21.6px;
    padding: 0 15px;
    white-space: pre;
    color: #cbd5e1;
  }

  .code-editor-line.highlighted {
    position: relative;
    background: rgba(239, 68, 68, 0.12);
  }

  .code-editor-line.highlighted::before {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 3px;
    background: #ef4444;
    content: "";
  }

  .code-editor-line.suggested-line {
    background: rgba(34, 197, 94, 0.09);
  }

  .code-editor-line.suggested-line::before {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 3px;
    background: #22c55e;
    content: "";
  }

  .code-editor-line.empty-line {
    color: transparent;
  }

  .code-editor-empty {
    padding: 45px 20px;
    color: #8492a8;
    font-size: 13px;
    text-align: center;
  }

  .code-editor-empty svg {
    margin-bottom: 10px;
    color: #64748b;
  }

  .code-editor-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    padding: 11px 15px;
    border-top: 1px solid #243147;
    background: #111a2b;
  }

  .code-editor-footer-info {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    color: #8492a8;
    font-size: 11px;
  }

  .code-editor-footer-info span {
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }

  .code-editor-apply {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    min-height: 34px;
    padding: 7px 12px;
    border: 1px solid rgba(34, 197, 94, 0.3);
    border-radius: 7px;
    background: rgba(34, 197, 94, 0.1);
    color: #86efac;
    font-family: inherit;
    font-size: 11px;
    font-weight: 650;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .code-editor-apply:hover {
    background: rgba(34, 197, 94, 0.18);
    border-color: rgba(34, 197, 94, 0.55);
  }

  .code-editor-apply:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 600px) {
    .code-editor-header {
      align-items: flex-start;
    }

    .code-editor-toolbar {
      width: 100%;
      justify-content: flex-end;
    }

    .code-editor-content {
      font-size: 11px;
    }

    .code-editor-footer {
      align-items: flex-start;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .code-editor-copy,
    .code-editor-apply {
      transition: none;
    }
  }
`;

function normalizeLines(value) {
  if (typeof value !== "string" || value.length === 0) {
    return [];
  }

  return value.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
}

function CodeEditor({
  code = "",
  suggestedCode = "",
  language = "text",
  filePath = "source-code",
  startLine = 1,
  highlightLines = [],
  suggestedHighlightLines = [],
  showLineNumbers = true,
  showTabs = true,
  showStatus = true,
  onApplyPatch,
  className = "",
}) {
  const [activeTab, setActiveTab] = useState("original");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const hasSuggestion =
    typeof suggestedCode === "string" &&
    suggestedCode.length > 0;

  const originalLines = useMemo(
    () => normalizeLines(code),
    [code]
  );

  const suggestedLines = useMemo(
    () => normalizeLines(suggestedCode),
    [suggestedCode]
  );

  const isSuggestedView =
    activeTab === "suggested" && hasSuggestion;

  const displayedLines = isSuggestedView
    ? suggestedLines
    : originalLines;

  const displayedCode = isSuggestedView
    ? suggestedCode
    : code;

  const currentHighlights = isSuggestedView
    ? suggestedHighlightLines
    : highlightLines;

  const normalizedHighlights = useMemo(() => {
    return new Set(
      (Array.isArray(currentHighlights) ? currentHighlights : [])
        .map(Number)
        .filter((line) => Number.isInteger(line) && line >= 1)
    );
  }, [currentHighlights]);

  const normalizedStartLine =
    Number.isInteger(Number(startLine)) && Number(startLine) >= 1
      ? Number(startLine)
      : 1;

  const wrapperClasses = [
    "secure-code-editor",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleCopy = async () => {
    if (!navigator.clipboard?.writeText) {
      setCopyError(true);
      return;
    }

    try {
      await navigator.clipboard.writeText(displayedCode);
      setCopied(true);
      setCopyError(false);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
      setCopyError(true);
    }
  };

  const handleApplyPatch = () => {
    if (typeof onApplyPatch !== "function" || !hasSuggestion) {
      return;
    }

    onApplyPatch({
      originalCode: code,
      suggestedCode,
      filePath,
      language,
    });
  };

  return (
    <>
      <style>{styles}</style>

      <section
        className={wrapperClasses}
        aria-label={`Code viewer for ${filePath}`}
      >
        <header className="code-editor-header">
          <div className="code-editor-file">
            <div className="code-editor-file-icon">
              <FileCode2 size={18} />
            </div>

            <div className="code-editor-file-info">
              <span className="code-editor-file-name">
                {filePath}
              </span>

              <span className="code-editor-language">
                {language}
              </span>
            </div>
          </div>

          <div className="code-editor-toolbar">
            <button
              type="button"
              className="code-editor-copy"
              onClick={handleCopy}
              title={
                copyError
                  ? "Unable to copy code"
                  : copied
                    ? "Copied"
                    : "Copy displayed code"
              }
            >
              {copied ? (
                <Check size={13} />
              ) : (
                <Copy size={13} />
              )}

              {copyError
                ? "Copy failed"
                : copied
                  ? "Copied"
                  : "Copy code"}
            </button>
          </div>
        </header>

        {showTabs && hasSuggestion && (
          <div
            className="code-editor-tabs"
            role="tablist"
            aria-label="Code versions"
          >
            <button
              type="button"
              role="tab"
              aria-selected={!isSuggestedView}
              className={`code-editor-tab ${
                !isSuggestedView ? "active" : ""
              }`}
              onClick={() => {
                setActiveTab("original");
                setCopied(false);
                setCopyError(false);
              }}
            >
              <Code2 size={14} />
              Original
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={isSuggestedView}
              className={`code-editor-tab suggested ${
                isSuggestedView ? "active" : ""
              }`}
              onClick={() => {
                setActiveTab("suggested");
                setCopied(false);
                setCopyError(false);
              }}
            >
              <Sparkles size={14} />
              AI Suggestion
            </button>
          </div>
        )}

        {showStatus && hasSuggestion && (
          <div
            className={`code-editor-status ${
              isSuggestedView ? "success" : ""
            }`}
          >
            {isSuggestedView ? (
              <>
                <CheckCircle2 size={14} />
                Displaying the suggested remediation. Review it before
                applying.
              </>
            ) : (
              <>
                <AlertTriangle size={14} />
                Original source code. Highlighted lines may contain
                security issues.
              </>
            )}
          </div>
        )}

        <div
          className="code-editor-viewport"
          role="region"
          aria-label="Source code"
          tabIndex={0}
        >
          {displayedLines.length === 0 ? (
            <div className="code-editor-empty">
              <Code2 size={24} />
              <div>No source code available.</div>
            </div>
          ) : (
            <div className="code-editor-content">
              {showLineNumbers && (
                <div
                  className="code-editor-gutter"
                  aria-hidden="true"
                >
                  {displayedLines.map((_, index) => {
                    const lineNumber = normalizedStartLine + index;

                    return (
                      <span
                        className="code-editor-line-number"
                        key={lineNumber}
                      >
                        {lineNumber}
                      </span>
                    );
                  })}
                </div>
              )}

              <div className="code-editor-lines">
                {displayedLines.map((line, index) => {
                  const lineNumber = normalizedStartLine + index;
                  const highlighted =
                    normalizedHighlights.has(lineNumber);

                  return (
                    <div
                      key={lineNumber}
                      className={[
                        "code-editor-line",
                        highlighted
                          ? isSuggestedView
                            ? "suggested-line"
                            : "highlighted"
                          : "",
                        line.length === 0 ? "empty-line" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      aria-label={
                        highlighted
                          ? `Line ${lineNumber}, highlighted`
                          : `Line ${lineNumber}`
                      }
                    >
                      {line || " "}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <footer className="code-editor-footer">
          <div className="code-editor-footer-info">
            <span>
              <Code2 size={13} />
              {displayedLines.length} lines
            </span>

            {normalizedHighlights.size > 0 && (
              <span>
                <AlertTriangle size={13} />
                {normalizedHighlights.size} highlighted
              </span>
            )}
          </div>

          {hasSuggestion && onApplyPatch && (
            <button
              type="button"
              className="code-editor-apply"
              onClick={handleApplyPatch}
            >
              Use Suggested Patch
              <ArrowRight size={14} />
            </button>
          )}
        </footer>
      </section>
    </>
  );
}

export default CodeEditor;