import { Link, useParams } from "react-router-dom";
import prodStore, { Flat, Service, Car } from "../store/ProductStore";
import { observer } from "mobx-react";
import { useEffect } from "react";
import styles from './AllProduc.module.css'
const FilterProduct = observer(() => {
    const { id } = useParams<{ id: string }>();
    
    // Загрузка данных при монтировании компонента
    useEffect(() => {
        if (prodStore.productList.length === 0) {
            prodStore.receiveData();
        }
    }, []);

    if (!id) return <div>Категория не указана</div>;
    
    // Выбираем данные в зависимости от категории
    let items;
    let title;
    
    switch(id) {
        case 'Авто':
            items = prodStore.autoItems;
            title = 'Автомобили';
            break;
        case 'Недвижимость':
            items = prodStore.flatItems;
            title = 'Недвижимость';
            break;
        case 'Услуги':
            items = prodStore.serviceItems;
            title = 'Услуги';
            break;
        default:
            return <div>Неизвестная категория: {id}</div>;
    }

    if (items.length === 0) {
        return(<>
                    <div className = {styles.title}>В категории "{title}" пока нет объявлений</div>
               <Link to = "/"><button className={styles.btn}>Вернуться</button></Link>  
        </>

        )
    }

    return (
        <div className={styles.categoryContainer}>
            <h1>{title}</h1>
            <div className={styles.productContainer}>
                {items.map(item => (
                    <div key={item.id} className={styles.productCard}>
                        {item.image && (
                            <img 
                                src={item.image} 
                                alt={item.name} 
                                className={styles.productImage}
                            />
                        )}
                        <div>
                            <h2 className={styles.productTitle}>{item.name}</h2>
                            <p className={styles.productDescription}>{item.description}</p>
                            <p className={styles.productLocation}>{item.location}</p>
                            
                            {/* Специфичные поля для категорий */}
                            {id === 'Авто' && (
                                <div>
                                    <p>Марка: {(item as Car).brand}</p>
                                    <p>Модель: {(item as Car).model}</p>
                                    <p>Год выпуска: {(item as Car).year}</p>
                                    {(item as Car).mileage && 
                                        <p>Пробег: {(item as Car).mileage} км</p>}
                                </div>
                            )}
                            
                            {id === 'Недвижимость' && (
                                <div>
                                    <p>Тип: {(item as Flat).propertyType}</p>
                                    <p>Площадь: {(item as Flat).area} м²</p>
                                    <p>Комнат: {(item as Flat).rooms}</p>
                                    {(item as Flat).price && 
                                        <p>Цена: {(item as Flat).price} ₽</p>}
                                </div>
                            )}
                            
                            {id === 'Услуги' && (
                                <div>
                                    <p>Тип услуги: {(item as Service).serviceType}</p>
                                    <p>Опыт: {(item as Service).experience} лет</p>
                                    <p>Стоимость: {(item as Service).cost} ₽</p>
                                    {(item as Service).workSchedule && 
                                        <p>График: {(item as Service).workSchedule}</p>}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default FilterProduct;