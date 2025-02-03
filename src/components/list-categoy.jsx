import React, { useEffect } from "react";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil"
import { categoriesState, categoryChooseState } from "../recoil/category"

import { useNavigate, Link } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";
import { activeTabState } from "../recoil/atoms";

const ListCategory = () => {
  const navigate = useNavigate()
  const categories = useRecoilValue(categoriesState)
  const setActiveTab = useSetRecoilState(activeTabState)
  const [categoryChoose, setCategoryChoose] = useRecoilState(categoryChooseState)
  console.log(categories, "cccc")

  const goToCategory = (id) => {
    //navigate(`/categories/${id}`)
    setCategoryChoose(id)
    navigate('/categories')
  }

  

  return (
    <div>
      <div className="flex justify-between">
        <div className="font-bold text-[14px]">Danh mục sản phẩm</div>
        <div className="flex items-center text-blue-500">
          <Link to="/categories" onClick={() => setCategoryChoose(null) }>
            <span className="pr-1">Xem thêm</span>
            <RightOutlined className="text-[12px]" />
          </Link>
        </div>
      </div>
      <div className="flex overflow-x-auto">
        {
          categories.map(c => (
            <div
            onClick={() => goToCategory(c.id)}
            className="p-2 m-2 bg-[#fff] w-[79px]"
            key={c.id}
            >
              <div className="flex items-center justify-center w-[50px]">
                <img className="w-[50px] h-[50px] rounded-full" src={c.image || "https://content.pancake.vn/1/s900x900/fwebp/ef/a5/21/80/6c8c38d77a6e2788c681255b20e0b13068010b1eba28895384246920.png"} />
              </div>
              <div className="truncate text-center">{c.name}</div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default ListCategory