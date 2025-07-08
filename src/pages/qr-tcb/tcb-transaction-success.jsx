import React from "react"
import { CheckCircle } from "@phosphor-icons/react"

const TcbTransactionSuccess = () => {
  return (
    <div
      className="mb-4 p-4 pb-8 bg-white rounded-lg flex justify-center flex-col items-center text-base"
    >
      <div className="text-xl font-semibold my-8">Thông tin giao dịch</div>

      <div className="text-color-primary-v2"><CheckCircle size={100} /></div>
      <div>Đơn hàng của bạn đã thanh toán thành công</div>
    </div>
  )
}

export default TcbTransactionSuccess