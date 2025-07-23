import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage"; // HomePage import
import SignIn from "./pages/auth/sign-in";
import SignUp from "./pages/auth/sign-up";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* 첫 화면을 HomePage로 변경 */}
        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
