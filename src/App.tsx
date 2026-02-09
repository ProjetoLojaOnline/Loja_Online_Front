import { useEffect, useState } from "react";
import Header from "./components/organisms/Header";
import ProductCard from "./components/organisms/ProductCard";
import type ProductInterface from "./types/product";
import SpinnerComponent from "./components/atoms/SpinnerComponent";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(false);

  useEffect(() => {

    const fetchData = async (url: string) => {
      try {
        const result = await fetch(url);
        const json = await result.json();
        setLoading(false);
        setProducts(json.content);
      } catch (error) {
        setLoading(false);
        setErrorStatus(true);
        console.error(error);
      }
    }

    fetchData(import.meta.env.VITE_API_URL);

  }, [])


  return <div className='w-screen h-screen flex justify-center items-center'>
    <Header />
    <main className="h-full w-full mt-80 flex flex-col items-center justify-start gap-20">
      <h2 className="text-xl">Todos os Produtos</h2>
      <section className="flex gap-5">
        {
          errorStatus
            ? <div className="py-20">
              <p>ERROR 500 - Internal Server Error</p>
            </div>
            : products.length > 0
              ? !loading
                ? products.map((product: ProductInterface) => <ProductCard key={product.id} title={product.nome} price={product.preco} />)
                : <div className="py-20">
                  <SpinnerComponent />
                </div>
              : <div className="py-20">
                <p>Nenhum produto foi encontrado.</p>
              </div>
        }
      </section>
    </main>
  </div>
}

export default App;
