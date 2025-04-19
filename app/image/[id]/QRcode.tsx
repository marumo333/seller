"use client"
import React from "react";
import {FC} from "react";
import { QRCodeCanvas } from "qrcode.react";

interface QRcodeProps{
    url:string,
}

const QRcode:FC<QRcodeProps>=(props)=>{
    return (
        <QRCodeCanvas
          value={props.url}
          size={128}
          bgColor={"#FF0000"}
          fgColor={"#FFC0CB"}
          level={"L"}
          includeMargin={false}
          imageSettings={{
            src: "/favicon.ico",
            x: undefined,
            y: undefined,
            height: 24,
            width: 24,
            excavate: true,
          }}
        />
      );
}
export default QRcode;