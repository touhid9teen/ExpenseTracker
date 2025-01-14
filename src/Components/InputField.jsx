
const InputField = ({type,placeholder, customClass, value, onChange}) => {
    return (
        <input 
            type={type}
            placeholder={placeholder}
            className={customClass}
            value={value}
            
            onChange={onChange}
         />
    )
}
export default InputField;