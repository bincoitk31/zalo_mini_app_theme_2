import React, { useState, useEffect, useRef } from "react"
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil"
import { productState, drawerAddCartState, typeAddCartState } from "../../recoil/product"
import { addCartState } from "../../recoil/selectors"
import { Button, message } from "antd"
import { formatNumber } from "../../utils/formatNumber"
import { useNavigate } from "react-router-dom"
import { activeTabState } from "../../recoil/atoms"
import {WechatLogo} from '@phosphor-icons/react'
import { openChat } from "zmp-sdk/apis"

import SliderProduct from "./slider-product"
import TabsProduct from "./tabs-product"
import QuantityProduct from "../../components/quantity-product"
import Description from "./description"

const Product = () => {
  const setActiveTab = useSetRecoilState(activeTabState)
  const navigate = useNavigate()
  const productView = useRecoilValue(productState)
  const [attributeSelected, setAttributeSelected] = useState([])
  const [cartItems, setCartItems] = useRecoilState(addCartState)
  const [quantity, setQuantity] = useState(1)
  const [drawerAddCart, setDrawerAddCart] = useRecoilState(drawerAddCartState)
  const setTypeAddCartState = useSetRecoilState(typeAddCartState)

  let result = []
console.log(productView, "pppp")
  const handleSelectAttribute = (name, value) => {
    let idx = attributeSelected.findIndex(el => el.name == name)

    const updatedAttributes = idx > -1
      ? attributeSelected.map((el, index) =>
          index === idx ? { ...el, value } : el
        )
      : [...attributeSelected, { name, value }];

    setAttributeSelected(updatedAttributes);
  }

  const renderFields = () => {
    productView.variations.forEach((variation) => {
      variation.fields.forEach((field) => {
        // Tìm nếu field đã tồn tại trong kết quả
        let existing = result.find((item) => item.name === field.name);
        if (existing) {
          // Nếu tồn tại, thêm giá trị nếu chưa có
          if (!existing.values.includes(field.value)) {
            existing.values.push(field.value);
          }
        } else {
          // Nếu chưa tồn tại, thêm field vào kết quả
          result.push({ name: field.name, values: [field.value] });
        }
      });
    });

    // // Sắp xếp giá trị để tránh sự khác biệt thứ tự
    // result.forEach((item) => item.values.sort());
    console.log(result, "resulttttt")

    const checkActive = (name, value) => {
      if (attributeSelected.find(el => el.name == name && el.value == value)) return 'border-sky-600'
      return 'border-black'
    }

    return (
      <>
      {
        result.map((el, idx) => (
          <div key={idx} className="pb-2">
            <div className="font-bold pb-1">{el.name}</div>
            <div className="flex">
              {
                el.values.map(v => (
                  <div
                    key={v}
                    onClick={() => handleSelectAttribute(el.name, v)}
                    className={`${checkActive(el.name, v)} mr-2 flex items-center justify-center w-[30px] h-[30px] border border-solid rounded-full`}
                  >
                    {v}
                  </div>
                ))
              }
            </div>
          </div>
        ))
      }
      </>
    )
  }

  const findVariation = () => {
    const areFieldsEqual = (fields1, fields2) => {
      if (fields1.length !== fields2.length) return false;
      return fields1.every(field1 =>
        fields2.some(field2 => field1.name === field2.name && field1.value === field2.value)
      )
    }

    const matchingVariations = productView.variations.filter(variation => areFieldsEqual(variation.fields, attributeSelected));
    if (matchingVariations.length > 0) return matchingVariations[0]
    return {}
  }

  const addTocart = () => {
    let variation = findVariation()

    if (!variation.id) return message.error("Vui lòng chọn thuộc tính sản phẩm")
    variation = {...variation,
      quantity: parseInt(quantity),
      name: productView.name,
      product_custom_id: productView.custom_id,
      categories: productView.categories
    }
    setCartItems(variation)
    message.success('Thêm vào giỏ hàng thành công', [2])
  }

  const handleChangeQuantity = (value) => {
    console.log(value, "valllll")
    setQuantity(value);
    // if (/^\d*$/.test(value)) {
    //   setQuantity(value);
    // }
  }

  const onChangeCarousel = (current) => {
    console.log(current, "current")
  }

  const getRetailPrice = () => {
    let variations = productView.variations || []
    let arrayPrice = variations.map(el => el.retail_price)
    let min = Math.min(...arrayPrice) || 0
    let max = Math.max(...arrayPrice) || 0

    let result = (min == max || arrayPrice.length == 0)  ? formatNumber(max) : `${formatNumber(min)} - ${formatNumber(max)}`

    return result
  }
  
  const getOriginalPrice = () => {
    let variations = productView.variations || []
    let arrayPrice = variations.map(el => el.original_price)
    let min = Math.min(...arrayPrice) || 0
    let max = Math.max(...arrayPrice) || 0

    let result = (min == max || arrayPrice.length == 0) ? formatNumber(max) : `${formatNumber(min)} - ${formatNumber(max)}`

    return result
  }

  const buyNow = () => {
    addTocart()
    navigate('/checkout')

  }

  const onOpenDrawerAddCart = (type) => {
    setDrawerAddCart(true)
    setTypeAddCartState(type)
  }

  const openChatScreen = async () => {
    try {
      let oa_id = import.meta.env.VITE_ZALO_OA_ID
      await openChat({
        type: "oa",
        id: oa_id,
        message: "Xin Chào",
      });
    } catch (error) {
      // xử lý khi gọi api thất bại
      console.log(error);
    }
  }

  useEffect(() => {
    console.log("attributeSelected updated:", attributeSelected);
  }, [attributeSelected]);

  useEffect(() => {
    setActiveTab('product')
  }, [])

  return (
    <>
      <div className="mt-[36px] overflow-y-auto bg-[#fff] h-[calc(100vh-89px)]" >
        <SliderProduct images={productView ?.variations[0].images || []} />
        <div className="px-2">
          <div className="mt-2 font-medium text-[18px]">{productView.name}</div>
          <div className="font-medium">{getRetailPrice()}</div>
          {/* <div className="flex mt-2 pb-2">
            <div>
              <span className="font-bold pr-1">SKU:</span>
              <span className="text-cyan-700"> {productView.custom_id} </span>
            </div>
            <div className="px-2"> | </div>
            <div>
              <span className="font-bold pr-1">Đã bán:</span>
              <span className="text-cyan-700">{productView.total_sold_web}</span>
            </div>
          </div>
          {renderFields()}
          <div className="flex my-2">
            <div className="text-red-600 pr-4 text-[18px]">{getRetailPrice()}</div>
            <div className="line-through text-stone-800 text-[16px]">{getOriginalPrice()}</div>
          </div>
          <QuantityProduct quantity={quantity} changeQuantity={handleChangeQuantity} /> */}
          {/* <Button type="primary" variant="solid" className="my-2 w-full h-[46px] my-2" onClick={() => addTocard()}> Thêm vào giỏ hàng</Button>
          <Button color="danger" variant="solid" className="w-full h-[46px] my-2" onClick={() => buyNow()}> Mua ngay</Button> */}

          {/* <TabsProduct product={productView} /> */}
          
          <Description product={productView}/>
        </div>
      </div>
      <div className="bg-[#fff] border-t border-t-solid border-t-[#fafafa] fixed bottom-0 w-full">
        <div className="flex px-3 items-center">
          <div className="mr-2" onClick={() => openChatScreen()}>
            <WechatLogo size={32} color="#292929" weight="light" />
          </div>
          <div className="flex w-full">
            <div className="w-1/2 pr-1">
              <Button color="default" variant="outlined" className="my-2 w-full h-[36px] my-2 font-medium rounded-[4px]" onClick={() => onOpenDrawerAddCart('add-cart')}> Thêm vào giỏ hàng</Button>
            </div>
            <div className="w-1/2 pl-1">
              <Button color="default" variant="solid" className="w-full h-[36px] my-2 font-medium rounded-[4px]" onClick={() => onOpenDrawerAddCart('buy-now')}> Mua ngay</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Product