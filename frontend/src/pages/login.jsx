import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  ArrowRight,

 
  Shield,
  Zap,
  Code2,
  AlertCircle,
  CheckCircle2,
  Globe,
} from "lucide-react";

const loginStyles = `
  .login-page {
    min-height: 100vh;
    min-height: 100dvh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: #080d18;
    color: #e8edf7;
    font-family: var(--font-sans, "DM Sans", sans-serif);
  }

  .login-brand-panel {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100vh;
    min-height: 100dvh;
    padding: 42px 8%;
    overflow: hidden;
    background:
      radial-gradient(
        ellipse at 15% 15%,
        rgba(37, 99, 235, 0.2),
        transparent 45%
      ),
      radial-gradient(
        ellipse at 85% 85%,
        rgba(8, 145, 178, 0.13),
        transparent 45%
      ),
      #0c1424;
    border-right: 1px solid #1d2a40;
  }

  .login-brand-panel::before {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(148, 163, 184, 0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(148, 163, 184, 0.035) 1px, transparent 1px);
    background-size: 42px 42px;
    mask-image: linear-gradient(to bottom, black, transparent 85%);
    content: "";
    pointer-events: none;
  }

  .login-brand-content,
  .login-brand-footer,
  .login-brand-header {
    position: relative;
    z-index: 1;
  }

  .login-brand-header {
    display: flex;
    align-items: center;
    gap: 11px;
  }

  .login-logo {
    width: 43px;
    height: 43px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(96, 165, 250, 0.3);
    border-radius: 12px;
    background: rgba(59, 130, 246, 0.13);
    color: #60a5fa;
  }

  .login-brand-name {
    color: #f1f5f9;
    font-size: 21px;
    font-weight: 750;
    letter-spacing: -0.7px;
  }

  .login-brand-name span {
    color: #60a5fa;
  }

  .login-brand-content {
    max-width: 510px;
    margin: 70px auto;
  }

  .login-brand-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border: 1px solid rgba(96, 165, 250, 0.2);
    border-radius: 30px;
    background: rgba(59, 130, 246, 0.08);
    color: #93c5fd;
    font-size: 11px;
    font-weight: 650;
    letter-spacing: 0.07em;
    text-transform: uppercase;
  }

  .login-brand-label-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
  }

  .login-brand-heading {
    margin: 25px 0 17px;
    color: #f8fafc;
    font-size: clamp(35px, 4vw, 52px);
    font-weight: 750;
    line-height: 1.13;
    letter-spacing: -2px;
  }

  .login-brand-heading span {
    color: #60a5fa;
  }

  .login-brand-description {
    max-width: 440px;
    margin: 0;
    color: #9aa9bf;
    font-size: 15px;
    line-height: 1.8;
  }

  .login-feature-list {
    display: grid;
    gap: 17px;
    margin-top: 42px;
  }

  .login-feature {
    display: flex;
    align-items: center;
    gap: 13px;
  }

  .login-feature-icon {
    width: 37px;
    height: 37px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: 1px solid rgba(96, 165, 250, 0.17);
    border-radius: 10px;
    background: rgba(59, 130, 246, 0.09);
    color: #60a5fa;
  }

  .login-feature-text {
    color: #cbd5e1;
    font-size: 13px;
    font-weight: 550;
  }

  .login-brand-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    color: #64748b;
    font-size: 11px;
  }

  .login-security-indicator {
    display: inline-flex;
    align-items: center;
    gap: 7px;
  }

  .login-security-indicator svg {
    color: #22c55e;
  }

  .login-form-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 45px 8%;
    background: #080d18;
  }

  .login-form-container {
    width: 100%;
    max-width: 410px;
  }

  .login-mobile-brand {
    display: none;
    align-items: center;
    gap: 9px;
    margin-bottom: 42px;
  }

  .login-form-heading {
    margin: 0;
    color: #f1f5f9;
    font-size: 29px;
    font-weight: 750;
    letter-spacing: -1px;
  }

  .login-form-subtitle {
    margin: 9px 0 30px;
    color: #8492a8;
    font-size: 13px;
    line-height: 1.7;
  }

  .login-alert {
    display: flex;
    align-items: flex-start;
    gap: 9px;
    margin-bottom: 20px;
    padding: 12px 13px;
    border: 1px solid rgba(239, 68, 68, 0.25);
    border-radius: 8px;
    background: rgba(239, 68, 68, 0.08);
    color: #fca5a5;
    font-size: 12px;
    line-height: 1.6;
  }

  .login-alert svg {
    flex-shrink: 0;
    margin-top: 1px;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 19px;
  }

  .login-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .login-field-label {
    color: #dbe4f0;
    font-size: 12px;
    font-weight: 650;
  }

  .login-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .login-input-icon {
    position: absolute;
    left: 13px;
    display: flex;
    align-items: center;
    color: #718096;
    pointer-events: none;
  }

  .login-input {
    width: 100%;
    min-height: 46px;
    padding: 0 43px;
    border: 1px solid #29364b;
    border-radius: 8px;
    outline: none;
    background: #101929;
    color: #e8edf7;
    font-family: inherit;
    font-size: 13px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .login-input::placeholder {
    color: #64748b;
  }

  .login-input:hover {
    border-color: #3a4d68;
  }

  .login-input:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
  }

  .login-input.invalid {
    border-color: #ef4444;
  }

  .login-password-toggle {
    position: absolute;
    right: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: #8492a8;
    cursor: pointer;
  }

  .login-password-toggle:hover {
    background: rgba(148, 163, 184, 0.1);
    color: #e2e8f0;
  }

  .login-password-toggle:focus-visible {
    outline: 2px solid #60a5fa;
    outline-offset: 2px;
  }

  .login-field-error {
    color: #fca5a5;
    font-size: 11px;
  }

  .login-form-options {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-top: -3px;
  }

  .login-remember {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #9aa9bf;
    font-size: 12px;
    cursor: pointer;
  }

  .login-checkbox {
    width: 15px;
    height: 15px;
    accent-color: #3b82f6;
    cursor: pointer;
  }

  .login-text-link {
    color: #60a5fa;
    font-size: 12px;
    font-weight: 600;
    text-decoration: none;
  }

  .login-text-link:hover {
    color: #93c5fd;
    text-decoration: underline;
  }

  .login-submit {
    width: 100%;
    min-height: 47px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    margin-top: 3px;
    border: 1px solid #3b82f6;
    border-radius: 8px;
    background: linear-gradient(110deg, #2563eb, #3b82f6);
    color: #ffffff;
    font-family: inherit;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .login-submit:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 7px 22px rgba(37, 99, 235, 0.22);
  }

  .login-submit:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  .login-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.35);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: login-spin 0.7s linear infinite;
  }

  @keyframes login-spin {
    to {
      transform: rotate(360deg);
    }
  }

  .login-divider {
    display: flex;
    align-items: center;
    gap: 13px;
    margin: 25px 0;
    color: #64748b;
    font-size: 11px;
  }

  .login-divider::before,
  .login-divider::after {
    height: 1px;
    flex: 1;
    background: #243147;
    content: "";
  }

  .login-social-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 11px;
  }

  .login-social-button {
    min-height: 43px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 1px solid #29364b;
    border-radius: 8px;
    background: #101929;
    color: #cbd5e1;
    font-family: inherit;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .login-social-button:hover:not(:disabled) {
    border-color: #4b6a96;
    background: #172338;
  }

  .login-social-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .login-register-text {
    margin: 28px 0 0;
    color: #8492a8;
    font-size: 12px;
    text-align: center;
  }

  .login-register-text a {
    color: #60a5fa;
    font-weight: 650;
    text-decoration: none;
  }

  .login-register-text a:hover {
    text-decoration: underline;
  }

  .login-legal {
    margin-top: 30px;
    color: #64748b;
    font-size: 10px;
    line-height: 1.7;
    text-align: center;
  }

  .login-legal a {
    color: #8492a8;
    text-decoration: none;
  }

  .login-legal a:hover {
    color: #60a5fa;
  }

  @media (max-width: 900px) {
    .login-page {
      grid-template-columns: 0.85fr 1.15fr;
    }

    .login-brand-panel {
      padding: 35px 7%;
    }

    .login-brand-heading {
      font-size: 39px;
    }

    .login-form-panel {
      padding: 35px 7%;
    }
  }

  @media (max-width: 680px) {
    .login-page {
      display: block;
    }

    .login-brand-panel {
      display: none;
    }

    .login-form-panel {
      min-height: 100vh;
      min-height: 100dvh;
      padding: 35px 24px;
    }

    .login-form-container {
      max-width: 430px;
    }

    .login-mobile-brand {
      display: flex;
    }

    .login-form-heading {
      font-size: 27px;
    }
  }

  @media (max-width: 380px) {
    .login-form-panel {
      padding: 28px 17px;
    }

    .login-social-buttons {
      grid-template-columns: 1fr;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .login-input,
    .login-submit,
    .login-social-button {
      transition: none;
    }

    .login-spinner {
      animation-duration: 2s;
    }
  }
`;

