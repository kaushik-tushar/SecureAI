import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  User,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  Code2,

  AlertCircle,
  CheckCircle2,
  XCircle,
  Shield,
  Sparkles,
  Globe,
} from "lucide-react";

const registerStyles = `
  .register-page {
    min-height: 100vh;
    min-height: 100dvh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: #080d18;
    color: #e8edf7;
    font-family: var(--font-sans, "DM Sans", sans-serif);
  }

  .register-brand-panel {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100vh;
    min-height: 100dvh;
    padding: 42px 8%;
    overflow: hidden;
    border-right: 1px solid #1d2a40;
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
  }

  .register-brand-panel::before {
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

  .register-brand-header,
  .register-brand-content,
  .register-brand-footer {
    position: relative;
    z-index: 1;
  }

  .register-brand-header {
    display: flex;
    align-items: center;
    gap: 11px;
  }

  .register-logo {
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

  .register-brand-name {
    color: #f1f5f9;
    font-size: 21px;
    font-weight: 750;
    letter-spacing: -0.7px;
  }

  .register-brand-name span {
    color: #60a5fa;
  }

  .register-brand-content {
    max-width: 510px;
    margin: 70px auto;
  }

  .register-brand-label {
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

  .register-brand-heading {
    margin: 25px 0 17px;
    color: #f8fafc;
    font-size: clamp(35px, 4vw, 52px);
    font-weight: 750;
    line-height: 1.13;
    letter-spacing: -2px;
  }

  .register-brand-heading span {
    color: #60a5fa;
  }

  .register-brand-description {
    max-width: 440px;
    margin: 0;
    color: #9aa9bf;
    font-size: 15px;
    line-height: 1.8;
  }

  .register-benefits {
    display: grid;
    gap: 19px;
    margin-top: 42px;
  }

  .register-benefit {
    display: flex;
    align-items: center;
    gap: 13px;
  }

  .register-benefit-icon {
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: 1px solid rgba(96, 165, 250, 0.17);
    border-radius: 10px;
    background: rgba(59, 130, 246, 0.09);
    color: #60a5fa;
  }

  .register-benefit-text {
    color: #cbd5e1;
    font-size: 13px;
    font-weight: 550;
  }

  .register-brand-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    color: #64748b;
    font-size: 11px;
  }

  .register-form-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 8%;
    background: #080d18;
  }

  .register-form-container {
    width: 100%;
    max-width: 420px;
  }

  .register-mobile-brand {
    display: none;
    align-items: center;
    gap: 9px;
    margin-bottom: 32px;
  }

  .register-heading {
    margin: 0;
    color: #f1f5f9;
    font-size: 28px;
    font-weight: 750;
    letter-spacing: -1px;
  }

  .register-subtitle {
    margin: 8px 0 25px;
    color: #8492a8;
    font-size: 13px;
    line-height: 1.7;
  }

  .register-alert {
    display: flex;
    align-items: flex-start;
    gap: 9px;
    margin-bottom: 18px;
    padding: 12px 13px;
    border: 1px solid rgba(239, 68, 68, 0.25);
    border-radius: 8px;
    background: rgba(239, 68, 68, 0.08);
    color: #fca5a5;
    font-size: 12px;
    line-height: 1.6;
  }

  .register-alert svg {
    flex-shrink: 0;
    margin-top: 1px;
  }

  .register-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .register-field {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .register-label {
    color: #dbe4f0;
    font-size: 12px;
    font-weight: 650;
  }

  .register-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .register-input-icon {
    position: absolute;
    left: 13px;
    display: flex;
    align-items: center;
    color: #718096;
    pointer-events: none;
  }

  .register-input {
    width: 100%;
    min-height: 44px;
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

  .register-input::placeholder {
    color: #64748b;
  }

  .register-input:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
  }

  .register-input.invalid {
    border-color: #ef4444;
  }

  .register-password-toggle {
    position: absolute;
    right: 10px;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: #8492a8;
    cursor: pointer;
  }

  .register-password-toggle:hover {
    background: rgba(148, 163, 184, 0.1);
    color: #e2e8f0;
  }

  .register-password-toggle:focus-visible {
    outline: 2px solid #60a5fa;
    outline-offset: 2px;
  }

  .register-field-error {
    color: #fca5a5;
    font-size: 11px;
  }

  .register-strength {
    display: flex;
    flex-direction: column;
    gap: 7px;
    margin-top: 3px;
  }

  .register-strength-bars {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 5px;
  }

  .register-strength-bar {
    height: 4px;
    border-radius: 5px;
    background: #29364b;
    transition: background 0.2s ease;
  }

  .register-strength-bar.active.weak {
    background: #ef4444;
  }

  .register-strength-bar.active.fair {
    background: #f59e0b;
  }

  .register-strength-bar.active.good {
    background: #3b82f6;
  }

  .register-strength-bar.active.strong {
    background: #22c55e;
  }

  .register-strength-label {
    color: #8492a8;
    font-size: 10px;
  }

  .register-requirements {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 7px;
    margin-top: 4px;
  }

  .register-requirement {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #718096;
    font-size: 10px;
  }

  .register-requirement.met {
    color: #86efac;
  }

  .register-requirement svg {
    flex-shrink: 0;
  }

  .register-terms {
    display: flex;
    align-items: flex-start;
    gap: 9px;
    margin-top: 2px;
    color: #9aa9bf;
    font-size: 11px;
    line-height: 1.6;
    cursor: pointer;
  }

  .register-terms input {
    width: 15px;
    height: 15px;
    margin-top: 1px;
    flex-shrink: 0;
    accent-color: #3b82f6;
    cursor: pointer;
  }

  .register-terms a {
    color: #60a5fa;
    text-decoration: none;
  }

  .register-terms a:hover {
    text-decoration: underline;
  }

  .register-submit {
    width: 100%;
    min-height: 46px;
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

  .register-submit:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 7px 22px rgba(37, 99, 235, 0.22);
  }

  .register-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .register-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.35);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: register-spin 0.7s linear infinite;
  }

  @keyframes register-spin {
    to {
      transform: rotate(360deg);
    }
  }

  .register-divider {
    display: flex;
    align-items: center;
    gap: 13px;
    margin: 21px 0;
    color: #64748b;
    font-size: 11px;
  }

  .register-divider::before,
  .register-divider::after {
    height: 1px;
    flex: 1;
    background: #243147;
    content: "";
  }

  .register-social-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .register-social-button {
    min-height: 41px;
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

  .register-social-button:hover:not(:disabled) {
    border-color: #4b6a96;
    background: #172338;
  }

  .register-social-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .register-login-text {
    margin: 23px 0 0;
    color: #8492a8;
    font-size: 12px;
    text-align: center;
  }

  .register-login-text a {
    color: #60a5fa;
    font-weight: 650;
    text-decoration: none;
  }

  .register-login-text a:hover {
    text-decoration: underline;
  }

  @media (max-width: 900px) {
    .register-page {
      grid-template-columns: 0.85fr 1.15fr;
    }

    .register-brand-panel {
      padding: 35px 7%;
    }

    .register-brand-heading {
      font-size: 39px;
    }

    .register-form-panel {
      padding: 35px 7%;
    }
  }

  @media (max-width: 680px) {
    .register-page {
      display: block;
    }

    .register-brand-panel {
      display: none;
    }

    .register-form-panel {
      min-height: 100vh;
      min-height: 100dvh;
      padding: 30px 23px;
    }

    .register-form-container {
      max-width: 430px;
    }

    .register-mobile-brand {
      display: flex;
    }

    .register-heading {
      font-size: 26px;
    }
  }

  @media (max-width: 380px) {
    .register-form-panel {
      padding: 25px 16px;
    }

    .register-requirements {
      grid-template-columns: 1fr;
    }

    .register-social-buttons {
      grid-template-columns: 1fr;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .register-input,
    .register-submit,
    .register-social-button,
    .register-strength-bar {
      transition: none;
    }

    .register-spinner {
      animation-duration: 2s;
    }
  }
`;

