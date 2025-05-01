"use client"
import Image from "next/image";
import React, { FC } from "react";

type Props = {
  url: string;
};

const Icon: FC<Props> = ({ url }) => {
  return (
    <div style={{ width: 200, height: 200, position: "relative", borderRadius: "50%", overflow: "hidden" }}>
      {url ? (
        <Image
          src={url}
          alt="Avatar"
          fill
          style={{ objectFit: "cover" }} // 画像を適切に調整
          unoptimized={true}
          priority
        />
      ) : (
        <div style={{ width: "100%", height: "100%", background: "gray" }} />
      )}
    </div>
  );
};

export default Icon;
