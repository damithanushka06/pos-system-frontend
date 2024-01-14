import {BrowserRouter, Routes, Route} from 'react-router-dom';
import ProtectedRoutes from "./utils/ProtectedRoutes";
import Register from "./views/auth/Register";
import Login from "./views/auth/Login";
import Home from "./views/home/Home";
import ManageItem from "./views/item/ManageItems";
import ManageCategories from "./views/category/ManageCategoryies";
import ManageOrders from "./views/order/ManageOrders";

const App = () => { //Main Component
    return (
        <BrowserRouter>
            <Routes>

                <Route element={<ProtectedRoutes/>}>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/item-management" element={<ManageItem/>}/>
                    <Route path="/category-management" element={<ManageCategories/>}/>
                    <Route path="/order-management" element={<ManageOrders/>}/>
                </Route>


                <Route path="/register" element={<Register/>}/>
                <Route path="/login" element={<Login/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App;
