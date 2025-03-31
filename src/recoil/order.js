import { atom, selector, useRecoilValue, useSetRecoilState } from "recoil"

export const totalPriceState = atom({
  key: "totalPrice",
  default: 0
})

export const amountPriceState = atom({
  key: "amountPrice",
  default: 0
})

export const cartItemsState = atom({
  key: "cartItems",
  default: []
})

export const customerInfoState = atom({
  key: "customerInfo",
  default: null
})

export const openCartState = atom({
  key: "openCart",
  default: false
})

export const openAddAddressState = atom({
  key: "openAddAddress",
  default: false
})

export const listAddressState = atom({
  key: "listAddress",
  default: []
})

export const editAddressState = atom({
  key: "editAddress",
  default: null
})

export const discountCouponState = atom({
  key: 'discountCoupon',
  default: 0
})
