import { Menubar } from "primereact/menubar";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../utils/auth";

function Header() {
  const authContext = useContext(AuthContext);

  const items = [
    {
      label: "Projects",
      icon: "pi pi-folder",
      url: "/projects",
    },
    {
      label: "Users",
      icon: "pi pi-user",
      url: "/users",
    },
    {
      label: "Teams",
      icon: "pi pi-users",
      url: "/teams",
    },
  ];

  const start = (
    <Link to="/login">
      <span className="text-4xl font-bold mr-[2rem] ml-[1rem] bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
        JirAI
      </span>
    </Link>
  );

  const end = (
    <div className="flex items-center">
      <span className="text-gray-500 mr-4">
        {authContext?.userInfo?.username}
      </span>
    </div>
  );

  return (
    <header>
      <Menubar model={items} start={start} end={end} />
    </header>
  );
}

export default Header;
