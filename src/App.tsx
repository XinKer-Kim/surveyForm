
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FormBuilderPage from "./pages/FormBuilderPage";
import ResponsePage from "./pages/ResponsePage";
import MainLayout from "./components/layouts/MainLayout";
import HomePage from "./pages/HomePage"; // HomePage import
import NavBar from "./components/navbar/NavBar";
import MyFormList from "@/pages/MyFormList"; // 경로에 맞게 조정
import MyTakenList from "@/pages/MyTakenList"; // 경로에 맞게 조정
import ResultPage from "@/pages/ResultPage"; // 경로에 맞게 조정
import SignIn from "@/pages/auth/sign-in";
import SignUp from "@/pages/auth/sign-up";
import { NAVBAR_PADDING_TOP_CLASS } from "./constants/layout";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <main className={NAVBAR_PADDING_TOP_CLASS}>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* 첫 화면 = HomePage */}
            <Route path="/builder/new" element={<FormBuilderPage />} />
            {/* 새 설문 생성 경로 */}
            <Route path="/builder/:formId" element={<FormBuilderPage />} />
            {/* 설문 수정 경로 */}
            <Route path="/responses/:formId" element={<ResponsePage />} />
            {/* 개별 폼 응답 조회 */}
            <Route path="/list" element={<MyFormList />} />
            {/* 내 설문(목록 페이지)*/}
            <Route path="/results/:formId" element={<ResultPage />} />
            {/* 결과확인 - 설문결과 */}

            <Route path="/bookmarks" element={<MyTakenList />} />
            {/* 참여한 설문(목록 페이지)*/}

            <Route path="/sign-in" element={<SignIn />} />
            {/* 로그인 */}
            <Route path="/sign-up" element={<SignUp />} />
            {/* 회원가입 */}
          </Routes>
        </MainLayout>
      </main>
    </BrowserRouter>
  );
}

export default App;
