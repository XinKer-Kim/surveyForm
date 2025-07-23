import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FormBuilderPage from './pages/FormBuilderPage';
import ResponsePage from './pages/ResponsePage';
import MainLayout from './components/layouts/MainLayout';
import HomePage from './pages/HomePage'; // HomePage import
import NavBar from './components/navbar/NavBar';
import { NAVBAR_PADDING_TOP_CLASS } from './constants/layout';
import SignIn from './pages/auth/sign-in';
import SignUp from './pages/auth/sign-up';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <main className={NAVBAR_PADDING_TOP_CLASS}>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />{' '}
            {/* 첫 화면을 HomePage로 변경 */}
            <Route path="/builder/new" element={<FormBuilderPage />} />{' '}
            {/* 새 설문 생성 경로 */}
            <Route path="/builder/:formId" element={<FormBuilderPage />} />{' '}
            {/* 설문 수정 경로 */}
            <Route path="/responses/:formId" element={<ResponsePage />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
          </Routes>
        </MainLayout>
      </main>
    </BrowserRouter>
  );
}

export default App;
