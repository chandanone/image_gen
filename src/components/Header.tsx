"use client"

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { signIn, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { BiLoader, BiLoaderCircle } from "react-icons/bi";

export default function Header(){
    const [initialLoading, setInitialLoading] = useState<boolean>(true);
    const { data: session, status} = useSession();

    useEffect(()=>{
        if(status !== "loading"){
            setInitialLoading(false);
        }
    },[status, session]);

    return (
        <div className="fixed top-0 w-full h-[60px] bg-black border-b-2 border-white/60 p-3 flex justify-between items-center">
            <Link href='/'>
                <h2 className="font-bold text-xl">Image GenX</h2>
            </Link>
            {initialLoading && status === "loading" ? (
                <BiLoaderCircle className="animate-spin" />
            ): !session ? (
            <div className="_menu">
                <Button onClick={() => signIn("google")}>Login</Button>
            </div>
           ):(
            <Avatar>
                <AvatarImage src={session.user?.image || ""} alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
           )} 
        </div>
    )
    }