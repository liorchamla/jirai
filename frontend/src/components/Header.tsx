import { Menubar } from "primereact/menubar";
import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/auth";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { decodeToken } from "../utils/auth";

function Header() {
  const [dialog, setDialog] = useState<"delete" | null>(null);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  // Vérifier si le token est expiré
  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = window.localStorage.getItem("token");
      if (token) {
        const decodedInfo = decodeToken(token);
        if (!decodedInfo && authContext?.userInfo) {
          // Token expiré, déconnecter l'utilisateur
          authContext.logout();
        }
      }
    };

    // Vérifier immédiatement
    checkTokenExpiration();

    // Vérifier toutes les minutes
    const interval: number = window.setInterval(checkTokenExpiration, 6000);

    return () => window.clearInterval(interval);
  }, [authContext]);

  const isAuthenticated =
    authContext?.userInfo !== null && authContext?.userInfo !== undefined;

  const items = isAuthenticated
    ? [
        {
          label: "Projects",
          icon: "pi pi-folder",
          command: () => navigate("/projects"),
        },
        {
          label: "Users",
          icon: "pi pi-user",
          command: () => navigate("/users"),
        },
        {
          label: "Teams",
          icon: "pi pi-users",
          command: () => navigate("/teams"),
        },
      ]
    : [];

  const start = (
    <Link to="/">
      <span className="text-4xl font-bold mr-[2rem] ml-[1rem] bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
        JirAI
      </span>
    </Link>
  );

  const handleConfirmDelete = () => {
    authContext.logout();
    navigate("/login");
    setDialog(null);
  };

  const end = (
    <div className="flex items-center">
      {isAuthenticated ? (
        <>
          <span className="text-gray-500 mr-4">
            Bonjour {authContext?.userInfo?.username}
          </span>
          <button
            onClick={() => setDialog("delete")}
            className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Déconnexion
          </button>
        </>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Connexion
        </button>
      )}
    </div>
  );

  return (
    <header>
      <Menubar model={items} start={start} end={end} />
      <Dialog
        header="Se déconnecter"
        visible={dialog === "delete"}
        style={{ width: "30vw" }}
        onHide={() => {
          setDialog(null);
        }}
      >
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4">
            Êtes-vous sûr de vouloir vous déconnecter &quot;
            {authContext?.userInfo?.username}&quot; ?
          </h2>
          <div className="flex gap-2">
            <Button
              label="Confirmer"
              severity="danger"
              onClick={() => {
                handleConfirmDelete();
              }}
            />
            <Button
              label="Annuler"
              className="mt-2"
              onClick={() => setDialog(null)}
            />
          </div>
        </div>
      </Dialog>
    </header>
  );
}

export default Header;
