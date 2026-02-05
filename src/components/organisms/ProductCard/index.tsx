import placeholderImage from "@/assets/placeholder.webp"

import { CiStar } from "react-icons/ci";

const ProductCard = ({ title, price }: { title: string, price: number }) => {
    return <div className="flex flex-col gap-2.5 border-2 p-5 rounded-xl">
        <img src={placeholderImage} alt="placeholder de imagem" className="w-35 border" />
        <div className="flex flex-col">
            <h1 className="text-md mb-2.5 truncate w-35" title={title}>{title}</h1>
            <div className="flex items-center">
                <CiStar size={20} />
                <CiStar size={20} />
                <CiStar size={20} />
                <CiStar size={20} />
                <CiStar size={20} />
            </div>
            <p className="font-bold">
                {
                    price.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    })
                }
            </p>
        </div>
    </div>
}

export default ProductCard