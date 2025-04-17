"use client"

import { useState,useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useSetRecoilState } from "recoil";
import { isMobileState } from "./atoms";
import MobileComponent from "./MobileComponent";
import PCComponent from "./PCComponent";

export default function Header() {
    const [isClient, setIsClient] = useState(false);
    const isMobile = useMediaQuery({ query: '(max-width: 1024px)' });
    const setIsMobile = useSetRecoilState(isMobileState);
  
    useEffect(() => {
      setIsClient(true);
    }, []);
  
    useEffect(() => {
      if (isClient) {
        setIsMobile(isMobile);
      }
    }, [isMobile, isClient]);
  
    if (!isClient) return null;
  
    return (
      <>
        {isMobile ? (
          <MobileComponent className="lg:hidden" />
        ) : (
          <PCComponent className="max-lg:hidden" />
        )}
      </>
    );
  }
  