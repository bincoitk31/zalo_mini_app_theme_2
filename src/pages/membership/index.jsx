import React, { use, useEffect, useState} from "react"
import { useRecoilState } from "recoil"
import { CaretRight } from "@phosphor-icons/react"
import { Button } from 'antd'
import { memberStore, customerState } from "../../recoil/member"
import { useNavigate } from "react-router-dom"

const Membership = () => {
  const navigate = useNavigate()
  const [customer, setCustomer] = useRecoilState(customerState)
  const [colorMember, setColorMember] = useState('#86efac')

  useEffect(() => {
    if (customer ?.id) {
      memberStore('getMemberShip', {id: customer.id})
      .then(res => {
        console.log(res, "memberShip")
        if (res.status == 200) {
          setCustomer(res.data.member)
        }
      })
    }
  }, [])

  useEffect(() => {
    const color = customer ?.pos_info ?.level ?.color_customer_level
    if (color) setColorMember(color)
  }, [customer])

  return (
    <div className="absolute top-[36px] h-[calc(100vh-36px)] overflow-y-auto w-full">
      {
        customer ?.id
        ?
        <div className="">
          <div className="p-4 rounded-lg relative m-4 h-[126px]" style={{ backgroundColor: colorMember}}>
            <div className="flex items-center justify-between text-[#fff] mb-8">
              <div className="font-bold">{customer ?.pos_info ?.level ?.name || 'Member'}</div>
              <div className="font-bold">{customer ?.pos_info ?.reward_point || '0'} điểm</div>
            </div>
            <div className="w-full bg-white h-2 rounded-full mt-2">
            </div>
            <p className="text-xs text-white mt-2">Còn 0 điểm nữa để lên hạng Thành viên</p>
          </div>
          <div className="bg-[#fff]">
            <div onClick={() => goTo('/membership')} className="flex justify-between items-center">
              <div className="flex items-center justify-between w-full p-2">
                <div className="text-[12px] text-center pl-2">Lịch sử tích điểm</div>
                <CaretRight size={18} color="#141415" />
              </div>
            </div>
            <div className="h-[1px] w-full bg-[#eee]"></div>
            <div onClick={() => goTo('/membership')} className="flex justify-between items-center">
              <div className="flex items-center justify-between w-full p-2">
                <div className="text-[12px] text-center pl-2">Ưu đãi hiện có</div>
                <CaretRight size={18} color="#141415" />
              </div>
            </div>
          </div>
        </div>
        :
          <div className="flex justify-center w-full pt-4">
            <Button onClick={() => navigate('/member')}>Vui lòng đăng kí thành viên</Button>
          </div>
      }

    </div>

  )
}

export default Membership