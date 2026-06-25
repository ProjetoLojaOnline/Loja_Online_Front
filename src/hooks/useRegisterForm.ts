import {
  useState,
  useCallback,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useNavigate } from "react-router";

interface RegisterFormData {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  dataNascimento: string;
  genero: string;
  loginUsername: string;
  password: string;
  confirmPassword: string;
}

interface UseRegisterFormReturn {
  formData: RegisterFormData;
  isPasswordVisible: boolean;
  errorMessage: string | null;
  isSubmitting: boolean;
  handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void;
  togglePasswordVisibility(): void;
  handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void>;
}

const INITIAL_FORM_DATA: RegisterFormData = {
  nome: "",
  email: "",
  cpf: "",
  telefone: "",
  dataNascimento: "",
  genero: "",
  loginUsername: "",
  password: "",
  confirmPassword: "",
};

const UNEXPECTED_ERROR_MESSAGE = "Unexpected error. Please try again.";

async function parseBackendError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { message?: string };
    return body.message ?? UNEXPECTED_ERROR_MESSAGE;
  } catch {
    return UNEXPECTED_ERROR_MESSAGE;
  }
}

export function useRegisterForm(): UseRegisterFormReturn {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterFormData>(INITIAL_FORM_DATA);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = event.target;
      setFormData((previous) => ({ ...previous, [name]: value }));
    },
    []
  );

  const togglePasswordVisibility = useCallback(
    () => setIsPasswordVisible((previous) => !previous),
    []
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (formData.password !== formData.confirmPassword) {
        setErrorMessage("As senhas não coincidem.");
        return;
      }

      const cpfDigits = formData.cpf.replace(/\D/g, "");
      if (cpfDigits.length !== 11) {
        setErrorMessage("CPF deve ter exatamente 11 dígitos.");
        return;
      }

      const phoneDigits = formData.telefone.replace(/\D/g, "");
      if (phoneDigits.length < 10 || phoneDigits.length > 11) {
        setErrorMessage("Telefone deve ter 10 ou 11 dígitos.");
        return;
      }

      setErrorMessage(null);
      setIsSubmitting(true);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/usuarios`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              usuario: {
                nome: formData.nome.trim(),
                email: formData.email.trim(),
                cpf: cpfDigits,
                telefone: phoneDigits,
                dataNascimento: formData.dataNascimento || null,
                genero: formData.genero || null,
              },
              login: {
                login: formData.loginUsername.trim(),
                senha: formData.password,
              },
            }),
          }
        );

        if (!response.ok) {
          const message = await parseBackendError(response);
          throw new Error(message);
        }

        navigate("/login?registered=true");
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : UNEXPECTED_ERROR_MESSAGE
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, navigate]
  );

  return {
    formData,
    isPasswordVisible,
    errorMessage,
    isSubmitting,
    handleChange,
    togglePasswordVisibility,
    handleSubmit,
  };
}
