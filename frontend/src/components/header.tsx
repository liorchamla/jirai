import { Menubar } from "primereact/menubar";
import { Link } from "react-router-dom";

function Header() {
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
    <Link to="/">
      <span className="text-4xl font-bold mr-[2rem] ml-[1rem] bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
        JirAI
      </span>
    </Link>
  );
  return (
    <header>
      <Menubar model={items} start={start} />
    </header>
  );
}

export default Header;
