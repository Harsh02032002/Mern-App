import React from "react";
import CategoryList from "../components/CategoryList";
import BannerProduct from "../components/BannerProduct";
import HorizontalCardProduct from "../components/HorizontalCardProduct";
import VerticalCardProduct from "../components/VerticalCardProduct";

const Home = () => {
  return (
    <div>
      <CategoryList />
      <BannerProduct />

      

      {/* Vertical Cards in id sequence */}
      <VerticalCardProduct category={"jeans"} heading={"Popular Jeans"} />
      <VerticalCardProduct category={"shirts"} heading={"Popular Shirts"} />
      <VerticalCardProduct category={"dresses"} heading={"Popular Dresses"} />
      <VerticalCardProduct category={"jackets"} heading={"Popular Jackets"} />
      <VerticalCardProduct category={"accessories"} heading={"Popular Accessories"} />
    </div>
  );
};

export default Home;
