import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./components/store/authStore";

import NavBar from "./components/navbar/NavBar";
import MainLayout from "./components/layouts/MainLayout";
import { NAVBAR_PADDING_TOP_CLASS } from "./constants/layout";

import HomePage from "./pages/HomePage";
import SignIn from "./pages/auth/sign-in";
import SignUp from "./pages/auth/sign-up";
import TakeSurveyPage from "./pages/TakeSurveyPage";
import FormBuilderPage from "./pages/FormBuilderPage";
import MyFormList from "./pages/MyFormList";
import ResultPage from "./pages/ResultPage";
import ResponsePage from "./pages/ResponsePage";
import MyTakenList from "./pages/MyTakenList";
import FormPreviewPage from "./pages/FormPreviewPage";

function App() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("supabase_session");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const location = useLocation();
  const pathname = location.pathname;

  // 비로그인 허용 경로들
  const publicRoutes = [
    // /^\/$/, // 홈
    /^\/sign-in$/,
    /^\/sign-up$/,
    /^\/take\/[^/]+$/, // /take/:formId
  ];

  const isPublic = publicRoutes.some((pattern) => pattern.test(pathname));

  // 로그인 안 됐고, 비공개 라우트라면 → /sign-in 리다이렉트
  if (!user && !isPublic) {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <>
      <NavBar />
      <main className={NAVBAR_PADDING_TOP_CLASS}>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/take/:formId" element={<TakeSurveyPage />} />

            {/* 로그인 필요 라우트들 */}
            <Route path="/builder/:formId" element={<FormBuilderPage />} />
            <Route
              path="/create/template/:templateId"
              element={<FormBuilderPage />}
            />
            <Route path="/list" element={<MyFormList />} />
            <Route path="/results/:formId" element={<ResultPage />} />
            <Route path="/responses/:formId" element={<ResponsePage />} />
            <Route path="/bookmarks" element={<MyTakenList />} />
            <Route path="/preview/:formId" element={<FormPreviewPage />} />
          </Routes>
        </MainLayout>
      </main>
    </>
  );
}

export default function WrappedApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
