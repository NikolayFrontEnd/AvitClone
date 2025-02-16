
import React, { useEffect, useRef, useState } from 'react'
import Button from '../components/Button';
import prodStore, { Item } from '../store/ProductStore';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import styles from './AllProduc.module.css';


const ShowContent = (product: any) => {

  return (
    <>
      <img
        src={product.photo}
        alt={product.name}
        className={styles.productImage}
      />
      <h3 className={styles.productTitle}>{product.name}</h3>
      <p className={styles.productDescription}>{product.description}</p>
      <p className={styles.productLocation}>{product.location}</p>
    </>
  );
};

const AllProducts: React.FC = observer(() => {

  // тут буду хранить состояние для input:
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    prodStore.receiveData();
    const handleScroll = () => {
      if (
        containerRef.current &&
        window.innerHeight + window.scrollY >= containerRef.current.offsetHeight - 500 &&
        !isLoading &&
        prodStore.hasMore
      ) {
        setIsLoading(true);
        setTimeout(() => {
          prodStore.loadMore();
          setIsLoading(false);
        }, 1000);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [])
// Храним вводимые значения (поля фильтра)
const [word, setWord] = useState<string>('');
const [searchedTerm, setSearchedTerm] = useState<string>('');

// Состояния для инпутов (фильтры)
const [description, setDescription] = useState('');
const [location, setLocation] = useState('');
const [propertyType, setPropertyType] = useState('');
const [area, setArea] = useState<number | null>(null);
const [rooms, setRooms] = useState<number | null>(null);
const [price, setPrice] = useState<number | null>(null);
const [brand, setBrand] = useState('');
const [model, setModel] = useState('');
const [year, setYear] = useState<number | null>(null);
const [mileage, setMileage] = useState<number | null>(null);
const [serviceType, setServiceType] = useState('');
const [experience, setExperience] = useState<number | null>(null);
const [cost, setCost] = useState<number | null>(null);
const [workSchedule, setWorkSchedule] = useState('');

// Обработчик ввода
const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
  setWord(e.target.value);
};

// Обработчик нажатия на кнопку "Поиск"
const handleSearch = () => {
  setSearchedTerm(word);
};

// Фильтрация происходит **только после нажатия на кнопку**
const searchParams = {
  name: searchedTerm.toLowerCase().trim(),
  description: description.toLowerCase().trim(),
  location: location.toLowerCase().trim(),
  propertyType: propertyType.toLowerCase().trim(),
  area: area,
  rooms: rooms,
  price: price,
  brand: brand.toLowerCase().trim(),
  model: model.toLowerCase().trim(),
  year: year,
  mileage: mileage,
  serviceType: serviceType.toLowerCase().trim(),
  experience: experience,
  cost: cost,
  workSchedule: workSchedule.toLowerCase().trim(),
};

// Фильтрация товаров



// Фильтрация товаров 
const matchedProducts = prodStore.productList.filter((product) => {
  return Object.entries(searchParams).every(([key, value]) => {
    if (!value) return true; // Игнорируем пустые поля

    // Если value - строка, применяем toLowerCase()
    if (typeof value === "string" && key in product) {
      // Убедимся, что product[key] действительно строка
      const productValue = product[key as keyof Item];
      if (typeof productValue === "string") {
        return productValue.toLowerCase().includes(value);
      }
      return false; // Если product[key] не строка, то игнорируем этот фильтр
    }

    // Если value - число, проверяем его
    if (typeof value === "number" && key in product) {
      const productValue = product[key as keyof Item];
      if (typeof productValue === "number") {
        return productValue >= value;
      }
      return false; // Если product[key] не число, то игнорируем этот фильтр
    }

    return false; // Если значение не подходит, фильтруем
  });
});

// Итоговый список (сначала найденные товары, затем все остальные)
const displayProducts = searchedTerm
  ? [
      ...matchedProducts,
      ...prodStore.productList.filter((product) => !matchedProducts.includes(product))
    ]
  : prodStore.productList;

// Компонент отображения "Товар не найден"
const ShowWords = () => {
  return <div className={styles.notFoundMessage}>Товар не найден!</div>;
};

//тут будет работа с фильтрами

const [filter, setFilter] = useState<boolean>(false);
// null - не выбрано. 1 - недвижимость  2 - авто 3 - услуги
const [typeFilter, setTypeFilter] = useState<number | null>(null);
// 0 - не выбраны подфильтры; 1  2 3 4 5 6 7 8  9

const chooseFilter = () => {
  setFilter((prev) => !prev);
  setTypeFilter(null)
}
const chooseAuto = () =>{
setTypeFilter(2);

}

const chooseFlat = () =>{
  setTypeFilter(1);

}

const chooseServices = () =>{
  setTypeFilter(3);
}


  return (
    <div ref={containerRef}>
      <div className={styles.seachSection}>    
        <Button />
        <input 
          placeholder="Введите название товара:" 
          className={styles.input}
          value={word}
          onChange={handleInput}
        />
        <button className={styles.btnSearch} onClick={handleSearch}>
          Поиск
        </button>
      </div>
      <button  className = {styles.filter} onClick = {chooseFilter}>Фильтр</button>


        <div >      

        {     filter && (
                <div className = {styles.showContent}>

                <div className = {styles.filterWordBlock} onClick = {chooseAuto}>Авто</div>
                <div className = {styles.filterWordBlock} onClick = {chooseFlat}>Недвижимость</div>
                <div className = {styles.filterWordBlock} onClick = {chooseServices}>Услуги</div>
                
              </div>)
        }


  {/* Основные поля для всех */}
  

  {/* Подменю для авто */}
  {filter && typeFilter === 2 && (
    
    <div className={styles.CarFilter}>


      <input
        type="text"
        placeholder="Описание"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Локация"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />


      <select value={brand} onChange={(e) => setBrand(e.target.value)} required>
        <option value="">Выберите марку</option>
        <option value="toyota">Toyota</option>
        <option value="ford">Ford</option>
        <option value="bmw">BMW</option>
        <option value="audi">Audi</option>
      </select>
      <input
        type="text"
        placeholder="Модель"
        value={model}
        onChange={(e) => setModel(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Год выпуска"
        value={year ?? ''}
        onChange={(e) => setYear(Number(e.target.value))}
        required
      />
      <input
        type="number"
        placeholder="Пробег (км)"
        value={mileage ?? ''}
        onChange={(e) => setMileage(Number(e.target.value))}
      />
    </div>
  )}

  {/* Подменю для недвижимости */}
  {filter && typeFilter === 1 && (
    <div className={styles.flatFilter}>


      <input
        type="text"
        placeholder="Описание"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Локация"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />

      <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} required>
        <option value="">Выберите тип недви...</option>
        <option value="apartment">Квартира</option>
        <option value="house">Дом</option>
        <option value="cottage">Коттедж</option>
      </select>
      <input
        type="number"
        placeholder="Площадь (кв. м.)"
        value={area ?? ''}
        onChange={(e) => setArea(Number(e.target.value))}
        required
      />
      <input
        type="number"
        placeholder="Количество комнат"
        value={rooms ?? ''}
        onChange={(e) => setRooms(Number(e.target.value))}
        required
      />
      <input
        type="number"
        placeholder="Цена"
        value={price ?? ''}
        onChange={(e) => setPrice(Number(e.target.value))}
        required
      />
    </div>
  )}

  {/* Подменю для услуг */}
  {filter && typeFilter === 3 && (
    <div className={styles.serviceFilter}>





      <input
        type="text"
        placeholder="Описание"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Локация"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />

      <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} required>
        <option value="">Выберите тип услуги</option>
        <option value="repair">Ремонт</option>
        <option value="cleaning">Уборка</option>
        <option value="delivery">Доставка</option>
        <option value="consulting">Консультации</option>
      </select>
      <input
        type="number"
        placeholder="Опыт работы (лет)"
        value={experience ?? ''}
        onChange={(e) => setExperience(Number(e.target.value))}
        required
      />
      <input
        type="number"
        placeholder="Стоимость"
        value={cost ?? ''}
        onChange={(e) => setCost(Number(e.target.value))}
        required
      />
      <input
        type="text"
        placeholder="График работы"
        value={workSchedule}
        onChange={(e) => setWorkSchedule(e.target.value)}
      />
    </div>
  )}
        </div>

      <div className={styles.wordH}> 
        <h2>Список объявлений</h2>
      </div>
      {searchedTerm && matchedProducts.length === 0 && (
<ShowWords/>
      )}
      <div className={styles.productContainer}>
        {displayProducts.map((prod) => (
          <div key={prod.id} className={styles.productCard}>
            {ShowContent(prod)}
            <Link to={`/item/${prod.id}`}>
              <button
                className={styles.productButton}
              >
                Открыть
              </button>
            </Link>
     
          </div>
        ))}
      </div>
    </div>
  );
});

export default AllProducts;