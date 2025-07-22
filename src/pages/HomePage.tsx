import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">나의 설문들</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* 여기에 사용자의 설문 목록을 불러와서 표시할 수 있습니다. */}
        {/* 임시로 몇 개의 설문 아이템을 넣어두겠습니다. */}
        <div className="bg-white rounded-md shadow-sm p-4">
          <h2 className="font-semibold text-lg">설문 제목 1</h2>
          <p className="text-gray-500 text-sm">생성일: 2025-07-22</p>
          <Link
            to="/builder/1"
            className="inline-block mt-2 text-blue-500 hover:underline"
          >
            수정
          </Link>
          {/* 응답 결과를 보는 링크도 추가할 수 있습니다. */}
        </div>
        <div className="bg-white rounded-md shadow-sm p-4">
          <h2 className="font-semibold text-lg">두 번째 설문</h2>
          <p className="text-gray-500 text-sm">생성일: 2025-07-15</p>
          <Link
            to="/builder/2"
            className="inline-block mt-2 text-blue-500 hover:underline"
          >
            수정
          </Link>
        </div>
        {/* ... 더 많은 설문 아이템 */}
        <div className="bg-gray-100 rounded-md shadow-sm p-4 flex items-center justify-center">
          <Link to="/builder/new" className="text-blue-500 hover:underline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <span className="ml-2">새 설문 만들기</span>
          </Link>
        </div>
      </div>
      {/* 추가적으로 공지사항이나 템플릿 목록 등을 표시할 수 있습니다. */}
    </div>
  );
};

export default HomePage;
