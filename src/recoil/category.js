import { atom, selector, useRecoilValue, useSetRecoilState } from "recoil"
import { getApi } from "../utils/request"

export const categoriesState = atom({
  key: "categories",
  default: []
})

export const categoryChooseState = atom({
  key: "categoryChoose",
  default: null
})

export const termSearchState = atom({
  key: "termSearchProduct",
  default: ''
})

export const categoryStore = (type, payload = {}) => {
  const getCategories = async () => {
    return await getApi("/categories")
  }
  
  const getCategoryById = async ({id} = payload) => {
    return await getApi(`/categories/${id}`)
  }

  const searchProducts = async (payload) => {
    console.log(payload, "payloadddd termmm")
    return await getApi(`/search`, { params: payload })
  }

  const obj = {
    getCategories,
    getCategoryById,
    searchProducts
  }

  return obj[type](payload)
}