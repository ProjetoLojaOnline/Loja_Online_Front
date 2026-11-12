import { maskCnpj } from "@/lib/formatters";
import { describe,it,expect } from "vitest";

describe("mascara de CNPJ (maskCnpj)", ()=>{

    it("deve formatar um CNPJ completo", ()=>{

        expect(maskCnpj("11222333000181")).toBe("11.222.333/0001-81");
    })

    it("deve formatar parcialmente conforme usuario digita",()=>{

        expect(maskCnpj("112")).toBe("11.2")
        expect(maskCnpj("11222")).toBe("11.222")
        expect(maskCnpj("11222333")).toBe("11.222.333")
        expect(maskCnpj("112223330001")).toBe("11.222.333/0001")
    })

    it("deve retornar de um CNPJ formatado um CNPJ",()=>{

        expect(maskCnpj("11.222.333/0001-81")).toBe("11.222.333/0001-81")
    })
})