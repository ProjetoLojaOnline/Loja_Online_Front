import SearchComponent from '@/components/molecules/SearchComponent'
import SideModal from '@/components/molecules/SideModal'
import { FaBars } from 'react-icons/fa6'
import { PiGearLight, PiPackageLight, PiShoppingCartLight, PiUserCircleFill } from 'react-icons/pi'

const Header = () => {
    return <header className="w-screen h-18 absolute top-0 flex items-center bg-light text-black px-10 shadow-xl">

        <div className="flex items-center gap-10">

            <SideModal modalContent={
                (
                    <main>

                    </main>
                )
            }>
                <FaBars size={35} className="" />
            </SideModal>
        </div>

        <div className={`ml-10 text-center text-2xl font-semibold text-dark`}>
            ALL
            <span className="font-bold text-4xl allbuyGradientText">BUY</span>
            <span className="text-sm">&copy;</span>
        </div>

        <div className="mx-55 flex justify-start items-center gap-10 mobileDisplay md:block">
            <SearchComponent />
        </div>

        <div className="ml-auto flex justify-start items-center gap-5">
            <button className="duration-100 cursor-pointer hover:text-gray-400 active:text-allbuy-blue-1 mobileDisplay md:block">
                <PiPackageLight size={35} />
            </button>
            <button className="duration-100 cursor-pointer hover:text-gray-400 active:text-allbuy-blue-1 mobileDisplay md:block">
                <PiShoppingCartLight size={35} />
            </button>
            <button className="duration-100 cursor-pointer hover:text-gray-400 active:text-allbuy-blue-1 mobileDisplay md:block">
                <PiGearLight size={35} />
            </button>
            <button className="duration-100 cursor-pointer hover:text-gray-400 active:text-allbuy-blue-1">
                <PiUserCircleFill size={35} />
            </button>
        </div>

    </header>
}

export default Header