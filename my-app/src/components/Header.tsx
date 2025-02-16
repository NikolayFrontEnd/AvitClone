import React, {useEffect, useState } from "react";
import styles from "./Header.module.css"
import { Link } from "react-router-dom";
const Header:React.FC = () => {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
      const storedUserId = localStorage.getItem('userId');
      setToken(storedUserId);
    }, []);

    const deleteToken = () => {
        localStorage.removeItem('userId');
        setToken(null);
    };
    
   return (
        <div className={styles.header}>
            {!token ? (
                <Link to="/registration">
                    <div className={styles.welcome} 
        >
                        Вход и регистрация
                    </div>
                </Link>
            ) : (
                <div onClick={deleteToken} className={styles.welcome}>
                    Выход
                </div>
            )}
        </div>
    );
}

export default Header;