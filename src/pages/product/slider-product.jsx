import React, { useState, useEffect, useRef } from "react";
import {Carousel} from 'antd'

const SliderProduct = ({images}) => {
  const [current, setCurrent] = useState(0)
  console.log(images.length, "iiiii")

  

  const renderNav = () => {
    console.log(images, "imgggg")
    return (
      images.map((src, idx) => (
        <div key={idx} className="w-full h-[360px]">
          <img src={src} className="w-full h-full object-cover" />
        </div>
      ))
    )
  }

  const afterChange = (number) => {
    console.log(number, "numm")
    setCurrent(number)
  }

  return (
    <div className="relative">
      <Carousel afterChange={afterChange} dots={false}>
        {renderNav()}
      </Carousel>
      <div className="absolute bottom-0 right-4 bg-[#0000003b] text-[12px] text-[#fff] px-2 rounded-t-[4px]">
        {current + 1} / {images.length}
      </div>
    
    </div>
  );
}

export default SliderProduct