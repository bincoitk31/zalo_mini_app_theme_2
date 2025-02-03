import React, { useEffect} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { activeTabState } from "../../recoil/atoms";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { drawerAddCartState, typeAddCartState } from "../../recoil/product";
import { openCartState, openAddAddressState } from "../../recoil/order";
import { Button } from 'antd'
import { HouseLine, ListMagnifyingGlass, ShoppingBag, User, ChatCircleDots } from '@phosphor-icons/react'
import AddToCart from "../add-to-cart";
import Cart from "../cart";
import AddAddress from "../add-address";

const FooterCustom = (props) => {
  const [activeTab, setActiveTab] = useRecoilState(activeTabState)
  const [drawerAddCart, setDrawerAddCart] = useRecoilState(drawerAddCartState)
  const [openCart, setOpenCart] = useRecoilState(openCartState)
  const [openAddAddress, setOpenAddAddress] = useRecoilState(openAddAddressState)
  const location = useLocation()
  const { title } = props;
  const navigate = useNavigate()

  const goTo = (key) => {
    console.log(key, "keyyy")
    setActiveTab(key)
    switch (key) {
      case "home":
        navigate("/")
        break
      case "categories":
        navigate("/categories")
        break
      case "cart":
        setOpenCart(true)
        break
      case "member":
        navigate("/member")
        break
    }
  }

  useEffect(() => {
      console.log(location, "locationnn")
    }, [location])

  return (
    <>
      {
        (location.pathname == "/" || location.pathname == "/member") &&
        <div>
          <div className="bg-[#fff] border-t border-t-solid border-t-[#fafafa] fixed bottom-0 w-full">
            <div className="flex py-2 items-center">
              <div onClick={() => goTo("home")} className="flex-1 flex flex-col items-center">
                <HouseLine size={24} color={location.pathname == "/" ? '#292929' : '#797979'} weight="light" />
                <div className={location.pathname == "/" ? 'text-[#292929] text-[12px]' : 'text-[#797979] text-[12px]'}>Trang chủ</div>
              </div>
              <div onClick={() => goTo("categories")} className="flex-1 flex flex-col items-center">
                <ListMagnifyingGlass size={24} color="#797979" weight="light" />
                <div className="text-[12px] text-[#797979]">Danh mục</div>
              </div>
              <div onClick={() => goTo("cart")} className="flex-1 flex flex-col items-center">
                <ShoppingBag size={24} color="#797979" weight="light" />
                <div className="text-[12px] text-[#797979]">Giỏ hàng</div>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <ChatCircleDots size={24} color="#797979" weight="light" />
                <div className="text-[12px] text-[#797979]">Tin nhắn</div>
              </div>
              <div onClick={() => goTo("member")} className="flex-1 flex flex-col items-center">
                <User size={24} color={location.pathname == '/member' ? '#292929' : '#797979'} weight="light" />
                <div className={location.pathname == "/member" ? 'text-[#292929] text-[12px]' : 'text-[#797979]  text-[12px]'}>Cá nhân</div>
              </div>
            </div>
          </div>
        </div>
      }
   
      {drawerAddCart && <AddToCart />}
      {openCart && <Cart />}
      {openAddAddress && <AddAddress />}
    </>
  )
}

export default FooterCustom