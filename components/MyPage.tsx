"use client"
import React from "react";
import {useState,useEffect} from "react";

interface Profile{
    id:number,
    updated_at:string,
    username:string,
    full_name:string,
    avatar_url:string
}
export default function MyPage(){
    const [user,setUser] = useState<Profile[]>([]);
    
    return(
        <>
        </>
    )
}