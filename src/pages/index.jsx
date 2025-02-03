import React, { Suspense, useEffect, useState } from "react";
import { Page } from "zmp-ui";
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil"
import { carouselState } from "../recoil/atoms";
import { categoryStore, categoriesState, categoryChooseState  } from "../recoil/category";
import { useNavigate } from "react-router-dom";
import { Gift, ShoppingBag, ShoppingCart, Truck, Star, CaretRight } from "@phosphor-icons/react";
import { Input, Button } from "antd";
import { authorize, getPhoneNumber, getAccessToken, getUserInfo } from "zmp-sdk/apis";
import { getApiAxios } from '../utils/request';
import { memberZaloState, phoneMemberZaloState } from "../recoil/member"

import Carousel from "../components/carousel";
import ProductGrid from "../components/product-grid";
import ListCategory from "../components/list-categoy";
import ProductList from "../components/product-list";

const HomePage = () => {
  const navigate = useNavigate()
  const carousel = useRecoilValue(carouselState)
  const [categories, setCategories] = useRecoilState(categoriesState)
  const [memberZalo ,setMemberZalo] = useRecoilState(memberZaloState)
  const [categoryChoose, setCategoryChoose] = useRecoilState(categoryChooseState)
  const setPhoneMemberZalo = useSetRecoilState(phoneMemberZaloState)

  const [grid1, setGrid1] = useState({data: []})
  const [grid2, setGrid2] = useState({data: []})

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

  const goToCategory = (id) => {
    setCategoryChoose(id)
    navigate('/categories')
  }

  useEffect(() => {
    if (!localStorage.getItem("isAuth")) {
      authorizeUser()
    }
  }, [])

  useEffect(() => {
    categoryStore('getCategories')
    .then(res => {
      if (res.status == 200) {
        setCategories(res.data.categories)
      }
    })
  }, [])

  useEffect(() => {
    if (categories.length < 3) return
    categoryStore('getCategoryById', {id: categories[1] ?.id})
      .then(res => {
        if (res.status == 200) setGrid1(res.data.products)
      })
    
    categoryStore('getCategoryById', {id: categories[2] ?.id})
      .then(res => {
        if (res.status == 200) setGrid2(res.data.products)
      })
  }, [categories])

  return (
    <Page className="page">
      <div className="flex h-[100px] bg-[#000] p-2">
        <div>
          <img src={memberZalo.avatar} className="w-[36px] h-[36px] rounded-full"/>
        </div>
        <div className="pl-2 text-[#fff] text-[12px]">
          <div>Xin chào,</div>
          <div className="font-bold">{memberZalo.name}</div>
        </div>
      </div>
      <div className="relative h-[100px] bg-[#fff]">
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
              <div className={`flex flex-col items-center w-[60px]`} onClick={() => handleChangeType('4')}>
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
      </div>
      

      <div className="p-2 mb-2 bg-[#fff]">
        <Carousel images={carousel}/>
      </div>
      <div className="p-2">
        <div className="p-2 border border-solid border-[#000] rounded-lg bg-[#f2f2f2]">
          <div className="border-b border-b-solid border-[#fff] pb-2">Quan tâm OA để nhận các đặc quyền ưu đãi </div>
          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center">
              <img className="w-[30px] h-[30px] rounded-full bg-[#fff]" src="https://content.pancake.vn/1/s900x900/fwebp/ef/a5/21/80/6c8c38d77a6e2788c681255b20e0b13068010b1eba28895384246920.png" />
              <div className="font-bold pl-2"> PCSG </div>
            </div>
            <Button color="default" variant="solid" className="font-bold text-[12px] rounded-full">Quan tâm</Button>
          </div>
        </div>
      </div>
      <Suspense>
        <div className="section-container">
          <ListCategory />
          {grid1 ?.data.length > 0 &&
            (
              <div className="mt-4" >
               <div className="flex justify-between font-bold pb-2">
                  <span className="text-[14px]">{categories[1] ?.name}</span>
                  <span onClick={() => goToCategory(categories[1] ?.id)}>Tất cả</span>
                </div>
                <ProductList products={grid1} />
              </div>
            )
          
          }
          {grid2 ?.data.length > 0 &&
            (
              <div className="mt-4">
                <div className="flex justify-between font-bold pb-2">
                  <span className="text-[14px]">{categories[2] ?.name}</span>
                  <span onClick={() => goToCategory(categories[2] ?.id)}> Tất cả</span>
                </div>
                <ProductList products={grid2} />
              </div>
            )
          }
        </div>
      </Suspense>
      <div className="mb-[50px]"></div>
    </Page>
  );
};

export default HomePage;
