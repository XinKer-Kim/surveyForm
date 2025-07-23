import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { useLocation } from 'react-router-dom';

function NavBar() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <>
      <header className="w-full flex flex-row items-center justify-center z-20 bg-white">
        <div className="w-full h-14 flex flex-row items-center justify-between px-8 font-bold">
          {/* '내 설문', '참여한 설문' 버튼 */}
          <div className="flex flex-row items-center gap-4 text-lg">
            <a href="/list">내 설문</a>
            <a href="/bookmarks">참여한 설문</a>
          </div>
          {/* '설문 만들기' 버튼 */}
          {pathname === '/list' ? (
            <Button className="font-semibold">
              <Plus />
              설문 만들기
            </Button>
          ) : (
            <></>
          )}
        </div>
      </header>
    </>
  );
}

export default NavBar;
