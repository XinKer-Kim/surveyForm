import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage"; // HomePage import
import SignIn from "./pages/auth/sign-in";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* 첫 화면을 HomePage로 변경 */}
        <Route path="sign-in" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
