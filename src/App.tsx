import { FaBars } from "react-icons/fa6";
import { PiPackageLight, PiShoppingCartLight, PiGearLight, PiUserCircleFill } from "react-icons/pi";
import SearchComponent from "./components/molecules/SearchComponent";
import SideModal from "./components/molecules/SideModal";

function App() {

  return <div className='w-screen h-screen flex justify-center items-center'>
    <header className="absolute top-0 flex items-center justify-between bg-light text-black w-full h-18 px-10">

      <div className="flex items-center gap-10">

        <SideModal modalContent={
          (
            <main>

            </main>
          )
        }>
          <FaBars size={35} className="" />
        </SideModal>

        <div className={`w-full text-center text-2xl font-semibold text-dark`}>
          ALL
          <span className="font-bold text-4xl allbuyGradientText">BUY</span>
          <span className="text-sm">&copy;</span>
        </div>
      </div>

      <div className="flex justify-start items-center gap-10">
        <SearchComponent />
      </div>

      <div className="flex justify-start items-center gap-5">
        <button className="duration-100 cursor-pointer hover:text-gray-400 active:text-allbuy-blue-1">
          <PiPackageLight size={35} />
        </button>
        <button className="duration-100 cursor-pointer hover:text-gray-400 active:text-allbuy-blue-1">
          <PiShoppingCartLight size={35} />
        </button>
        <button className="duration-100 cursor-pointer hover:text-gray-400 active:text-allbuy-blue-1">
          <PiGearLight size={35} />
        </button>
        <button className="duration-100 cursor-pointer hover:text-gray-400 active:text-allbuy-blue-1">
          <PiUserCircleFill size={35} />
        </button>
      </div>

    </header>
  </div>
}

export default App
