import React, { useState } from "react";
import {Carousel, Modal} from 'antd'
import { CaretLeft } from "@phosphor-icons/react";

const SliderProduct = ({images}) => {
  const [current, setCurrent] = useState(0)
  const [open, setOpen] = useState(false)

  const renderNav = () => {
    return (
      images.map((src, idx) => (
        <div key={idx} className="w-full h-[360px]">
          <img src={src} className="w-full h-full object-cover" />
        </div>
      ))
    )
  }

  const afterChange = (number) => {
    setCurrent(number)
  }

  return (
    <div >
      <div className="relative" onClick={() => setOpen(true)}>
        <Carousel afterChange={afterChange} dots={false}>
          {renderNav()}
        </Carousel>
        <div className="absolute bottom-0 right-4 bg-[#0000003b] text-[12px] text-[#fff] px-2 rounded-t-[4px]">
          {current + 1} / {images.length}
        </div>
      </div>
      
      <Modal
        className="modal-custom-fullscreen"
        open={open}
        width={"100%"}
        footer={null}
        closable={false}
      >
        <div className="h-full">
          <div className="fixed top-[8px] left-[8px] z-[9999]" onClick={() => setOpen(false)}><CaretLeft size={20} color="#fff" /></div>
          <Carousel afterChange={afterChange} dots={true}>
            {renderNav()}
          </Carousel>
         
        </div>
        
      </Modal>
    </div>
  );
}

export default SliderProduct