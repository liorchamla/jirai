import "./App.css";
import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import { AuthContext, useAuth } from "./utils/auth";

import Login from "./pages/users/Login";
import UsersList from "./pages/users/UsersList";
import ProjectsList from "./pages/projects/ProjectsList";
import UserDetail from "./pages/users/Detail";
import ProjectDetail from "./pages/projects/Detail";
import TeamsList from "./pages/teams/TeamsList";
import TeamDetail from "./pages/teams/Detail";
import EpicDetail from "./pages/epics/Detail";
import TicketDetail from "./pages/tickets/Detail";

function App() {
  const { userInfo, authenticate } = useAuth();

  return (
    <AuthContext.Provider value={{ userInfo, authenticate }}>
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
          <Route path="/projects/:slug/epics/:id" element={<EpicDetail />} />
          <Route path="/ticket/:id" element={<TicketDetail />} />
        </Routes>
      </main>
    </AuthContext.Provider>
  );
}

export default App;
