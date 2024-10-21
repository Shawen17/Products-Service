import React from "react";
import HomeRecentlyAdded from "../components/HomeRecentlyAdded";
import Slider from "../components/Slider";

const Home = () => {
  return (
    <div style={{ marginTop: 30 }}>
      <Slider />
      <HomeRecentlyAdded />
    </div>
  );
};

export default Home;
