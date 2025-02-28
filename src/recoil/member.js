import { atom, selector, useRecoilValue, useSetRecoilState } from "recoil"

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