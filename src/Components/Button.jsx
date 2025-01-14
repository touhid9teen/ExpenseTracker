
const Button = ({onClick, title, customButtonClass}) => {
  return (
    <button onClick={onClick} className={`${customButtonClass}`}>{title}</button>
  );
}
export default Button;