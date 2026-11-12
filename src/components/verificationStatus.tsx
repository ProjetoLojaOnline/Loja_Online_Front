import type { VerificationStatus } from "@/types/seller";

interface StatusVerificationProp{

    status: VerificationStatus
}

export function VerificationStatusBadge({status}: StatusVerificationProp){

    const configStatus = {
        PENDENTE:{
            titulo: "Cadastro em Análise",
            mensagem: "Sua loja foi cadastrada e está aguardando a aprovação da nossa equipe. Você receberá um e-mail em breve.",
            corFundo: "bg-yellow-50",
            corBorda: "border-yellow-200",
            corTitulo: "text-yellow-800",
            corTexto: "text-yellow-700",
            icone: "⏳",
        },
        APROVADO: {
            titulo: "Loja Aprovada!",
            mensagem: "Parabéns! Seu cadastro foi aprovado. Você já pode acessar o painel e começar a cadastrar seus produtos.",
            corFundo: "bg-green-50",
            corBorda: "border-green-200",
            corTitulo: "text-green-800",
            corTexto: "text-green-700",
            icone: "✅",
        },
        REJEITADO: {
            titulo: "Cadastro Rejeitado",
            mensagem: "Infelizmente não pudemos aprovar sua loja no momento. Verifique se os dados estão corretos ou entre em contato com o suporte.",
            corFundo: "bg-red-50",
            corBorda: "border-red-200",
            corTitulo: "text-red-800",
            corTexto: "text-red-700",
            icone: "❌",
        },
    }

    const config = configStatus[status]

    if(!config) return null;

    return(

        <div className={`flex flex-col gap-2 p-6 border rounded-lg w-full max-w-md shadow-sm ${config.corFundo} ${config.corBorda}`}>
            <div className="flex items-center gap-3">
                <span className="text-3xl">{config.icone}</span>
                <h2 className={`text-xl font-bold ${config.corTitulo}`}>
                    {config.titulo}
                </h2>
            </div>
            <p className={`text-sm mt-2 ${config.corTexto}`}>
                {config.mensagem}
            </p>
        </div>
    )
}