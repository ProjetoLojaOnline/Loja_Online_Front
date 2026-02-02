import { CheckboxComponent } from '@/components/atoms/CheckboxComponent'
import InputComponent from '@/components/atoms/InputComponent'
import React, { useState } from 'react'

const InputMolecule = ({ name, label, type }: { name: string, label: string, type: string }) => {
    const [passwordVisible, setPasswordVisible] = useState(false)

    const getInputElement = (type: string) => {
        switch (type) {
            case 'email':
                return <InputComponent type="email" id="email" name="email" placeholder="exemplo@email.com" required />
            case 'password':
                return <>
                    <InputComponent type={passwordVisible ? 'text' : 'password'} id="password" name="password" placeholder="******" required />
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
                        <CheckboxComponent onCheckedChange={checked => {
                            setPasswordVisible(checked ? true : false)
                        }} />
                        <p>Mostrar a senha</p>
                    </div>
                </>
        }
    }

    return (
        <div>
            <label htmlFor={name} className="text-lg font-semibold">{label}</label>
            {
                getInputElement(type)
            }
        </div>
    )
}

export default InputMolecule