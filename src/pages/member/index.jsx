import React, { useState} from "react"
import { UserCircle, CaretRight, Clock, Phone } from "@phosphor-icons/react"
import { useNavigate } from "react-router-dom";
import Infomation from "./infomation"
import Coupon from "./coupon"
import HistoryOrder from "./history-order"
import TrackingOrder from "./tracking-order"
import FollowOA from "../../components/follow-oa"
import ShareLink from "../../components/share-link";

const Member = () => {
  const navigate = useNavigate()
  const [type, setType] = useState('1')

  const handleChangeType = (value) => {
    setType(value)
  }

  const goTo = (path) => {
    navigate(path)
  }

  return (
    <div className="absolute top-[36px] h-[calc(100vh-100px)] overflow-y-auto w-full">
      <div className="bg-[#fff] m-2 p-3 rounded-lg">
        <Infomation />
      </div>

      <div className="bg-[#fff] m-2 p-3 rounded-lg">
        <div className="font-bold">Khác</div>
        {/* <div className="flex justify-between items-center py-2">
          <div className="flex items-center">
            <div><UserCircle size={20} color="#141415" /></div>
            <div className="text-[12px] text-center pl-2">Thông tin tài khoản</div>
          </div>
          <div>
            <CaretRight size={18} color="#141415" />
          </div>
        </div>
        <div className="h-[1px] w-full bg-[#eee]"></div> */}
        <div onClick={() => goTo('/history-order')} className="flex justify-between items-center py-2">
          <div className="flex items-center">
            <div><Clock size={20} color="#141415" /></div>
            <div className="text-[12px] text-center pl-2">Lịch sử đơn hàng</div>
          </div>
          <div>
            <CaretRight size={18} color="#141415" />
          </div>
        </div>
        <div className="h-[1px] w-full bg-[#eee]"></div>
        <div onClick={() => goTo('/contact')} className="flex justify-between items-center py-2">
          <div className="flex items-center">
            <div><Phone size={20} color="#141415" /></div>
            <div className="text-[12px] text-center pl-2">Liên hệ và góp ý</div>
          </div>
          <div>
            <CaretRight size={18} color="#141415" />
          </div>
        </div>
      </div>
      
      <FollowOA />
      <ShareLink />
    </div>
  )
}

export default Member
