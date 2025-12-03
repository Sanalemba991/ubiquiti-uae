import Image from "next/image";
import Brands from "./Brands";
import Banner from "./Banner";
import Principle from "./Principle";
import Last from "./Last";
import Testimonial from "./Testimony";

export default function Home() {
  return (
    <>
      <Banner />
      <Principle />
      <Brands />
      <Testimonial/>
      <Last/></>
  );
}
