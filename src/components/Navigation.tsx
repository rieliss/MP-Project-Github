"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";

// menu list
const navLinks = [
  {
    title: "Overall Manpower Summary",
    link: "/",
  },
  {
    title: "Daily Summary Report",
    link: "/summary",
  },
  {
    title: "Daily Record",
    link: "/daily",
  },
  // {
  //   title: "Manpower Survey",
  //   link: "/survey",
  // },
  // {
  //   title: "Skill Evaluation",
  //   link: "/skill",
  // },
  // {
  //   title: "Personal Information",
  //   link: "/information",
  // },
];

export function Navigation() {
  const pathname = usePathname();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  // ฟังก์ชันเพื่อปิด Drawer
  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <nav className="bg-white">
      {/* nav main button มี sidebar,home link page,login link page */}
      <div className="flex px-2 py-2 items-center justify-between">
        <div className="flex justify-around items-center space-x-5">
          <button
            onClick={() => setDrawerOpen(true)}
            className="square-btn bg-cyan-100 text-cyan-600 hover:bg-cyan-200  hover:ring-1 hover:ring-cyan-500 hover:text-cyan-600 focus:ring-1 focus:ring-cyan-500"
          >
            <MenuIcon fontSize="medium" className="h-6 w-auto" />
          </button>
          <Drawer
            anchor="left"
            open={isDrawerOpen}
            onClose={() => setDrawerOpen(false)}
          >
            <Box className="flex flex-col gap-2 p-7 overflow-y-auto h-full items-start rounded-md">
              <p className=" text-xl">Menu</p>
              {navLinks.map(({ link, title }) => (
                <Link
                  key={title}
                  href={link}
                  className={`${
                    pathname == link
                      ? "p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer bg-cyan-500 text-white text-center ring-1 ring-cyan-200"
                      : "p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer bg-gray-200 hover:bg-cyan-500 text-gray-700 hover:text-white text-center ring-0 ring-cyan-500 "
                  } w-full justify-center`} // Add flex-grow class
                  onClick={closeDrawer}
                >
                  {title}
                </Link>
              ))}
            </Box>
          </Drawer>

          <Image
            alt="logo"
            height={100}
            width={100}
            priority
            className="hidden md:block"
            src="/Denso_Logo.png"
          />
        </div>

        <h2 className="text-[#000000] hidden md:block text-[28pt] font-bold">
          MFG. Manpower Allocation and Skill Control
        </h2>

        <Link
          href="#"
          className="nav-btn  bg-cyan-100 text-cyan-600 hover:bg-cyan-200  hover:ring-0 hover:ring-cyan-500 hover:text-cyan-600 focus:ring-1 focus:ring-cyan-500"
        >
          <PersonIcon fontSize="medium" className="h-6 w-auto" />
        </Link>
      </div>
      {/* nav link to pages */}
      <div className="flex w-[800px] justify-start pt-5 py-2 text-lg text-black text-center max-sm:hidden items-center space-x-3 space-x-reverse">
        {navLinks.map(({ link, title }) => (
          <Link
            key={title}
            href={link}
            className={`${
              pathname == link
                ? " p-2 bg-cyan-500 text-white rounded-md ring-1 ring-cyan-200 transition-all duration-150 flex-1 mx-2 text-sm text-limit"
                : "p-2 bg-gray-200 text-gray-700 rounded-md ring-0 ring-cyan-500 hover:bg-cyan-500 hover:text-white transition-all duration-150 flex-1 mx-2 text-sm text-limit"
            }`}
          >
            {title}
          </Link>
        ))}
      </div>
    </nav>
  );
}
