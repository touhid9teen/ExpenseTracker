const InputField = ({type, placeholder, customClass, value, onChange, darkMode}) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            className={`cyber-input w-full px-1 py-2.5 text-sm font-medium ${
                darkMode ? "text-slate-100 placeholder-slate-500" : "text-slate-800 placeholder-slate-400"
            } ${customClass || ""}`}
            value={value}
            onChange={onChange}
        />
    )
}
export default InputField;
