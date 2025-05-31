import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

export default function PasswordInput({ name, value, onChange }) {
    const [showPassword, setShowPassword] = useState(false);

    const handleEyeClick = () => {
        setShowPassword((prev) => !prev);
    }


    return (
        <div className='credentials_input flex items-center justify-between'>
            <input
                className='outline-none w-full'
                name={name}
                value={value}
                type={showPassword ? 'text' : 'password'}
                onChange={onChange}
                placeholder= {name === "password" ? "Password" : "Confirm password"} 
            />

            {showPassword ? (
                <FaRegEye className='cursor-pointer mr-1' onClick={handleEyeClick} />
            ) : (
                <FaRegEyeSlash className='cursor-pointer mr-1 size-4' onClick={handleEyeClick} />
            )}
        </div>
    )
}