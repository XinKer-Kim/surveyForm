// utils/logout.ts 또는 아무 컴포넌트 내부에서 직접 정의

import { supabase } from "@/supabaseClient";
import { useAuthStore } from "@/components/store/authStore";
import { useNavigate } from "react-router-dom";

export function useLogout() {
  const clearUser = useAuthStore((state) => state.clearUser);
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut(); // 1. supabase 로그아웃
    sessionStorage.removeItem("supabase_session"); // 2. 세션 제거
    clearUser(); // 3. 상태 초기화
    navigate("/sign-in"); // 4. 로그인 페이지로 이동
  };

  return logout;
}
