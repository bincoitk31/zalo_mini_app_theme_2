import React from "react";
import { Button } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import CartItems from "../../components/cart-items";
import Bill from "../../components/bill";
const Cart = () => {
  const navigate = useNavigate()

  return (
    <div className="my-[50px] bg-[#fff] h-[calc(100vh-100px)]">
      <div className="">
        <div className="ml-2 pt-4 font-bold pb-2 text-[18px]">Giỏ hàng của bạn</div>
        <CartItems />
      </div>
      <Bill />
    </div>
  )
}

export default Cart