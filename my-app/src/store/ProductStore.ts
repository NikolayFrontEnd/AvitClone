import { makeObservable, observable, action, computed } from "mobx";
import axios from 'axios';
// все типы 
export interface Item {
  id: number;
  name: string;
  description: string;
  location: string;
  type: string;
  image?: string;
  propertyType?: string;
  area?: number;
  rooms?: number;
  price?: number;
  brand?: string;
  model?: string;
  year?: number;
  mileage?: number;
  serviceType?: string;
  experience?: number;
  cost?: number;
  workSchedule?: string;
  photo?:string
}
// отдельные типы для машины недвижимости и сервиса
export interface Car extends Item {
  brand: string;
  model: string;
  year: number;
  mileage?: number;
}

export interface Flat extends Item {
  propertyType: string;
  area: number;
  rooms: number;
  price?: number;
}

export interface Service extends Item {
  serviceType: string;
  experience: number;
  cost: number;
  workSchedule?: string;
}

class ProductStore {
  productList: Item[] = [];
  singleProduct: Item | null = null;
  carProducts: Car[] = [];
  flatProducts: Flat[] = [];
  serviceProducts: Service[] = [];
  page: number = 1;
  itemsPerPage: number = 5;

  constructor() {
      makeObservable(this, {
          productList: observable,
          singleProduct: observable,
          carProducts: observable,
          flatProducts: observable,
          serviceProducts: observable,
          receiveData: action,
          receiveOneProduct: action,
          deleteProduct: action,
          loadCars: action,
          loadFlats: action,
          loadServices: action,
          autoItems: computed,
          flatItems: computed,
          serviceItems: computed,
          page: observable,
      itemsPerPage: observable,
      setPage: action,
      paginatedProducts: computed,
      });
  }

  // Геттеры для всех категорий
  get autoItems(): Car[] {
      return this.productList.filter((item): item is Car => 
          item.type === "Авто" &&
          !!item.brand &&
          !!item.model &&
          !!item.year
      );
  }

  get flatItems(): Flat[] {
      return this.productList.filter((item): item is Flat => 
          item.type === "Недвижимость" &&
          !!item.propertyType &&
          !!item.area &&
          !!item.rooms
      );
  }
  get serviceItems(): Service[] {
      return this.productList.filter((item): item is Service => 
          item.type === "Услуги" &&
          !!item.serviceType &&
          !!item.experience &&
          !!item.cost
      );
  }
  get paginatedProducts(): Item[] {
    return this.productList.slice(0, this.page * this.itemsPerPage);
  }

  setPage = (newPage: number) => {
    this.page = newPage;
  };

  loadMore = () => { // загружаем следующую страницу с данными + 5
    this.setPage(this.page + 1);
  };

  get hasMore(): boolean {
    return this.page * this.itemsPerPage < this.productList.length;
  }
  loadCars = () => {
      this.carProducts = this.autoItems;
  };

  loadFlats = () => {
      this.flatProducts = this.flatItems;
  };

  loadServices = () => {
      this.serviceProducts = this.serviceItems;
  };
  // получаем все данные 
       receiveData = async () => {
        try {
          const res = await axios.get('/api/items');
          this.productList = res.data;
          console.log("Объект добавлен:", res.data);
        } catch (err) {
          console.error("Не удалось добавить объект!", err);
        }
      };
      // получаем определенный товар продукт 
      receiveOneProduct = async (id: number) => {
        try {
          const res = await axios.get(`/api/items/${id}`);
          this.singleProduct = res.data;

          console.log("Получен объект:", res.data);
        } catch (err) {
          console.error("Не удалось получить объект с id", id, err);
        }
      };
      deleteProduct = async(id:number)=>{
        try{
const del = await axios.delete(`/api/items/${id}`);
this.productList = this.productList.filter(item => item.id !== id);
console.log(del.data);
        }catch(err){
          console.error("Не удалось удалить!", err)
        }
      }
}
const prodStore = new ProductStore();
export default prodStore;
