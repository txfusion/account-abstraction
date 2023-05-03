import React from "react";
import { ConnectWallet } from "./ConnectWallet";
import { Navbar } from "flowbite-react";
import { useRouter } from 'next/router';

export const NavBar = () => {

const router = useRouter();

return (<Navbar
  fluid={true}
  rounded={true}
  className="bg-white-900"
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
        <ConnectWallet />
    <Navbar.Toggle />
  </div>
</Navbar>)
}