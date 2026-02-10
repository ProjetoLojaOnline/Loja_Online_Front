import type React from "react";
import { useState } from "react";

import { IoCloseOutline } from "react-icons/io5";

const SideModal = ({ children, modalContent }: { children: React.ReactNode, modalContent?: React.ReactNode }) => {
    const [showModal, setShowModal] = useState(false)

    return <>
        <button className="cursor-pointer" onClick={() => setShowModal(!showModal)}>
            {children}
        </button>

        {
            showModal && <>
                <div className="fixed top-0 w-screen h-screen bg-black opacity-0" onClick={() => setShowModal(false)}>
                    
                </div>
                <div className='duration-500 fixed flex flex-col gap-3 left-0 top-0 w-80 h-full bg-white animate-sheetslide'>
                    <header className="w-full flex items-center justify-end pt-5 pr-2.5">
                        <button className="cursor-pointer" onClick={() => setShowModal(false)}><IoCloseOutline size={30} /></button>
                    </header>
                    {modalContent}
                </div>
            </>
        }
    </>

}

export default SideModal;