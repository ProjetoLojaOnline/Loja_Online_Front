import { useEffect, useState } from "react";
import Header from "./components/organisms/Header";
import ProductCard from "./components/organisms/ProductCard";

interface IProduto {
  "id": number,
  "nome": string,
  "descricao": string,
  "categoria": string,
  "quantidade": number,
  "preco": number,
  "cor": string
}

function App() {
  const [products, setProducts] = useState([])

  useEffect(() => {

    const fetchData = async (url: string) => {
      try {
        const result = await fetch(url);
        const json = await result.json();
        setProducts(json.content);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData("http://localhost:8080/produto")
  }, [])


  return <div className='w-screen h-screen flex justify-center items-center'>
    <Header />
    <main className="h-full w-full mt-80 flex flex-col items-center justify-start gap-20">
      <h2 className="text-xl">Todos os Produtos</h2>
      <section className="flex gap-5">
        {
          products.map((product: IProduto) => <ProductCard key={product.id} title={product.nome} price={product.preco} />)
        }
      </section>
    </main>
  </div>
}

export default App
