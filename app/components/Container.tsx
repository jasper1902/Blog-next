import React from "react";

type Props = {
  children: React.ReactNode;
};

const Container = ({ children }: Props) => {
  return (
    <div className="min-h-screen gap-8 bg-[#111] py-8 bg-[url('/LooperGroup2.png')] bg-no-repeat">
      <div className="max-w-[1450px] flex justify-center mx-auto relative z-10 ">
        {children}
      </div>
    </div>
  );
};

export default Container;