function Login({
  onLogin,
  onGoogleLogin,
  onGithubLogin,
  loading = false,
  error = "",
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  const validateForm = () => {
    const nextErrors = {};
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      nextErrors.email = "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
    ) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!validateForm()) {
      return;
    }

    if (typeof onLogin !== "function") {
      setFormError(
        "Authentication is not configured yet. Please try again later."
      );
      return;
    }

    try {
      await onLogin({
        email: email.trim().toLowerCase(),
        password,
        rememberMe,
      });
    } catch (submitError) {
      setFormError(
        submitError?.response?.data?.detail ||
        submitError?.message ||
        "Unable to sign in. Please check your credentials and try again."
      );
    }
  };

  const handleSocialLogin = async (callback) => {
    setFormError("");

    if (typeof callback !== "function") {
      setFormError(
        "This sign-in method is not configured yet."
      );
      return;
    }

    try {
      await callback();
    } catch (socialError) {
      setFormError(
        socialError?.message ||
        "Social sign-in failed. Please try again."
      );
    }
  };

  const visibleError = formError || error;

  return (
    <>
      <style>{loginStyles}</style>

      <main className="login-page">
        <section className="login-brand-panel">
          <div className="login-brand-header">
            <div className="login-logo">
              <ShieldCheck size={25} />
            </div>

            <span className="login-brand-name">
              Secure<span>AI</span>
            </span>
          </div>

          <div className="login-brand-content">
            <div className="login-brand-label">
              <span className="login-brand-label-dot" />
              Intelligent Application Security
            </div>

            <h1 className="login-brand-heading">
              Secure your code.
              <br />
              <span>Ship with confidence.</span>
            </h1>

            <p className="login-brand-description">
              Detect vulnerabilities, understand security risks,
              and accelerate remediation with an AI-powered
              application security platform.
            </p>

            <div className="login-feature-list">
              <div className="login-feature">
                <div className="login-feature-icon">
                  <Shield size={18} />
                </div>

                <span className="login-feature-text">
                  Automated vulnerability detection
                </span>
              </div>

              <div className="login-feature">
                <div className="login-feature-icon">
                  <Sparkles size={18} />
                </div>

                <span className="login-feature-text">
                  AI-powered security analysis
                </span>
              </div>

              <div className="login-feature">
                <div className="login-feature-icon">
                  <Code2 size={18} />
                </div>

                <span className="login-feature-text">
                  Intelligent code remediation
                </span>
              </div>

              <div className="login-feature">
                <div className="login-feature-icon">
                  <Zap size={18} />
                </div>

                <span className="login-feature-text">
                  Developer-focused security workflows
                </span>
              </div>
            </div>
          </div>

          <div className="login-brand-footer">
            <span>© {new Date().getFullYear()} SecureAI</span>

            <span className="login-security-indicator">
              <ShieldCheck size={13} />
              Security-first engineering
            </span>
          </div>
        </section>

        <section className="login-form-panel">
          <div className="login-form-container">
            <div className="login-mobile-brand">
              <div className="login-logo">
                <ShieldCheck size={23} />
              </div>

              <span className="login-brand-name">
                Secure<span>AI</span>
              </span>
            </div>

            <h2 className="login-form-heading">
              Welcome back
            </h2>

            <p className="login-form-subtitle">
              Sign in to access your security dashboard.
            </p>

            {visibleError && (
              <div className="login-alert" role="alert">
                <AlertCircle size={16} />
                <span>{visibleError}</span>
              </div>
            )}

            <form
              className="login-form"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="login-field">
                <label
                  className="login-field-label"
                  htmlFor="login-email"
                >
                  Email address
                </label>

                <div className="login-input-wrapper">
                  <span className="login-input-icon">
                    <Mail size={16} />
                  </span>

                  <input
                    id="login-email"
                    className={`login-input ${
                      errors.email ? "invalid" : ""
                    }`}
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);

                      if (errors.email) {
                        setErrors((previous) => ({
                          ...previous,
                          email: "",
                        }));
                      }
                    }}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={
                      errors.email ? "login-email-error" : undefined
                    }
                    required
                  />
                </div>

                {errors.email && (
                  <span
                    className="login-field-error"
                    id="login-email-error"
                  >
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="login-field">
                <label
                  className="login-field-label"
                  htmlFor="login-password"
                >
                  Password
                </label>

                <div className="login-input-wrapper">
                  <span className="login-input-icon">
                    <LockKeyhole size={16} />
                  </span>

                  <input
                    id="login-password"
                    className={`login-input ${
                      errors.password ? "invalid" : ""
                    }`}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);

                      if (errors.password) {
                        setErrors((previous) => ({
                          ...previous,
                          password: "",
                        }));
                      }
                    }}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={
                      errors.password
                        ? "login-password-error"
                        : undefined
                    }
                    required
                  />

                  <button
                    type="button"
                    className="login-password-toggle"
                    onClick={() => setShowPassword((previous) => !previous)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <span
                    className="login-field-error"
                    id="login-password-error"
                  >
                    {errors.password}
                  </span>
                )}
              </div>

              <div className="login-form-options">
                <label className="login-remember">
                  <input
                    className="login-checkbox"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) =>
                      setRememberMe(event.target.checked)
                    }
                  />

                  Remember me
                </label>

                <Link
                  className="login-text-link"
                  to="/forgot-password"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                className="login-submit"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="login-spinner" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="login-divider">
              Or continue with
            </div>

            <div className="login-social-buttons">
              <button
                type="button"
                className="login-social-button"
                onClick={() => handleSocialLogin(onGithubLogin)}
                disabled={loading}
              >
                <Github size={16} />
                GitHub
              </button>

              <button
                type="button"
                className="login-social-button"
                onClick={() => handleSocialLogin(onGoogleLogin)}
                disabled={loading}
              >
                <Chrome size={16} />
                Google
              </button>
            </div>

            <p className="login-register-text">
              Don't have an account?{" "}
              <Link to="/register">
                Create an account
              </Link>
            </p>

            <p className="login-legal">
              By continuing, you acknowledge that you have read
              our{" "}
              <Link to="/terms">Terms of Service</Link>
              {" "}and{" "}
              <Link to="/privacy">Privacy Policy</Link>.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

export default Login;