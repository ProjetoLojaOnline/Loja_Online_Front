import React from 'react'

const InputComponent = ({ ...rest }: { rest: React.HTMLAttributes<HTMLInputElement> }) => {
    return (
        <input {...rest}
            className="px-4 py-3 rounded-lg border border-gray-300 mt-3 text-sm w-full bg-white"
        />
    )
}

export default InputComponent