import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/login/login";
import { Register } from "./pages/register/register";
import { Dashboard } from "./pages/dashboard/dashboard";
import { ProtectedRoute } from "./components/other/protectedRoute";
import { Profile } from "./pages/profile/profile";
import { Explore } from "./pages/explore/explore";
import { useEffect } from "react";
import websocketService from "./services/websocketService";
import { userAtom, isAuthenticatedAtom } from "./state/atoms";
import { useAtom } from "jotai";
import { socketAtom } from "./state/atoms";
import { ChatProvider } from "./contexts/chatContext";

function App() {
  const [user] = useAtom(userAtom);
  const [, setSocketConnection] = useAtom(socketAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const connectToSocket = async () => {
    try {
      const serverUrl = import.meta.env.VITE_WS_URL || "ws://localhost:4000";
      let success;
      console.log("USER", user);
      if (user) success = await websocketService.connect(serverUrl, user.token);
      console.log("SUCCESS", success);

      if (success) {
        setSocketConnection(true);
        console.log("WebSocket connected successfully");
      } else {
        console.error("WebSocket connection failed");
      }
    } catch (err) {
      console.error("WebSocket connection error:", err);
    }
  };

  useEffect(() => {
    console.log("isAuthenticated", isAuthenticated);
    if (isAuthenticated) {
      connectToSocket();
    }
    return () => {
      setSocketConnection(false);
      websocketService.disconnect();
    };
  }, [isAuthenticated, user]);
  return (
		<ChatProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/explore" element={<Explore />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
		</ChatProvider>
  );
}

export default App;
