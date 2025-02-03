import React from "react";
import { Page, Swiper, Box, Text } from "zmp-ui";

const Carousel = ({images} = props) => {
  return (
    <Swiper autoplay duration={5000} loop>
      {
        images.map((el, idx) => (
          <Swiper.Slide key={idx}>
            <img
              className="slide-img h-[200px] w-full object-cover"
              src={el}
              alt={`slide-${idx}`}
            />
          </Swiper.Slide>
        ))
      }
  </Swiper>
  )
};

export default Carousel;