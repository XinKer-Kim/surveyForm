import { CalendarFold, Mail, Mars, Plus, User, Venus } from "lucide-react";
import { Button } from "../ui/button";
import { Link, useLocation } from "react-router-dom";
import NavLink from "./NavLink";
import { NAVBAR_HEIGHT_CLASS } from "@/constants/layout";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import { useState, useRef, useEffect } from "react";

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

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await supabase.auth.signOut(); // Supabase 로그아웃
    sessionStorage.removeItem("supabase_session"); // 세션스토리지 정리
    clearUser(); // Zustand 상태 정리
    navigate("/"); // 홈으로 이동
  };
  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as any).contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
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
                src="/logo.png"
                alt="@Logo"
                className="w-[40px] h-[40px] sm:w-10 sm:h-10 object-contain"
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
          <div className="flex items-center gap-4 relative" ref={dropdownRef}>
            {user ? (
              <>
                <span
                  className="text-lg font-semibold cursor-pointer"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                >
                  {user.username}
                </span>

                {/* 드롭다운 박스 */}
                {dropdownOpen && (
                  <div className="absolute top-8 right-0 mt-2 w-60 bg-white border rounded-lg shadow-md p-4 z-50">
                    <div className=" flex flex-col gap-6 text-sm text-gray-700">
                      <p className="flex gap-1">
                        <strong className="flex items-center gap-1">
                          <Mail size={16} />
                          이메일:
                        </strong>{" "}
                        {user.email || "없음"}
                      </p>
                      <p className="flex items-center gap-1">
                        <strong className="flex gap-1">
                          <User size={16} />
                          성별:
                        </strong>{" "}
                        {(user.gender ?? "") === "male" && (
                          <>
                            <Mars size={16} className="text-blue-500" />
                          </>
                        )}
                        {(user.gender ?? "") === "female" && (
                          <>
                            <Venus size={16} className="text-pink-500" />
                          </>
                        )}
                        {!["male", "female"].includes(user.gender ?? "") &&
                          "없음"}
                      </p>
                      <p className="flex gap-1">
                        <strong className="flex items-center gap-1">
                          <CalendarFold size={16} /> 생년월일:
                        </strong>{" "}
                        {user.birthdate || "없음"}
                      </p>
                      <div className="flex flex-col">
                        <hr className="my-2" />
                        <button
                          onClick={handleLogout}
                          className="text-black-500 hover:text-black-700 text-sm font-medium cursor-pointer"
                        >
                          로그아웃
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Link to="/sign-in">로그인</Link>
            )}

            {pathname === "/list" && (
              <Button
                onClick={() => navigate("/builder/new")}
                className="flex items-center justify-center font-semibold rounded-4xl bg-naver cursor-pointer"
              >
                <Plus className="!w-[16px] !h-[16px]" strokeWidth={3} />
                설문 만들기
              </Button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default NavBar;
