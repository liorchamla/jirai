import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="mt-[10rem] mb-auto flex justify-center items-center">
      <div className="flex flex-col shadow-2xl p-5 rounded-lg gap-[1rem] w-[30rem]">
        <h2 className="text-3xl font-bold text-center mb-[1rem]">Login</h2>
        <div className="flex flex-col items-start w-full gap-3">
          <label htmlFor="username">Entrez votre nom d&apos;utilisateur</label>
          <InputText
            className="w-full"
            id="username"
            placeholder="Nom d'utilisateur"
          />
        </div>
        <div className="flex flex-col items-start w-full gap-3">
          <label htmlFor="password">Entrez votre mot de passe</label>
          <InputText
            className="w-full"
            id="password"
            placeholder="Mot de passe"
            type="password"
          />
        </div>
        <Button label="Se connecter" />
        <Link to="/users" className="btn btn-secondary text-center">
          Go to User List
        </Link>
      </div>
    </div>
  );
}
export default Login;
