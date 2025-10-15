import Image from "next/image";
import Brands from "./component/Brands";
import Banner from "./component/Banner";
import Principle from "./component/Principle";
import Last from "./component/Last";
import Testimonial from "./component/Testimony";

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
