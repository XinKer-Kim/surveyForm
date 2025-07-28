import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Link, useLocation } from "react-router-dom";
import NavLink from "./NavLink";
import { NAVBAR_HEIGHT_CLASS } from "@/constants/layout";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";

const links = [
  { to: "/list", label: "내 설문" },
  { to: "/bookmarks", label: "참여한 설문" },
];

function NavBar() {
  const location = useLocation();
  const pathname = location.pathname;
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut(); // Supabase 로그아웃
    sessionStorage.removeItem("supabase_session"); // 세션스토리지 정리
    clearUser(); // Zustand 상태 정리
    navigate("/"); // 홈으로 이동
  };
  return (
    <>
      <header className="w-full flex flex-row items-center justify-center z-20 bg-white shadow-xs fixed">
        <div
          className={`w-full ${NAVBAR_HEIGHT_CLASS} flex flex-row items-center justify-between px-8 font-bold`}
        >
          {/* '내 설문', '참여한 설문' 버튼 */}
          <div className="h-full flex flex-row items-center gap-4 text-lg">
            <Link to={"/"}>
              <img
                src="src/assets/icons/logo.png"
                alt="@Logo"
                className="w-[40px] h-[40px]"
              />
            </Link>
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                isActive={pathname === link.to}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          {/* '설문 만들기' 버튼 , 로그인 버튼 */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-lg font-semibold">{user.username}</span>
                <Link
                  to="/sign-in"
                  onClick={handleLogout}
                  className=" text-gray-600 hover:text-black"
                >
                  로그아웃
                </Link>
              </>
            ) : (
              <Link to="/sign-in">로그인</Link>
            )}
            {pathname === "/list" ? (
              <Button className="flex items-center justify-center font-semibold rounded-4xl bg-naver">
                <Plus className="!w-[16px] !h-[16px]" strokeWidth={3} />
                설문 만들기
              </Button>
            ) : (
              <></>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default NavBar;
