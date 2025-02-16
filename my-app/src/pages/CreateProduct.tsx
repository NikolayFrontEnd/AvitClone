import {  useEffect, useState } from 'react';
import styles from './CreateProduct.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
interface ValidationErrors {
  name?: string;
  description?: string;
  location?: string;
  photo?: string;
  type?: string;
  propertyType?: string;
  area?: string;
  rooms?: string;
  price?: string;
  brand?: string;
  model?: string;
  year?: string;
  mileage?: string;
  serviceType?: string;
  experience?: string;
  cost?: string;
  workSchedule?: string;
}
const CreateProduct = () => {
  const [type, setType] = useState<string>('');
  const [step, setStep] = useState<number>(1);

  // Основная информация
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [photo, setPhoto] = useState<string>("");

  // Для недвижимости
  const [flat, setFlat] = useState({
    propertyType: '',
    area: 0,
    rooms: 0,
    price: 0,
  });

  // Для авто
  const [carData, setCarData] = useState({
    brand: '',
    model: '',
    year: 0,
    mileage: 0,
  });

  // Для услуг
  const [service, setService] = useState({
    serviceType: '',
    experience: 0,
    cost: 0,
    workSchedule: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

 const validateForm = ():ValidationErrors => {
    let errors:ValidationErrors = {};

    // Общая валидация для всех типов объявлений
    if (!name || name.length < 3 || name.length > 100) {
      errors.name = 'Название должно быть от 3 до 100 символов';
    }
    if (!description || description.length < 10 || description.length > 500) {
      errors.description = 'Описание должно быть от 10 до 500 символов';
    }
    if (!location || location.length < 3 || location.length > 100) {
      errors.location = 'Локация должна быть от 3 до 100 символов';
    }
    if (photo && photo.length<5) {
      errors.photo = 'Введите корректный URL для фото';
    }
    if (!type) {
      errors.type = 'Выберите тип объявления';
    }
    return errors;
  };


  const secondStepValidation = ():ValidationErrors=>{
     // Валидация для недвижимости
     if (type === 'Недвижимость') {
      if (!flat.propertyType) {
        errors.propertyType = 'Тип недвижимости обязателен';
      }
      if (flat.area <= 0) {
        errors.area = 'Площадь должна быть больше 0';
      }
      if (flat.rooms <= 0) {
        errors.rooms = 'Количество комнат должно быть больше 0';
      }
      if (flat.price <= 0) {
        errors.price = 'Цена должна быть больше 0';
      }
    }

    // Валидация для авто
    if (type === 'Авто') {
      if (!carData.brand) {
        errors.brand = 'Марка обязательна';
      }
      if (!carData.model) {
        errors.model = 'Модель обязательна';
      }
      if (carData.year < 1900 || carData.year > new Date().getFullYear()) {
        errors.year = 'Год выпуска должен быть от 1900 до текущего года';
      }
      if (carData.mileage <= 0) {
        errors.mileage = 'Пробег должен быть больше или равен 0';
      }
    }

    // Валидация для услуг
    if (type === 'Услуги') {
      if (!service.serviceType) {
        errors.serviceType = 'Тип услуги обязателен';
      }
      if (service.experience < 0) {
        errors.experience = 'Опыт работы должен быть больше или равен 0';
      }
      if (service.cost <= 0) {
        errors.cost = 'Стоимость должна быть больше 0';
      }
    }
    return errors;
  }
  // Состояние для сбора данных
  const product = { name, description, location, type, photo };

  const changeStep = (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      // Вместо alert, показывай ошибки на экране или просто логируй их
      setErrors(formErrors); // Обновляем ошибки
      return; // Прерываем выполнение функции, если есть ошибки
    }


    setErrors({}); // Очистить ошибки, если все поля валидны
    setStep(2);  // Переходим на следующий шаг
  };
  


useEffect(()=>{
  const safeData = localStorage.getItem('DATA');
  if (safeData) {
    const data = JSON.parse(safeData);
    setType(data.type);
    setName(data.name);
    setDescription(data.description);
    setLocation(data.location);
    setPhoto(data.photo);
    setFlat(data.flat);
    setCarData(data.carData);
    setService(data.service);
  }
},[])

const saveToLocalStorage = () => {
  const data = {
    type,
    name,
    description,
    location,
    photo,
    flat,
    carData,
    service
  };
  localStorage.setItem('DATA', JSON.stringify(data));
};


  // Обработчик для изменения данных
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
  
    const { name, value } = e.target;
    const newValue = (name === 'year' || name === 'mileage') ? Number(value) : value;
    setCarData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
    saveToLocalStorage();
  };
const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let answer;

    if (type === 'Авто') {
      answer = { ...product, ...carData };
    } else if (type === 'Недвижимость') {
      answer = { ...product, ...flat };
    } else if (type === 'Услуги') {
      answer = { ...product, ...service };
    }

    console.log(answer); 
    try {
      const res = await axios.post('/api/items', answer, {
        headers: {
          'Content-Type': 'application/json', 
        },
      });
      navigate("/list");
      console.log("Объявление размещено:", res.data);
      localStorage.removeItem('DATA');
    } catch (err) {
      console.error("Ошибка при отправке данных:",  answer);
    }



    const formErrors = secondStepValidation();
    
    if (Object.keys(formErrors).length > 0) {

      setErrors(formErrors); 
      return; 
    }

    setErrors({});
  }

  return (
    <>
      <div className={styles.container}>
        {step === 1 ? (
          <div className={styles.firstStep}>
            <h1 className={styles.title}>Форма размещения объявления</h1>
            <form className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="title" className={styles.label}>
                  Название
                </label>
                <input
                  id="title"
                  type="text"
                  className={styles.input}
                  placeholder="Введите название"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                {errors.name && <div className={styles.error}>{errors.name}</div>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.label}>
                  Описание
                </label>
                <textarea
                  id="description"
                  className={styles.textarea}
                  placeholder="Введите описание"
                  value={description}
                  onChange={(e)  => setDescription(e.target.value)}
                  
                  required
                />
         {errors.description && <div className={styles.error}>{errors.description}</div>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="location" className={styles.label}>
                  Локация
                </label>
                <input
                  id="location"
                  type="text"
                  className={styles.input}
                  placeholder="Введите локацию"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
    {errors.location && <div className={styles.error}>{errors.location}</div>}
              </div>

              <div className={styles.formGroup}>
  <label htmlFor="photo" className={styles.label}>
    Фото
  </label>
  <input
    id="photo"
    type="text"
    className={styles.input}
    value={photo}
    onChange={(e) => setPhoto(e.target.value)} 
  />
{errors.photo && <div className={styles.error}>{errors.photo}</div>}
</div>

              <div className={styles.formGroup}>
                <label htmlFor="category" className={styles.label}>
                  Категория объявления
                </label>
                <select
                  id="category"
                  className={styles.select}
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                >
                  <option value="">Выберите категорию</option>
                  <option value="Недвижимость">Недвижимость</option>
                  <option value="Авто">Авто</option>
                  <option value="Услуги">Услуги</option>
                </select>
                {errors.type && <div className={styles.error}>{errors.type}</div>}
              </div>

              <div className={styles.formGroup}>
                <button onClick={changeStep} type="submit" className={styles.submitButton}>
                  Следующий шаг
                </button>
              </div>
            </form>
          </div>
        ) : step === 2 && type === 'Авто' ? (
          <div className={styles.cars}>
            <h1 className={styles.title}>Форма для авто</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="brand" className={styles.label}>
                  Марка
                </label>
                <select
                  id="brand"
                  name="brand"
                  className={styles.select}
                  value={carData.brand}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Выберите марку</option>
                  <option value="toyota">Toyota</option>
                  <option value="ford">Ford</option>
                  <option value="bmw">BMW</option>
                  <option value="audi">Audi</option>
                  <option value="mercedes">Mercedes</option>
                </select>
                {errors.brand && <div className={styles.error}>{errors.brand}</div>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="model" className={styles.label}>
                  Модель
                </label>
                <input
                  id="model"
                  name="model"
                  type="text"
                  className={styles.input}
                  value={carData.model}
                  onChange={handleInputChange}
                  required
                />
          {errors.model && <div className={styles.error}>{errors.model}</div>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="year" className={styles.label}>
                  Год выпуска
                </label>
                <input
                  id="year"
                  name="year"
                  type="number"
                  className={styles.input}
                  value={carData.year}
                  onChange={handleInputChange}
                  required
                />
           {errors.year && <div className={styles.error}>{errors.year}</div>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="mileage" className={styles.label}>
                  Пробег (км)
                </label>
                <input
                  id="mileage"
                  name="mileage"
                  type="number"
                  className={styles.input}
                  value={carData.mileage}
                  onChange={handleInputChange}
                />
     {errors.mileage && <div className={styles.error}>{errors.mileage}</div>}
              </div>

              <div className={styles.formGroup}>
                <button  type="submit" className={styles.submitButton}>
                  Разместить объявление
                </button>
              </div>
            </form>
          </div>
        ) : step === 2 && type === 'Услуги' ? (
          <div className={styles.service}>
            <h1 className={styles.title}>Форма для услуги</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="service-type" className={styles.label}>
                  Тип услуги
                </label>
                <select
                  id="service-type"
                  className={styles.select}
                  value={service.serviceType}
                  onChange={(e) => setService({ ...service, serviceType: e.target.value })}
                  required
                >
                  <option value="">Выберите тип услуги</option>
                  <option value="repair">Ремонт</option>
                  <option value="cleaning">Уборка</option>
                  <option value="delivery">Доставка</option>
                  <option value="consulting">Консультации</option>
                </select>
                {errors.serviceType && <div className={styles.error}>{errors.serviceType}</div>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="experience" className={styles.label}>
                  Опыт работы (лет)
                </label>
                <input
                  id="experience"
                  type="number"
                  className={styles.input}
                  value={service.experience}
                  onChange={(e) => setService({ ...service, experience:Number(e.target.value) })}
                  required
                />
            {errors.experience && <div className={styles.error}>{errors.experience}</div>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="cost" className={styles.label}>
                  Стоимость
                </label>
                <input
                  id="cost"
                  type="number"
                  className={styles.input}
                  value={service.cost}
                  onChange={(e) => setService({ ...service, cost: Number(e.target.value) })}
                  required
                />
            {errors.cost && <div className={styles.error}>{errors.cost}</div>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="schedule" className={styles.label}>
                  График работы
                </label>
                <input
                  id="schedule"
                  type="text"
                  className={styles.input}
                  value={service.workSchedule}
                  onChange={(e) => setService({ ...service, workSchedule: e.target.value })}
                />
{errors.workSchedule && <div className={styles.error}>{errors.workSchedule}</div>}
              </div>

              <div className={styles.formGroup}>
                <button  type="submit" className={styles.submitButton}>
                  Разместить объявление
                </button>
            
              </div>
            </form>
          </div>
        ) : step === 2 && type === 'Недвижимость' ? (
          <div className={styles.flats}>
            <h1 className={styles.title}>Форма для недвижимости</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="property-type" className={styles.label}>
                  Тип недвижимости
                </label>
                <select
                  id="property-type"
                  className={styles.select}
                  value={flat.propertyType}
                  onChange={(e) => setFlat({ ...flat, propertyType: e.target.value })}
                  required
                >
                  <option value="">Выберите тип недвижимости</option>
                  <option value="apartment">Квартира</option>
                  <option value="house">Дом</option>
                  <option value="cottage">Коттедж</option>
                </select>
                {errors.propertyType && <div className={styles.error}>{errors.propertyType}</div>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="area" className={styles.label}>
                  Площадь (кв. м.)
                </label>
                <input
                  id="area"
                  type="number"
                  className={styles.input}
                  value={flat.area}
                  onChange={(e) => setFlat({ ...flat, area: Number(e.target.value) })}
                  required
                />
               {errors.area && <div className={styles.error}>{errors.area}</div>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="rooms" className={styles.label}>
                  Количество комнат
                </label>
                <input
                  id="rooms"
                  type="number"
                  className={styles.input}
                  value={flat.rooms}
                  onChange={(e) => setFlat({ ...flat, rooms: Number(e.target.value) })}
                  required
                />
            {errors.rooms && <div className={styles.error}>{errors.rooms}</div>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="price" className={styles.label}>
                  Цена
                </label>
                <input
                  id="price"
                  type="number"
                  className={styles.input}
                  value={flat.price}
                  onChange={(e) => setFlat({ ...flat, price: Number(e.target.value) })}
                  required
                />
          {errors.price && <div className={styles.error}>{errors.price}</div>}
              </div>

              <div className={styles.formGroup}>
                <button type="submit" className={styles.submitButton}>
                  Разместить объявление
                </button>
              </div>
            </form>
          </div>
        ) : null}
  </div> 
    </>

  );
};

export default CreateProduct;

