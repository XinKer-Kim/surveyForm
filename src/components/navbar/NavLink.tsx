import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface NavLinkProps {
  to: string;
  isActive: boolean;
  children: ReactNode;
}

function NavLink({ to, isActive, children }: NavLinkProps) {
  return (
    <Link
      to={to}
      className="relative h-full flex items-center transition-colors"
    >
      <span className={isActive ? 'text-naver' : 'text-gray-400'}>
        {children}
      </span>

      {/* 네비게이션 활성화 시 밑줄 표시 */}
      {isActive && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-naver" />
      )}
    </Link>
  );
}

export default NavLink;
