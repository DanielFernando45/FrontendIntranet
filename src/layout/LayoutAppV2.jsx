import { Outlet } from "react-router-dom";
import NavbarV2 from "../Components/NavbarV2";
import SidebarApp from "../Components/SidebarApp";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SidebarResponsive from "../Components/SidebarResponsive";

const LayoutAppV2 = ({ children }) => {
  const [expand, setExpand] = useState(false);
  const [showResponsive, setShowResponsive] = useState(false);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth > 1280) {
        setShowResponsive(false);
      }

      if (window.innerWidth < 1280) {
        setExpand(false);
      }

    });
    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <div
        onClick={() => {
          setShowResponsive(false);
          setExpand(false);
        }}
        className={`bg-black/50 ${
          expand || showResponsive ? "opacity-100 z-50" : "opacity-0 z-0"
        } w-full absolute  left-0 top-0 h-full duration-200 delay-100`}
      ></div>
      <SidebarResponsive
        showResponsive={showResponsive}
        setShowResponsive={setShowResponsive}
      />
      <SidebarApp expand={expand} setExpand={setExpand} />
      <div className="flex-1 flex flex-col overflow-hidden pl-0 xl:pl-[100px] relative z-10">
        <NavbarV2
          user={user}
          showResponsive={showResponsive}
          setShowResponsive={setShowResponsive}
        />
        <div className="p-8 overflow-auto bg-[#F0F0F0]">{children}</div>
      </div>
    </div>
  );
};

export default LayoutAppV2;
