import { Container } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import AuthProvider from "../contexts/AuthContext";
import Login from "./authentication/Login";
import Signup from "./authentication/Signup";
import PrivateRoute from "./authentication/PrivateRoute";
import ForgotPassword from "./authentication/ForgotPassword";
import UpdateProfile from "./authentication/UpdateProfile";
import Profile from "./authentication/Profile";
import Dashboard from "./google-drive/Dashboard";
import Navbar from "./google-drive/Navbar"

function App() {
   return (
      <AuthProvider>
        <Navbar />
         <Routes>
            <Route
               exact
               path="/"
               element={
                  <PrivateRoute>
                     <Dashboard />
                  </PrivateRoute>
               }
            />
            <Route
               exact
               path="/folder/:folderId"
               element={
                  <PrivateRoute>
                     <Dashboard />
                  </PrivateRoute>
               }
            />
            <Route
               path="/user"
               element={
                  <PrivateRoute>
                     <Profile />
                  </PrivateRoute>
               }
            />
            <Route
               path="/update-profile"
               element={
                  <PrivateRoute>
                     <UpdateProfile />
                  </PrivateRoute>
               }
            />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
         </Routes>
      </AuthProvider>
   );
}

export default App;
