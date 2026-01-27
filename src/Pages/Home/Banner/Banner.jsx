import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Banner1 from "../../../assets/banner/banner1.png"
import Banner2 from "../../../assets/banner/banner2.png"
import Banner3 from "../../../assets/banner/banner3.png"
const Banner = () => {
  return (
    <Carousel autoPlay={true} infiniteLoop={true} showThumbs={false}>
      <div>
        <img src={Banner1} />
        <p className="legend">Legend 1</p>
      </div>
      <div>
        <img src={Banner2} />
        <p className="legend">Legend 2</p>
      </div>
      <div>
        <img src={Banner3} />
        <p className="legend">Legend 3</p>
      </div>
    </Carousel>
  );
};

export default Banner;
