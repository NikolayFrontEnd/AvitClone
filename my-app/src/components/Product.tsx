import React from 'react';
import styles from './Product.module.css';
import car from '../assets/cars.png';
import flat from '../assets/flatspng.png';
import bag from '../assets/bag.png';
import { Link } from 'react-router-dom';

const Product: React.FC = () => {
    return (
      <div className={styles.conteiner}>
        <Link  to={`/special/Авто`} className={styles.cars}>
          <div className={styles.words}>Авто</div>
          <img src={car} alt="Car" />
        </Link>
  
        <Link to={`/special/Недвижимость`} className={styles.flats}>
          <div className={styles.words}>Недвижи-<br />мость</div>
          <img src={flat} alt="Flat" />
        </Link>
  
        <Link to={`/special/Услуги`} className={styles.work}>
          <div className={styles.words}>Работа</div>
          <img src={bag} alt="Bag" />
        </Link>
      </div>
    );
  }
export default Product;
