import "./App.css";
import Header from "./components/header";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/users/login";
import UsersList from "./pages/users/users-list";
import ProjectsList from "./pages/projects/projects-list";
import UserDetail from "./pages/users/detail";
import ProjectDetail from "./pages/projects/detail";
import TeamsList from "./pages/teams/teams-list";
import TeamDetail from "./pages/teams/detail";

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/users/:uuid" element={<UserDetail />} />
          <Route path="/projects" element={<ProjectsList />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/teams" element={<TeamsList />} />
          <Route path="/teams/:slug" element={<TeamDetail />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
