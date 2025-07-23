import { Skeleton } from "@/components/ui/skeleton";

function HomePage() {
  return (
    <div className="page">
      <div className="container">
        <div className="flex flex-col gap-4 w-full max-w-[1000px]">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            원하는 설문을 만들어보세요!
          </h4>
          {/* 템플릿 영역 */}
          <div className="w-full grid grid-cols-5 gap-6">
            <Skeleton className="w-full h-[170px] bg-amber-500" />
            <Skeleton className="w-full h-[170px] bg-amber-500" />
            <Skeleton className="w-full h-[170px] bg-amber-500" />
            <Skeleton className="w-full h-[170px] bg-amber-500" />
            <Skeleton className="w-full h-[170px] bg-amber-500" />
            <Skeleton className="w-full h-[170px] bg-amber-500" />
            <Skeleton className="w-full h-[170px] bg-amber-500" />
            <Skeleton className="w-full h-[170px] bg-amber-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
