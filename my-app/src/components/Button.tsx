import { Link } from "react-router-dom";
import styles from "./Header.module.css"
const Button:React.FC = () => {
    
    return (
        <>
     <Link to = "/form">       <div className = {styles.button}>
     
Разместить объявления

        </div></Link>
        </>
    )
}

export default Button;