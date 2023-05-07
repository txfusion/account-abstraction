import React from "react";
import { Navbar } from "flowbite-react";
import { useRouter } from 'next/router';
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const NavBar = () => {

  const router = useRouter();

  return (<Navbar
    fluid={true}
    rounded={true}
    className="border-gray-200"
  >
    <Navbar.Collapse className="center">
      <Navbar.Link
        href="/">
        <p className={`font-bold text-xl ${router.pathname == "/" ? "text-purple-500" : "text-black"}`}>Home</p>
      </Navbar.Link>
      <Navbar.Link href="/dashboard" >
        <p className={`font-bold text-xl ${router.pathname == "/dashboard" ? "text-purple-500" : "text-black"}`}>Dashboard</p>
      </Navbar.Link>
    </Navbar.Collapse>
    <div className="md:order-2">
      <ConnectButton />
      <Navbar.Toggle /> 
    </div>
  </Navbar>)
}