function getPasswordRequirements(password) {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
}

function Register({
  onRegister,
  onGoogleRegister,
  onGithubRegister,
  loading = false,
  error = "",
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  const requirements = useMemo(
    () => getPasswordRequirements(formData.password),
    [formData.password]
  );

  const strengthScore = Object.values(requirements).filter(Boolean).length;

  const strengthDetails = {
    0: { label: "Not entered", className: "" },
    1: { label: "Weak", className: "weak" },
    2: { label: "Weak", className: "weak" },
    3: { label: "Fair", className: "fair" },
    4: { label: "Good", className: "good" },
    5: { label: "Strong", className: "strong" },
  }[strengthScore];

  const updateField = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: "",
    }));

    setFormError("");
  };

  const validateForm = () => {
    const nextErrors = {};

    const fullName = formData.fullName.trim();
    const email = formData.email.trim();

    if (!fullName) {
      nextErrors.fullName = "Full name is required.";
    } else if (fullName.length < 2) {
      nextErrors.fullName = "Name must contain at least 2 characters.";
    } else if (fullName.length > 100) {
      nextErrors.fullName = "Name cannot exceed 100 characters.";
    }

    if (!email) {
      nextErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!formData.password) {
      nextErrors.password = "Password is required.";
    } else if (strengthScore < 4) {
      nextErrors.password = "Password does not meet the security requirements.";
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (!acceptedTerms) {
      nextErrors.terms = "Please accept the Terms of Service and Privacy Policy.";
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

    if (typeof onRegister !== "function") {
      setFormError(
        "Registration is not configured yet. Please try again later."
      );
      return;
    }

    try {
      await onRegister({
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });
    } catch (registerError) {
      setFormError(
        registerError?.response?.data?.detail ||
        registerError?.message ||
        "Unable to create your account. Please try again."
      );
    }
  };

  const handleSocialRegister = async (callback) => {
    setFormError("");

    if (typeof callback !== "function") {
      setFormError("This registration method is not configured yet.");
      return;
    }

    try {
      await callback();
    } catch (socialError) {
      setFormError(
        socialError?.message ||
        "Social registration failed. Please try again."
      );
    }
  };

  const visibleError = formError || error;

  const requirementItems = [
    { key: "length", label: "8+ characters" },
    { key: "uppercase", label: "Uppercase letter" },
    { key: "lowercase", label: "Lowercase letter" },
    { key: "number", label: "At least one number" },
    { key: "special", label: "Special character" },
  ];

  return (
    <>
      <style>{registerStyles}</style>

      <main className="register-page">
        <section className="register-brand-panel">
          <div className="register-brand-header">
            <div className="register-logo">
              <ShieldCheck size={25} />
            </div>

            <span className="register-brand-name">
              Secure<span>AI</span>
            </span>
          </div>

          <div className="register-brand-content">
            <div className="register-brand-label">
              <Sparkles size={13} />
              Developer Security Platform
            </div>

            <h1 className="register-brand-heading">
              Build securely.
              <br />
              <span>Protect continuously.</span>
            </h1>

            <p className="register-brand-description">
              Bring application security into your development
              workflow. Identify risks early, understand
              vulnerabilities, and build more secure software.
            </p>

            <div className="register-benefits">
              <div className="register-benefit">
                <div className="register-benefit-icon">
                  <Shield size={18} />
                </div>

                <span className="register-benefit-text">
                  Continuous code security analysis
                </span>
              </div>

              <div className="register-benefit">
                <div className="register-benefit-icon">
                  <Sparkles size={18} />
                </div>

                <span className="register-benefit-text">
                  AI-assisted vulnerability explanations
                </span>
              </div>

              <div className="register-benefit">
                <div className="register-benefit-icon">
                  <CheckCircle2 size={18} />
                </div>

                <span className="register-benefit-text">
                  Developer-controlled remediation
                </span>
              </div>
            </div>
          </div>

          <div className="register-brand-footer">
            <span>© {new Date().getFullYear()} SecureAI</span>
            <span>Security-first engineering</span>
          </div>
        </section>

        <section className="register-form-panel">
          <div className="register-form-container">
            <div className="register-mobile-brand">
              <div className="register-logo">
                <ShieldCheck size={23} />
              </div>

              <span className="register-brand-name">
                Secure<span>AI</span>
              </span>
            </div>

            <h2 className="register-heading">
              Create your account
            </h2>

            <p className="register-subtitle">
              Get started with intelligent application security.
            </p>

            {visibleError && (
              <div className="register-alert" role="alert">
                <AlertCircle size={16} />
                <span>{visibleError}</span>
              </div>
            )}

            <form
              className="register-form"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="register-field">
                <label
                  className="register-label"
                  htmlFor="register-name"
                >
                  Full name
                </label>

                <div className="register-input-wrapper">
                  <span className="register-input-icon">
                    <User size={16} />
                  </span>

                  <input
                    id="register-name"
                    className={`register-input ${
                      errors.fullName ? "invalid" : ""
                    }`}
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    autoComplete="name"
                    maxLength={100}
                    value={formData.fullName}
                    onChange={(event) =>
                      updateField("fullName", event.target.value)
                    }
                    aria-invalid={Boolean(errors.fullName)}
                    aria-describedby={
                      errors.fullName ? "register-name-error" : undefined
                    }
                    required
                  />
                </div>

                {errors.fullName && (
                  <span
                    className="register-field-error"
                    id="register-name-error"
                  >
                    {errors.fullName}
                  </span>
                )}
              </div>

              <div className="register-field">
                <label
                  className="register-label"
                  htmlFor="register-email"
                >
                  Email address
                </label>

                <div className="register-input-wrapper">
                  <span className="register-input-icon">
                    <Mail size={16} />
                  </span>

                  <input
                    id="register-email"
                    className={`register-input ${
                      errors.email ? "invalid" : ""
                    }`}
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={
                      errors.email ? "register-email-error" : undefined
                    }
                    required
                  />
                </div>

                {errors.email && (
                  <span
                    className="register-field-error"
                    id="register-email-error"
                  >
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="register-field">
                <label
                  className="register-label"
                  htmlFor="register-password"
                >
                  Password
                </label>

                <div className="register-input-wrapper">
                  <span className="register-input-icon">
                    <LockKeyhole size={16} />
                  </span>

                  <input
                    id="register-password"
                    className={`register-input ${
                      errors.password ? "invalid" : ""
                    }`}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={(event) =>
                      updateField("password", event.target.value)
                    }
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby="register-password-requirements"
                    required
                  />

                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
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

                <div className="register-strength">
                  <div
                    className="register-strength-bars"
                    aria-label={`Password strength: ${strengthDetails.label}`}
                  >
                    {[1, 2, 3, 4].map((bar) => (
                      <span
                        key={bar}
                        className={[
                          "register-strength-bar",
                          bar <= Math.ceil(strengthScore * 4 / 5)
                            ? "active"
                            : "",
                          bar <= Math.ceil(strengthScore * 4 / 5)
                            ? strengthDetails.className
                            : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      />
                    ))}
                  </div>

                  <span className="register-strength-label">
                    Password strength: {strengthDetails.label}
                  </span>

                  <div
                    className="register-requirements"
                    id="register-password-requirements"
                  >
                    {requirementItems.map((item) => {
                      const met = requirements[item.key];

                      return (
                        <span
                          className={`register-requirement ${
                            met ? "met" : ""
                          }`}
                          key={item.key}
                        >
                          {met ? (
                            <CheckCircle2 size={12} />
                          ) : (
                            <XCircle size={12} />
                          )}

                          {item.label}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {errors.password && (
                  <span className="register-field-error">
                    {errors.password}
                  </span>
                )}
              </div>

              <div className="register-field">
                <label
                  className="register-label"
                  htmlFor="register-confirm-password"
                >
                  Confirm password
                </label>

                <div className="register-input-wrapper">
                  <span className="register-input-icon">
                    <LockKeyhole size={16} />
                  </span>

                  <input
                    id="register-confirm-password"
                    className={`register-input ${
                      errors.confirmPassword ? "invalid" : ""
                    }`}
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={(event) =>
                      updateField("confirmPassword", event.target.value)
                    }
                    aria-invalid={Boolean(errors.confirmPassword)}
                    aria-describedby={
                      errors.confirmPassword
                        ? "register-confirm-error"
                        : undefined
                    }
                    required
                  />

                  <button
                    type="button"
                    className="register-password-toggle"
                    onClick={() =>
                      setShowConfirmPassword((previous) => !previous)
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <span
                    className="register-field-error"
                    id="register-confirm-error"
                  >
                    {errors.confirmPassword}
                  </span>
                )}
              </div>

              <div>
                <label className="register-terms">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(event) => {
                      setAcceptedTerms(event.target.checked);

                      setErrors((previous) => ({
                        ...previous,
                        terms: "",
                      }));
                    }}
                  />

                  <span>
                    I agree to the{" "}
                    <Link to="/terms">Terms of Service</Link>
                    {" "}and{" "}
                    <Link to="/privacy">Privacy Policy</Link>.
                  </span>
                </label>

                {errors.terms && (
                  <span className="register-field-error">
                    {errors.terms}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="register-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="register-spinner" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="register-divider">
              Or sign up with
            </div>

            <div className="register-social-buttons">
              <button
                type="button"
                className="register-social-button"
                onClick={() =>
                  handleSocialRegister(onGithubRegister)
                }
                disabled={loading}
              >
                <Github size={16} />
                GitHub
              </button>

              <button
                type="button"
                className="register-social-button"
                onClick={() =>
                  handleSocialRegister(onGoogleRegister)
                }
                disabled={loading}
              >
                <Chrome size={16} />
                Google
              </button>
            </div>

            <p className="register-login-text">
              Already have an account?{" "}
              <Link to="/login">Sign in</Link>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

export default Register;