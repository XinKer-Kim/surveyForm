import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface QuestionTitleProps {
  handleAddInput: () => void;
  handleAddPage: () => void;
}

function QuestionTitle({ handleAddInput, handleAddPage }: QuestionTitleProps) {
  return (
    <>
      <div className="flex flex-col items-start border rounded-md p-4">
        {/* '설문 제목 입력', '설명 입력', '설문 기간' 필드 컨테이너 */}
        <div className="w-full flex flex-col">
          <Input
            type="text"
            className="p-0 border-x-0 border-t-0 border-b-2 border-transparent shadow-none rounded-none !text-lg font-bold placeholder:text-neutral-300 focus-visible:ring-0 focus-visible:ring-offset-0 hover:border-black focus:border-naver"
            placeholder="설문 제목 입력"
          />
          <p>설명 입력</p>
        </div>
        {/* '질문 추가', '페이지 추가' 버튼 컨테이너 */}
        <div className="w-full flex items-center justify-center gap-2">
          <Button
            className="w-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded"
            onClick={handleAddInput}
          >
            질문 추가
          </Button>
          <Button
            className="w-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded"
            onClick={handleAddPage}
          >
            페이지 추가
          </Button>
        </div>
        {/* 다른 폼 요소 추가 버튼들을 만들 수 있습니다. */}
      </div>
    </>
  );
}

export default QuestionTitle;
