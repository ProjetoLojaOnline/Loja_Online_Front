import { maskCPF, maskPhone } from '@/lib/masks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { z } from 'zod';

interface BackendFieldError {
  fieldName: string;
  message: string;
}

export type CpfVerificationStatus =
  | 'NAO_VERIFICADO'
  | 'PENDENTE'
  | 'VERIFICADO';

const registerSchema = z
  .object({
    nome: z.string().min(3, 'Nome é obrigatório'),
    email: z.string().email('E-mail inválido'),
    cpf: z.string().refine((val) => val.replace(/\D/g, '').length === 11, {
      message: 'CPF deve ter 11 dígitos',
    }),
    endereco: z.string().min(5, 'Endereço é obrigatório'),
    telefone: z.string().min(14, 'Telefone incompleto'),
    dataNascimento: z
      .string()
      .optional()
      .refine(
        (data) => {
          if (!data) return true;
          const parsedDate = new Date(data);
          const today = new Date();
          return (
            !isNaN(parsedDate.getTime()) &&
            parsedDate <= today &&
            parsedDate.getFullYear() >= 1900
          );
        },
        { message: 'Data de nascimento inválida' }
      ),
    genero: z.string().optional(),
    loginUsername: z.string().min(3, 'O usuário é obrigatório'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export function useRegisterForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [genericError, setGenericError] = useState<string | null>(null);
  const [cpfStatus, setCpfStatus] =
    useState<CpfVerificationStatus>('NAO_VERIFICADO');

  // Estado para os testes de UI
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nome: '',
      email: '',
      cpf: '',
      telefone: '',
      endereco: '',
      dataNascimento: '',
      genero: '',
      loginUsername: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setGenericError(null);

    // Estrutura de payload ajustada para casar com a expectativa da API/Testes
    const payload = {
      usuario: {
        nome: data.nome.trim(),
        email: data.email.trim(),
        cpf: data.cpf.replace(/\D/g, ''),
        enderecos: [{ logradouro: data.endereco }],
        telefone: data.telefone.replace(/\D/g, ''),
        dataNascimento: data.dataNascimento || null,
        genero: data.genero || null,
      },
      login: {
        login: data.loginUsername.trim(),
        senha: data.password,
      },
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/usuarios`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();

        // Mapeia validações de campo normais (400)
        if (errorData.errors && Array.isArray(errorData.errors)) {
          errorData.errors.forEach((err: BackendFieldError) => {
            form.setError(err.fieldName as keyof RegisterFormData, {
              type: 'server',
              message: err.message,
            });
          });
          return;
        }

        // Intercepta erros 409 e direciona para o campo correto
        if (response.status === 409 && errorData.message) {
          const msg = errorData.message.toLowerCase();
          if (msg.includes('email') || msg.includes('e-mail')) {
            form.setError('email', {
              type: 'server',
              message: errorData.message,
            });
            return;
          }
          if (msg.includes('cpf')) {
            form.setError('cpf', {
              type: 'server',
              message: errorData.message,
            });
            return;
          }
          if (msg.includes('login') || msg.includes('usuário')) {
            form.setError('loginUsername', {
              type: 'server',
              message: errorData.message,
            });
            return;
          }
        }

        throw new Error(errorData.message || 'Erro inesperado ao cadastrar.');
      }

      setCpfStatus('PENDENTE');
      navigate('/login?registered=true');
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        setGenericError(
          'Não foi possível conectar ao servidor. Tente novamente mais tarde.'
        );
      } else {
        setGenericError(
          error instanceof Error
            ? error.message
            : 'Erro desconhecido ao cadastrar.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = maskCPF(e.target.value);
    form.setValue('cpf', e.target.value, { shouldValidate: true });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = maskPhone(e.target.value);
    form.setValue('telefone', e.target.value, { shouldValidate: true });
  };

  return {
    form,
    isSubmitting,
    genericError,
    cpfStatus,
    isPasswordVisible,
    togglePasswordVisibility,
    onSubmit: form.handleSubmit(onSubmit),
    handleCpfChange,
    handlePhoneChange,
  };
}
