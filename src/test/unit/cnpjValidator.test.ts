import { describe, it, expect } from "vitest";
import { isValidCnpj } from "@/lib/cnpjValidator";

describe("validação CNPJ(isValidCnpj)", ()=>{
    it("deve retornar true para cnpj sem mascara", ()=>{
        expect(isValidCnpj("11222333000181")).toBe(true);
    });

    it("deve retornar true para cnpj com mascara", ()=>{
        expect(isValidCnpj("11.222.333/0001-81")).toBe(true);
    })

    it("deve retornar false para cnpj com número verificador errado", ()=>{
        expect(isValidCnpj("11.222.333/0001-00")).toBe(false);
    })

    it("deve retornar false para cnpj com menos de 14 digitor", ()=>{
        expect(isValidCnpj("11222333")).toBe(false);
    })

    it("deve retornar false para cnpj com todos os números iguais", ()=>{
        expect(isValidCnpj("00000000000000")).toBe(false);
        expect(isValidCnpj("11111111111111")).toBe(false);
    })

    it("deve retornar false para string vazia", ()=>{
        expect(isValidCnpj("")).toBe(false);
    })
})