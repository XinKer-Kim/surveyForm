import { Skeleton } from "./components/ui/skeleton";

function HomePage() {
  return (
    <div className="page">
      <div className="container">
        <div>원하는 설문을 만들어보세요!</div>
        {/* 템플릿 영역 */}
        <div>
          <Skeleton />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
