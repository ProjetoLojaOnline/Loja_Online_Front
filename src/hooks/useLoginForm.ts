import { useState, useCallback, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router";

import { useAuth } from "@/context/AuthContext";

interface UseLoginFormReturn {
  email: string;
  password: string;
  isPasswordVisible: boolean;
  errorMessage: string | null;
  isSubmitting: boolean;
  handleEmailChange(event: ChangeEvent<HTMLInputElement>): void;
  handlePasswordChange(event: ChangeEvent<HTMLInputElement>): void;
  togglePasswordVisibility(): void;
  handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void>;
}

export function useLoginForm(): UseLoginFormReturn {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value),
    []
  );

  const handlePasswordChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value),
    []
  );

  const togglePasswordVisibility = useCallback(
    () => setIsPasswordVisible((previous) => !previous),
    []
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!email.trim() || !password.trim()) return;
      setErrorMessage(null);
      setIsSubmitting(true);
      try {
        await signIn(email, password);
        navigate("/");
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Unexpected error."
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [email, password, signIn, navigate]
  );

  return {
    email,
    password,
    isPasswordVisible,
    errorMessage,
    isSubmitting,
    handleEmailChange,
    handlePasswordChange,
    togglePasswordVisibility,
    handleSubmit,
  };
}
