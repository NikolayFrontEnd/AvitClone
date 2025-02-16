import React from "react";
import photo from '../assets/Avito.png'
import styles from './SearchPannel.module.css';
import { Link } from "react-router-dom";
const SearchPannel:React.FC = () => {
    return (
        <>
<div className = {styles.conteiner}>

    <div>
  <img src = {photo}/>
    </div>
    
    <Link to = "/list">  
     <div className = {styles.button}>   
      Список всех объявлений
    </div> 
    </Link>
</div>
        </>
    )
}

export default SearchPannel;