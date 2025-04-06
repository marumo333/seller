"use client";
import Link from "next/link";
import NavLinks from "./NavLinks";
import Hamburger from "./Hamburger";

export default function Header  () {
  return (
    <header
      className={`bg-black text-white py-2 max-[480px]:py4 max-[480px]:px-4 px-6 z-10`}
    >
      <nav className="max-w-[1080px] mx-auto flex justify-between items-center max-[899px]:hidden">
        <Link href="/">
          <div
            className="textShadow_wt text-[2.2rem] font-bold text-nowrap max-[1000px]:text-[1.8rem] 
          hover:opacity-70 transition-all duration-300"
          >
            Seller
          </div>
        </Link>
        <NavLinks />
      </nav>
      <Hamburger />
    </header>
  );
};

