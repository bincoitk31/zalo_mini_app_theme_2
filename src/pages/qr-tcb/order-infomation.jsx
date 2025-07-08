import React from "react"

const OrderInfomation = ({data}) => {
  return (
    <div>
      <div className="py-4 px-4 bg-white rounded-lg">
        <div className="text-base font-medium text-[#25282A] mb-4">Thông tin đơn hàng</div>

        <div className="h-6 flex justify-between items-center mb-4">
          <div className="text-sm font-light">Nhà cung cấp</div>
          <div className="text-sm font-semibold uppercase max-w-[200px] text-end lg:max-w-max">{data.site.name}</div>
        </div>

        <div className="h-6 flex justify-between items-center">
          <div className="text-sm font-light">Mã đơn hàng</div>
          <div className="text-sm font-semibold">{data.order.display_id || data.order.render_id}</div>
        </div>
      </div>
    </div>
  )
}

export default OrderInfomation