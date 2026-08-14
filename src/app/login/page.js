"use client";

import { useRouter } from "next/navigation";
import AuthView from "../../components/auth/AuthView";
import ToastProvider from "../../components/layout/ToastProvider";

/**
 * /login – the standalone, light-only sign-in page.
 *
 * The whole app is behind middleware, so unauthenticated visitors land here.
 * AuthView already renders a fixed full-screen light surface; on a successful
 * login (or account creation) we send the user into the protected app.
 */
export default function LoginPage() {
  const router = useRouter();

  const handleUser = (user) => {
    if (user) router.replace("/");
  };

  return (
    <>
      <ToastProvider darkMode={false} />
      <AuthView setUser={handleUser} />
    </>
  );
}
