import "./App.css";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext, useAuth } from "./utils/auth";

import Home from "./pages/Home";
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
  const { userInfo, authenticate, logout, updateUserInfo } = useAuth();

  return (
    <AuthContext.Provider
      value={{ userInfo, authenticate, logout, updateUserInfo }}
    >
      <Header />
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UsersList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/:uuid"
            element={
              <ProtectedRoute>
                <UserDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <ProjectsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:slug"
            element={
              <ProtectedRoute>
                <ProjectDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teams"
            element={
              <ProtectedRoute>
                <TeamsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teams/:slug"
            element={
              <ProtectedRoute>
                <TeamDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:slug/epics/:id"
            element={
              <ProtectedRoute>
                <EpicDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ticket/:id"
            element={
              <ProtectedRoute>
                <TicketDetail />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </AuthContext.Provider>
  );
}

export default App;
