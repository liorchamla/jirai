import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { useContext, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../utils/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);

  const authContext = useContext(AuthContext);

  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      await authContext.authenticate({ email, password });
      navigate("/users");
    } catch (error) {
      // eslint-disable-next-line
      console.error("Login error:", error);
      setError("Login failed. Please check your credentials.");
    }
  }

  return (
    <div className="mt-[10rem] mb-auto flex justify-center items-center">
      <div className="flex flex-col shadow-2xl p-5 rounded-lg gap-[1rem] w-[30rem]">
        <form onSubmit={handleSubmit}>
          <h2 className="text-3xl font-bold text-center mb-[1rem]">Login</h2>
          {error && (
            <Message severity="error" text={error} className="w-full mb-5" />
          )}
          <div className="flex flex-col items-start w-full gap-3 mb-5 mt-5">
            <label htmlFor="email">Entrez votre adresse e-mail</label>
            <InputText
              className="w-full"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col items-start w-full gap-3 mb-5">
            <label htmlFor="password">Entrez votre mot de passe</label>
            <InputText
              className="w-full"
              id="password"
              placeholder="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button label="Se connecter" />
        </form>
      </div>
    </div>
  );
}
export default Login;
