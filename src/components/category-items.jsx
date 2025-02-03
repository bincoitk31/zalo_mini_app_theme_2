import React, { useEffect, useState } from "react"
import ProductGrid from "../components/product-grid"
import { Package } from "@phosphor-icons/react";
import { useParams } from "react-router-dom"
import { categoryStore, categoriesState  } from "../recoil/category";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { activeTabState } from "../recoil/atoms"

const CategoryItems = ({products}) => {
  // const setActiveTab = useSetRecoilState(activeTabState)
  // const {id} = useParams()
  // const categories = useRecoilValue(categoriesState)
  // const [products, setProducts] = useState({data: []})
  // const [nameCategory, setNameCategory] = useState("")

  // useEffect(() => {
  //   categoryStore('getCategoryById', {id})
  //     .then(res => {
  //       if (res.status == 200) setProducts(res.data.products)
  //       console.log(res, "productssssss")
  //     })
  // }, [])

  // useEffect(() => {
  //   let category = categories.find(el => el.id == id)
  //   if (category) return setNameCategory(category.name)
  // }, [categories])
  console.log( products, "ppppppp")
  return (
    <div>
      <div className="overflow-y-auto h-[calc(100vh-213px)]">
        {
          products.data.length > 0
          ? <ProductGrid products={products} />
          : <div className="flex flex-col h-full items-center justify-center">
            <div><Package size={52} color="#cccccc" weight="bold" /></div>
            <div className="font-bold mt-4 mb-2">Không tìm thấy sản phẩm nào</div>
            <div>Vui lòng quay trở lại sau hoặc tải lại trang</div>
          </div>
        }
        
      </div>
    </div>
  )
}

export default CategoryItems