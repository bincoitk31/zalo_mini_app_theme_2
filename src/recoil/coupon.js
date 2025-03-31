import { atom } from "recoil"
import { getApi, postApi } from "../utils/request"

export const couponsState = atom({
  key: "coupons",
  default: []
})

export const couponsUsedState = atom({
  key: "couponsUsed",
  default: []
})

export const couponStore = (type, payload = {}) => {
  const getCoupons = async () => {
    return await getApi("/coupons", {params: payload})
  }

  const findCouponByName = async () => {
    return await postApi("/coupons/find_coupon_by_name", payload)
  }

  const obj = {
    getCoupons,
    findCouponByName
  }

  return obj[type](payload)
}