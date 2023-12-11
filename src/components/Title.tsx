import React from "react";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";

const myFont = localFont({
  src: "../../public/fonts/DENSOSans-Bold.ttf",
});

interface TitleProps {
  children: React.ReactNode;
}

const Title: React.FC<TitleProps> = (props: TitleProps) => {
  // const [currentTime] = useState<number>(Date.now());

  return (
    <div className="flex px-3 py-2 pt-4 mx-auto text-3xl  border-gray-300 text-black justify-between items-center mb-5">
      <h1 className={`${myFont.className}`}>{props.children}</h1>
    </div>
  );
};

export default Title;
