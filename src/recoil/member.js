import { atom, selector, useRecoilValue, useSetRecoilState } from "recoil"
import { getApi } from "../utils/request"

export const memberZaloState = atom({
  key: "memberZalo",
  default: {
    avatar: "https://content.pancake.vn/1.1/s450x450/fwebp/87/12/e9/86/59eb6fdc125b4840df72b830615bafd86e3bfcc3bbf6a92beef2efca.png",
    followedOA: false,
    id: "",
    isSensitive: false,
    name: "Guest"
  }
})

export const phoneMemberZaloState = atom({
  key: "phoneMemberZalo",
  default: ''
})

export const customerState = atom({
  key: "customer",
  default: {}
})

export const memberStore = (type, payload = {}) => {
  const getMemberShip = async () => {
    return await getApi("/membership", {params: payload})
  }

  const obj = {
    getMemberShip
  }

  return obj[type](payload)
}