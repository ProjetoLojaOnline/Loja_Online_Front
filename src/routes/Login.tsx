import LogoComponent from '@/components/atoms/LogoComponent';
import InputMolecule from '@/components/molecules/InputMolecule';

const Login = () => {
    return <div className='w-screen h-screen flex justify-center items-center'>
        <main className="w-215 h-145 bg-light flex flex-col items-center md:items-start md:flex-row">
            <section className="bg-dark md:w-[52%] w-full h-full flex justify-center items-center">
                <LogoComponent />
            </section>
            <section className="md:w-[48%] h-full flex flex-col items-center gap-10 py-25 text-dark text-2xl">
                <h2 className="font-ubuntu font-extrabold">LOGIN</h2>
                <div className="w-full px-10">
                    <form className="w-full flex flex-col gap-5">

                        <InputMolecule name="email" label="Email" type="email" />
                        <InputMolecule name="password" label="Senha" type="password" />

                        <div className="w-full mt-6">
                            <button className="
                                w-full text-light font-semibold bg-linear-to-r from-allbuy-blue-1 to-allbuy-blue-2
                                rounded-lg px-2 py-1 border border-black cursor-pointer"
                            >
                                Entrar
                            </button>
                        </div>

                        <a href="" className="text-center text-sm font-semibold underline">Cadastrar-se</a>

                    </form>
                </div>
            </section>
        </main>
    </div>
}

export default Login