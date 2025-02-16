import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import prodStore from "../store/ProductStore";
import styles from './OneProduct.module.css';
import { observer } from "mobx-react";
const AutoContent = () => (
  <div className={styles.productDetailsSection}>
    <h3>Автомобиль</h3>
    <p><strong>Марка:</strong> {prodStore.singleProduct?.brand}</p>
    <p><strong>Модель:</strong> {prodStore.singleProduct?.model}</p>
    <p><strong>Год:</strong> {prodStore.singleProduct?.year}</p>
    <p><strong>Пробег:</strong> {prodStore.singleProduct?.mileage} км</p>
  </div>
);
const ServiceContent = () => (
  <div className={styles.productDetailsSection}>
    <h3>Услуга</h3>
    <p><strong>Тип услуги:</strong> {prodStore.singleProduct?.serviceType}</p>
    <p><strong>Опыт:</strong> {prodStore.singleProduct?.experience}</p>
    <p><strong>Стоимость:</strong> {prodStore.singleProduct?.cost} ₽</p>
    <p><strong>График работы:</strong> {prodStore.singleProduct?.workSchedule}</p>
  </div>
);
const RealEstateContent = () => (
  <div className={styles.productDetailsSection}>
    <h3>Недвижимость</h3>
    <p><strong>Тип недвижимости:</strong> {prodStore.singleProduct?.propertyType}</p>
    <p><strong>Площадь:</strong> {prodStore.singleProduct?.area} м²</p>
    <p><strong>Количество комнат:</strong> {prodStore.singleProduct?.rooms}</p>
    <p><strong>Цена:</strong> {prodStore.singleProduct?.price} ₽</p>
  </div>
);
const ShowContent = () => {

  if (prodStore.singleProduct?.type === 'Авто') return <AutoContent />;
  if (prodStore.singleProduct?.type === 'Услуги') return <ServiceContent />;
  if (prodStore.singleProduct?.type === 'Недвижимость') return <RealEstateContent />;
  return null;
};
const OneProduct: React.FC = observer(() => {
  const [token, setToken] = useState<string | null>(null);
  
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setToken(storedUserId);
  }, []);
  const { id } = useParams();
const newId = Number(id)
  useEffect(() => {

    prodStore.receiveOneProduct(newId);
  }, [newId]); 

  if (!prodStore.singleProduct) {
    return <div>Загрузка...</div>; 
  }
  return (
    <div className={styles.productDetailContainer}>
      <img
        src={prodStore.singleProduct.photo}
        alt={prodStore.singleProduct?.name}
        className={styles.productImage}
      />
      <h2 className={styles.productTitle}>{prodStore.singleProduct?.name}</h2>
      <p className={styles.productDescription}>{prodStore.singleProduct?.description}</p>
      
      <ShowContent />
      
      <div className={styles.buttonsContainer}>
        <Link to={`/form/${prodStore.singleProduct?.id}`}>
        {token &&  <button className={`${styles.editButton}`}>Редактировать</button> }
        </Link>
        <Link to="/list">
        {token && <button
            className={`${styles.deleteButton}`}
            onClick={() => prodStore.deleteProduct(newId)}
          >
            Удалить
          </button>}

        </Link>
      </div>
    </div>
  );
});
export default OneProduct;