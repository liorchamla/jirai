import "./App.css";
import Header from "./components/header";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/users/login";
import UsersList from "./pages/users/users-list";
import ProjectsList from "./pages/projects/projects-list";
import UserDetail from "./pages/users/detail";

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/projects" element={<ProjectsList />} />
          <Route path="/users/:uuid" element={<UserDetail />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
