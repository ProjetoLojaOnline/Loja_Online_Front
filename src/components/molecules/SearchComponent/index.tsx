import { LiaSearchSolid } from 'react-icons/lia'

const SearchComponent = () => {
    return <form className="border flex items-center px-5 py-1 rounded-4xl">
        <button className="duration-100 cursor-pointer hover:text-gray-400 active:text-allbuy-blue-1">
            <LiaSearchSolid size={30} />
        </button>
        <input type="search" className="text-lg mx-2 w-80" />
    </form>
}

export default SearchComponent