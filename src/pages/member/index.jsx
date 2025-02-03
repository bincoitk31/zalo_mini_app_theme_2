import React, { useState} from "react"
import { UserOutlined, CodeSandboxOutlined, ShoppingCartOutlined, GiftOutlined } from "@ant-design/icons"
import Infomation from "./infomation"
import Coupon from "./coupon"
import HistoryOrder from "./history-order"
import TrackingOrder from "./tracking-order"

const Member = () => {
  const [type, setType] = useState('1')

  const handleChangeType = (value) => {
    setType(value)
  }

  return (
    <div className="absolute top-[56px] h-[calc(100vh-100px)] overflow-y-auto w-full">
      <div className="bg-[#fff] m-2 p-3 rounded-lg border border-solid border-[#ccc]">
        <div className="flex justify-between">
          <div className={`flex flex-col items-center w-[60px] ${type == '1' ? 'text-[#006af5]' : ''}`} onClick={() => handleChangeType('1')} >
            <div className={`${type == '1' ? 'text-[#006af5]' : 'text-[#5e636a]'} flex items-center justify-center border border-solid border-[#cdd8df] w-[36px] h-[36px] rounded-full bg-[#cdd8df]`}>
              <UserOutlined />
            </div>
            <div className="text-[12px] text-center pt-1">Thông tin tài khoản</div>
          </div>
          <div className={`flex flex-col items-center w-[60px] ${type == '2' ? 'text-[#006af5]' : ''}`} onClick={() => handleChangeType('2')}>
            <div className={`${type == '2' ? 'text-[#006af5]' : 'text-[#5e636a]'} flex items-center justify-center border border-solid border-[#cdd8df] w-[36px] h-[36px] rounded-full bg-[#cdd8df] `}><GiftOutlined/></div>
            <div className="text-[12px] text-center pt-1">Coupon</div>
          </div>
          <div className={`flex flex-col items-center w-[60px] ${type == '3' ? 'text-[#006af5]' : ''}`} onClick={() => handleChangeType('3')}>
            <div className={`${type == '3' ? 'text-[#006af5]' : 'text-[#5e636a]'} flex items-center justify-center border border-solid border-[#cdd8df] w-[36px] h-[36px] rounded-full bg-[#cdd8df]`}><CodeSandboxOutlined/></div>
            <div className="text-[12px] text-center pt-1">Theo dõi đơn hàng</div>
          </div>
          <div className={`flex flex-col items-center w-[60px] ${type == '4' ? 'text-[#006af5]' : ''}`} onClick={() => handleChangeType('4')}>
            <div className={`${type == '4' ? 'text-[#006af5]' : 'text-[#5e636a]'} flex items-center justify-center border border-solid border-[#cdd8df] w-[36px] h-[36px] rounded-full bg-[#cdd8df]`}><ShoppingCartOutlined/></div>
            <div className="text-[12px] text-center pt-1">Lịch sử đơn hàng</div>
          </div>
        </div>
      </div>

      <div className="bg-[#fff] m-2 p-3 rounded-lg border border-solid border-[#ccc]">
        { type == '1' && <Infomation /> }
        { type == '2' && <Coupon />}
        { type == '3' && <TrackingOrder />}
        { type == '4' && <HistoryOrder />}
      </div>

    </div>
  )
}

export default Member
