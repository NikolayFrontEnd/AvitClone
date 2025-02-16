import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import Header from "./components/Header";
import AllProducts from "./pages/AllProducts";
import CreateProduct from "./pages/CreateProduct";
import OneProduct from "./pages/OneProduct";
import EditProduct from "./pages/EditProduct";
import FilterProduct from "./pages/FilterProduct";
import Registration from "./pages/Registration";
const App = () => {
  console.log('helofed')
  return (
<>
<BrowserRouter>
<Header/>
<Routes>
<Route path = '/' element = {<Main/>}/>
<Route path = '/list' element = {<AllProducts/>}/>
<Route path = '/form' element = {<CreateProduct/>}/>
<Route path = '/item/:id' element = {<OneProduct/>}/>
<Route path = '/form/:id' element = {<EditProduct/>}/>
<Route path = '/special/:id' element = {<FilterProduct/>}/>
<Route path = '/registration' element = {<Registration/>}/>
</Routes>
</BrowserRouter>
</>
  );
};
export default App;
