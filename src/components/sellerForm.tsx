import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRegisterSeller } from "@/hooks/useRegisterSeller";
import { VerificationStatusBadge } from "./verificationStatus";
import { Label } from "./ui/label";

export function SellerForm(){

    const {
        formData,
        errorMessage,
        isSubmitting,
        handleChange,
        handleSubmit,
        result
    } = useRegisterSeller();

    if(result){
        return <VerificationStatusBadge status={result.status}/>
    }

    return(
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <fieldset className="flex flex-col gap-4">
                <legend className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Dados da Loja
                </legend>

                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                        id="cnpj"
                        name="cnpj"
                        placeholder="00.000.000/0000-00"
                        inputMode="numeric"
                        maxLength={18}
                        required
                        value={formData.cnpj}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="razaoSocial">Razão Social</Label>
                    <Input
                        id="razaoSocial"
                        name="razaoSocial"
                        required
                        value={formData.razaoSocial}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
                    <Input
                        id="nomeFantasia"
                        name="nomeFantasia"
                        required
                        value={formData.nomeFantasia}
                        onChange={handleChange}
                    />
                </div>
            </fieldset>

            <fieldset className="flex flex-col gap-4">
                <legend className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Endereço da Loja
                </legend>

                <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1.5 col-span-2">
                        <Label htmlFor="endereco.logradouro">Logradouro</Label>
                        <Input
                            id="endereco.logradouro"
                            name="endereco.logradouro"
                            placeholder="Rua, Avenida..."
                            required
                            value={formData.endereco.logradouro}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="endereco.numero">Número</Label>
                        <Input
                            id="endereco.numero"
                            name="endereco.numero"
                            type="number"
                            required
                            value={formData.endereco.numero || ""}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="endereco.bairro">Bairro</Label>
                        <Input
                            id="endereco.bairro"
                            name="endereco.bairro"
                            required
                            value={formData.endereco.bairro}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="endereco.cep">CEP</Label>
                        <Input
                            id="endereco.cep"
                            name="endereco.cep"
                            placeholder="00000-000"
                            inputMode="numeric"
                            maxLength={9}
                            required
                            value={formData.endereco.cep}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="endereco.cidade">Cidade</Label>
                        <Input
                            id="endereco.cidade"
                            name="endereco.cidade"
                            required
                            value={formData.endereco.cidade}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="endereco.estado">Estado (UF)</Label>
                        <Input
                            id="endereco.estado"
                            name="endereco.estado"
                            placeholder="SP"
                            maxLength={2}
                            required
                            value={formData.endereco.estado}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="endereco.complemento">
                            Complemento{" "}
                            <span className="text-gray-400 font-normal">(opcional)</span>
                        </Label>
                        <Input
                            id="endereco.complemento"
                            name="endereco.complemento"
                            value={formData.endereco.complemento}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="endereco.referencia">
                            Referência{" "}
                            <span className="text-gray-400 font-normal">(opcional)</span>
                        </Label>
                        <Input
                            id="endereco.referencia"
                            name="endereco.referencia"
                            value={formData.endereco.referencia}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </fieldset>

            {errorMessage && (
                <p role="alert" className="text-sm text-red-500 text-center">
                    {errorMessage}
                </p>
            )}

            <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
                {isSubmitting ? "Cadastrando..." : "Cadastrar Loja"}
            </Button>
        </form>
    )
}