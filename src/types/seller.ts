import type { EnderecoDTO } from "./adress";

export type VerificationStatus = 'PENDENTE' | 'APROVADO' | 'REJEITADO';

export interface SellerRequest{

    cnpj: string;
    razaoSocial: string;
    nomeFantasia: string;
    endereco: EnderecoDTO;
}

export interface SellerResponse{

    id: string;
    cnpj: string;
    razaoSocial: string;
    nomeFantasia: string;
    endereco: EnderecoDTO;
    status: VerificationStatus;
}