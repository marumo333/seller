"use client";
import Link from "next/link";
import Image from "next/image";

export default function Header (props:any) {
    const data = props.list;
    console.log(data);
  return (
    <nav className='flex'>
        <div className='flex-none sm:flex-1 md:flex-1 lg:flex-1 xl:flex-1' >
            <link href='/'>
            <a>
                <Image src='/images/logo.png' alt='logo' width={200} height={100} />
            </a>
            </link>
        </div>
        <div className="flex-initial text-[#abc5c5} font-bold m-5">
            <ul className="md:flex hidden flex-initial text-left">
                {data.map((value:any,index:any)=>{
                    <li key={index} className="p-4" >
                        <a href={value.link}>{value.name}</a>
                    </li>
                    })}
            </ul>
        </div>
    </nav>
  );
};

