import { UNEXPECTED_ERROR_MESSAGE } from "@/lib/api";
import { isValidCnpj } from "@/lib/cnpjValidator";
import { createSeller } from "@/lib/sellerApi";
import type { EnderecoDTO } from "@/types/adress"
import type { SellerRequest, SellerResponse } from "@/types/seller";
import {
  useState,
  useCallback,
  type ChangeEvent,
  type SubmitEvent,
} from "react";

interface RegisterFormData {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  endereco: EnderecoDTO;
}
interface UseRegisterSellerReturn{

  formData: RegisterFormData;
  errorMessage: string | null;
  isSubmitting: boolean;
  result: SellerResponse| null;
  handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void;
  handleSubmit(event: SubmitEvent<HTMLFormElement>): Promise<void>;
}
const INITIAL_FORM_DATA: RegisterFormData = {
  cnpj: "",
  razaoSocial: "",
  nomeFantasia: "",
  endereco: {
    logradouro: "",
    numero: 0,
    bairro: "",
    complemento: "",
    referencia: "",
    cep: "",
    cidade: "",
    estado: "",
  },
};

export function useRegisterSeller(): UseRegisterSellerReturn{

  const [formData, setFormData] = useState<RegisterFormData>(INITIAL_FORM_DATA)
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SellerResponse | null>(null);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const{name, value} = event.target;

      if(name.startsWith("endereco.")){

        const fieldName = name.split(".")[1] as keyof EnderecoDTO;
        setFormData((previous)=>({

          ...previous,
          endereco: {...previous.endereco,
            [fieldName]:fieldName === 'numero'? (value=== ""? 0 : Number(value)): value,
          },
        }));
        return;
      };

      setFormData((previous) => ({ ...previous, [name]: value }));
    },[]
  );

  const handleSubmit = useCallback(

    async(event: SubmitEvent<HTMLFormElement>) =>{

      event.preventDefault();

      const cnpjDigits = formData.cnpj.replace(/\D/g, "");

      if(!isValidCnpj(cnpjDigits)){
        setErrorMessage("CNPJ inválido");
        return;
      };

      setErrorMessage(null);
      setIsSubmitting(true);

      try {
        
        const payload: SellerRequest = {

          cnpj: cnpjDigits,
          razaoSocial: formData.razaoSocial.trim(),
          nomeFantasia: formData.nomeFantasia.trim(),
          endereco: {
            ...formData.endereco,
            logradouro: formData.endereco.logradouro.trim(),
            bairro: formData.endereco.bairro.trim(),
            complemento: formData.endereco.complemento.trim(),
            referencia: formData.endereco.referencia.trim(),
            cep: formData.endereco.cep.trim(),
            cidade: formData.endereco.cidade.trim(),
            estado: formData.endereco.estado.trim(),
          },
        }
        const response = await createSeller(payload);

        setResult(response)

      } catch (err) {

        setErrorMessage(err instanceof Error? err.message : UNEXPECTED_ERROR_MESSAGE)
      }finally{
        setIsSubmitting(false)
      }
    },[formData]
  )

  return{

    formData,
    errorMessage,
    isSubmitting,
    result,
    handleChange,
    handleSubmit
  }

}

