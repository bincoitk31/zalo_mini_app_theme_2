import React, { Suspense, useEffect, useState } from "react";
import { Page } from "zmp-ui";
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil";
import { carouselState } from "../recoil/atoms";
import { categoryStore, categoriesState, categoryChooseState, categoriesHomeState } from "../recoil/category";
import { useNavigate } from "react-router-dom";
import { Input, Button } from "antd";
import { authorize, getPhoneNumber, getAccessToken, getUserInfo } from "zmp-sdk/apis";
import { getApiAxios } from '../utils/request';
import { memberZaloState, phoneMemberZaloState } from "../recoil/member";

import Carousel from "../components/carousel";
import ListCategory from "../components/list-categoy";
import ProductList from "../components/product-list";
import FollowOA from "../components/follow-oa";

import settings from "../../app-settings.json";

const HomePage = () => {
  const CATEGORIES_HOME = settings ?.categories_home || []

  const navigate = useNavigate()
  const carousel = useRecoilValue(carouselState)
  const [categories, setCategories] = useRecoilState(categoriesState)
  const [memberZalo ,setMemberZalo] = useRecoilState(memberZaloState)
  const [categoryChoose, setCategoryChoose] = useRecoilState(categoryChooseState)
  const setPhoneMemberZalo = useSetRecoilState(phoneMemberZaloState)
  const [categoriesHome, setCategoriesHome] = useRecoilState(categoriesHomeState)

  const getUser = async () => {
    try {
      const { userInfo } = await getUserInfo({});
      console.log(userInfo, "userInfooo")
      setMemberZalo(userInfo)
      console.log(memberZalo)
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error)
    }
  }

  const getTokenUser = async () => {
    try {
      let token = await getAccessToken({});
      console.log(token, "rrrrrrrr")
      return token
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error, "error get tokenn");
      return null
    }
  };

  const getCode = async () => {
    try {
      let res = await getPhoneNumber({})
      return res.token
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const getPhoneNumberFromToken = async () => {
    let token = await getTokenUser()
    let code = await getCode()
    let secretKey = import.meta.env.VITE_ZALO_SECRET_KEY

    console.log(token, "TÔkenn")
    console.log(code, "codeeee")

    let url = "https://graph.zalo.me/v2.0/me/info"
    let options = {
      code: code,
      access_token: token,
      secret_key: secretKey,
    }
    console.log(options, "optionss")
    getApiAxios(url, {headers: options})
    .then(res => {
      console.log(res, "getPHONEEEE")
      if (res.status == 200) {
        setPhoneMemberZalo(res.data.data.number)
        // get thông tin khách hàng qua sdt từ store
      }
    })
    .catch(err => console.log("get phonenumber error", err))
  }

  const authorizeUser = async () => {
    try {
      const data = await authorize({
        scopes: ["scope.userPhonenumber", "scope.userInfo"],
      });
      console.log(data, "AUthh");
      localStorage.setItem('isAuth', true)
      if (data['scope.userPhonenumber'] && data['scope.userInfo']) {
        //get sdt khách
        getUser()
        getPhoneNumberFromToken()
      }

    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  };

  const renderProductsCategories = (category) => {
    console.log(category, "categoryyy")
    return (
      <div className="mt-4" key={category.id}>
        <div className="flex justify-between font-bold pb-2">
          <span className="text-[14px]">{category.name}</span>
          <span onClick={() => goToCategory(category.id)}>Tất cả</span>
        </div>
        <ProductList products={category.products} />
      </div>
    )
  }

  const goToCategory = (id) => {
    setCategoryChoose(id)
    navigate('/categories')
  }

  const goTo = (path) => {
    navigate(path)
  }

  const fetchCategories = async () => {
    const updatedCategories = []

    for (const category of CATEGORIES_HOME) {
      try {
        const res = await categoryStore("getCategoryById", { id: category.id });

        if (res.status === 200) {
          if (res.data.products && res.data.products.data.length > 0) {
            updatedCategories.push({
              ...category,
              products: res.data.products,
            });
          }

        }
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    }
    setCategoriesHome(updatedCategories)
  }

  const getCategories = async () => {
    const res = await categoryStore('getCategories')
    console.log(res, "get Categoriesssss")
    if (res.status == 200) {
      setCategories(res.data.categories)
    }
  }

  useEffect(() => {
    // if (!localStorage.getItem("isAuth")) {
    //   authorizeUser()
    // }
  }, [])

  useEffect(() => {
    
  }, [])

  useEffect(() => {
    if (categoriesHome.length === 0) fetchCategories()
    if (categories.length === 0) getCategories()
  }, [])

  return (
    <Page className="page">
      <div className="flex h-[52px] bg-[#000] p-2">
        <div>
          <img src={memberZalo.avatar} className="w-[36px] h-[36px] rounded-full"/>
        </div>
        <div className="pl-2 text-[#fff] text-[12px]">
          <div>Xin chào,</div>
          <div className="font-bold">{memberZalo.name}</div>
        </div>
      </div>
      {/* <div className="relative h-[100px] bg-[#fff]">
        <div className="mx-2 bg-[#fff] rounded-lg absolute top-[-37px] w-[calc(100%-16px)] border border-solid border-[#f8f4f4]">
          <div className=" border-b border-b-solid border-b-[#f8f4f4]">
            <div className="p-2 flex justify-between">
              <div className="text-green-600">Member</div>
              <div className="flex items-center">
                <Star size={18} color="#fadb14" weight="fill" />
                <span className="pl-2">0</span>
                <CaretRight size={14} color="#292829" weight="thin" />
              </div>
            </div>
          </div>
          <div className="">
            
            <div className="flex justify-between p-2">
              <div className={`flex flex-col items-center w-[60px]}`} onClick={() => handleChangeType('1')} >
                <div className={`text-[#5e636a] flex items-center justify-center border border-solid border-[#cdd8df] w-[36px] h-[36px] rounded-full bg-[#e2e8ec]`}>
                <ShoppingBag size={24} color="#212121" weight="duotone" />
                </div>
                <div className="text-[12px] text-center pt-1">Mua hàng</div>
              </div>
              <div className={`flex flex-col items-center w-[60px]`} onClick={() => handleChangeType('2')}>
                <div className={`text-[#5e636a] flex items-center justify-center border border-solid border-[#cdd8df] w-[36px] h-[36px] rounded-full bg-[#e2e8ec] `}>
                  <Gift size={24} color="#212121" weight="duotone" />
                </div>
                <div className="text-[12px] text-center pt-1">Ưu đãi của tôi</div>
              </div>
              <div className={`flex flex-col items-center w-[60px]`} onClick={() => goTo('/history-order')}>
                <div className={`text-[#5e636a] flex items-center justify-center border border-solid border-[#cdd8df] w-[36px] h-[36px] rounded-full bg-[#e2e8ec]`}>
                  <ShoppingCart size={24} color="#212121" weight="duotone"/>
                </div>
                <div className="text-[12px] text-center pt-1">Lịch sử đơn hàng</div>
              </div>
              <div className={`flex flex-col items-center w-[60px]`} onClick={() => handleChangeType('3')}>
                <div className={`text-[#5e636a] flex items-center justify-center border border-solid border-[#cdd8df] w-[36px] h-[36px] rounded-full bg-[#e2e8ec]`}>
                  <Truck size={24} color="#212121" weight="duotone" />
                </div>
                <div className="text-[12px] text-center pt-1">Theo dõi đơn hàng</div>
              </div>
            </div>
            
          </div>
        </div>
      </div> */}
      

      <div className="p-2 mb-2 bg-[#fff]">
        <Carousel images={carousel}/>
      </div>

      <FollowOA />

      <Suspense>
        <div className="section-container">
          <ListCategory />
          { categoriesHome.map(el => renderProductsCategories(el)) }
        </div>
      </Suspense>
      <div className="mb-[50px]"></div>
    </Page>
  );
};

export default HomePage;
