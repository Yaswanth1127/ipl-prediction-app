import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import LandingPage from "./pages/LandingPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import MyPredictionsPage from "./pages/MyPredictionsPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import UserPredictionsPage from "./pages/UserPredictionsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route element={<PublicOnlyRoute />}>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Route>

      <Route element={<ProtectedRoute roles={["user", "admin"]} />}>
        <Route element={<AppLayout portal="user" />}>
          <Route path="/app/predictions" element={<UserPredictionsPage />} />
          <Route path="/app/my-predictions" element={<MyPredictionsPage />} />
          <Route path="/app/leaderboard" element={<LeaderboardPage portal="user" />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={["admin"]} />}>
        <Route element={<AppLayout portal="admin" />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/leaderboard" element={<LeaderboardPage portal="admin" />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
