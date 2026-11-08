import type { SellerRequest, SellerResponse } from "@/types/seller";

export async function createSeller(payload:SellerRequest):Promise<SellerResponse> {

    await new Promise((resolve) => setTimeout(resolve, 800));

    if(payload.cnpj.endsWith("0001")){

        throw new Error("Este CNPJ já está cadastrado no sistema."); 
    }

    return {
    id: "id-falso-123",
    cnpj: payload.cnpj,
    razaoSocial: payload.razaoSocial,
    nomeFantasia: payload.nomeFantasia,
    endereco: payload.endereco,
    status: "PENDENTE", 
  };
}