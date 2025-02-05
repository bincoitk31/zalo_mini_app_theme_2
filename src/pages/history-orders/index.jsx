import React from "react"
import { Tabs, Empty } from 'antd'

const HistoryOrder = () => {
  const children = (key) => {
    return (
      <div>
        <Empty description="Bạn chưa có đơn hàng nào cả" />
        
      </div>
    )
  }

  const items = [
    {
      key: '1',
      label: <div>Tất cả</div>,
      children: children(1),
    },
    {
      key: '2',
      label: <div>Chờ xác nhận</div>,
      children: children(2),
    },
    {
      key: '3',
      label: <div>Chờ lấy hàng</div>,
      children: children(3),
    },
    {
      key: '4',
      label: <div>Chờ giao hàng</div>,
      children: children(4),
    },
    {
      key: '5',
      label: <div>Đã giao</div>,
      children: children(5),
    },
  ];

  const onChange = (key) => {
    console.log(key);
  };

  

  return (
    <>
      <div className="absolute top-[36px] bg-[#f3f3f3] h-[calc(100vh-36px)] overflow-y-auto w-full">
        <Tabs className="custom-tabs" defaultActiveKey="1" items={items} onChange={onChange} />
      </div>

    </>
  )
}

export default HistoryOrder
