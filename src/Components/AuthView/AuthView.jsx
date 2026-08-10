"use client";
import LoginForm from "./forms/LoginForm";
import RegisterForm from "./forms/RegisterForm";
import AuthShell from "./layout/AuthShell";
import ForgotPasswordModal from "./modals/ForgotPasswordModal";
import SuccessModal from "./modals/SuccessModal";
import useAuthView from "./useAuthView";

/**
 * FinVue login page — matches the sign-in mockup: a white split layout with
 * the dashboard image on the left and the centered sign-in / sign-up form
 * on the right. All state + handlers live in useAuthView; this file only
 * wires the presentational pieces together.
 */
const AuthView = ({ setUser, onClose }) => {
  const {
    mode,
    showSuccess,
    createdUser,
    showForgotPassword,
    loginForm,
    registerForm,
    usernameRef,
    setUsername,
    setEmail,
    setPassword,
    setConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    setAgreeTerms,
    setRememberMe,
    markTouched,
    toggleMode,
    handleLogin,
    handleRegister,
    handleContinue,
    openForgotPassword,
    closeForgotPassword,
    handleLoginAfterReset,
  } = useAuthView({ setUser });

  return (
    <>
      <AuthShell mode={mode} onClose={onClose}>
        {mode === "login" ? (
          <LoginForm
            form={loginForm}
            usernameRef={usernameRef}
            setUsername={setUsername}
            setPassword={setPassword}
            setShowPassword={setShowPassword}
            setRememberMe={setRememberMe}
            onForgotPassword={openForgotPassword}
            onSwitchToRegister={toggleMode}
            onSubmit={handleLogin}
          />
        ) : (
          <RegisterForm
            form={registerForm}
            usernameRef={usernameRef}
            setUsername={setUsername}
            setEmail={setEmail}
            setPassword={setPassword}
            setConfirmPassword={setConfirmPassword}
            setShowPassword={setShowPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            setAgreeTerms={setAgreeTerms}
            markTouched={markTouched}
            onSwitchToLogin={toggleMode}
            onSubmit={handleRegister}
          />
        )}
      </AuthShell>

      {showSuccess && createdUser && (
        <SuccessModal
          username={createdUser.username}
          onContinue={handleContinue}
        />
      )}

      {showForgotPassword && (
        <ForgotPasswordModal
          onClose={closeForgotPassword}
          onLoginAfterReset={handleLoginAfterReset}
        />
      )}
    </>
  );
};

export default AuthView;
