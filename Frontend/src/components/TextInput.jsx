export default function TextInput({name, value, onChange, maxLength}) {
    const placeholder = name.charAt(0).toUpperCase() + name.slice(1);
    
    return (
        <div className="credentials_input">
            <input
                className='outline-none w-full'
                name={name}
                value={value}
                onChange={onChange} 
                placeholder={placeholder}
                maxLength={maxLength || 100}
            />
        </div>
    )
}