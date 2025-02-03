import { atom, selector, useRecoilValue, useSetRecoilState } from "recoil"

export const memberZaloState = atom({
  key: "memberZalo",
  default: {
    avatar: "https://content.pancake.vn/2-24/s800x1200/fwebp/2024/8/8/7638b7f6cca905c8008c1966ab462c02c6412d9b.png",
    followedOA: false,
    id: "1231323123",
    isSensitive: false,
    name: "Nguyễn Y Vân"
  }
})

export const phoneMemberZaloState = atom({
  key: "phoneMemberZalo",
  default: '0888888888'
})