import React, { useEffect } from 'react';
import { Route} from 'react-router-dom'
import { App, ZMPRouter, AnimationRoutes, SnackbarProvider } from 'zmp-ui';
import { RecoilRoot } from 'recoil';

import HomePage from '../pages';
import Product from '../pages/product/index';
import Category from '../pages/category/index';
import Cart from '../pages/cart/index';
import Checkout from '../pages/checkout/index';
import HeaderCustom from "../components/header/index";
import FooterCustom from "../components/footer/index";
import CategoryItems from '../pages/category-items';
import Member from '../pages/member';
import Search from '../pages/search';
import Address from '../pages/address';
import HistoryOrder from '../pages/history-orders';

const MyApp = () => {
  localStorage.removeItem('isAuth')
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL
    let api_url = API_URL.replace('/mini_app_api', '')

    const script = document.createElement("script");
    script.src = `${api_url}/address-zalo-mini-app/84.min.js?v=${Date.now()}`;
    script.async = true; // Đảm bảo script được tải không chặn DOM
    script.id= "84"
    
    console.log(script, "scripttt")

    document.head.appendChild(script);
    
    // Xóa thẻ script khi component bị unmount
    return () => {
      document.head.removeChild(script);
    };
  }, [])

  return (
    <RecoilRoot>
      <App >
      <SnackbarProvider>
        <ZMPRouter>
          <HeaderCustom />
          <AnimationRoutes>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/product/:id" element={<Product />}></Route>
            <Route path="/categories" element={<Category />}></Route>
            <Route path="/cart" element={<Cart />}></Route>
            <Route path="/checkout" element={<Checkout />}></Route>
            <Route path="/categories/:id" element={<CategoryItems />}></Route>
            <Route path="/member" element={<Member />}></Route>
            <Route path="/search" element={<Search />}></Route>
            <Route path="/address" element={<Address />}></Route>
            <Route path="/history-order" element={<HistoryOrder />}></Route>
          </AnimationRoutes>
          <FooterCustom />
        </ZMPRouter>
      </SnackbarProvider>
      </App>
    </RecoilRoot>
  );
}
export default MyApp;