import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

interface QuestionTitleProps {
  handleAddInput: () => void;
  handleAddPage: () => void;
}

function QuestionTitle({ handleAddInput, handleAddPage }: QuestionTitleProps) {
  return (
    <>
      <div className="flex flex-col items-start border rounded-md p-4 gap-4">
        {/* '설문 제목 입력', '설명 입력', '설문 기간' 필드 컨테이너 */}
        <div className="w-full flex flex-col gap-2">
          <Input
            type="text"
            className="p-0 border-x-0 border-t-0 border-b-2 border-transparent shadow-none rounded-none !text-lg font-bold placeholder:text-neutral-300 focus-visible:ring-0 focus-visible:ring-offset-0 hover:border-neutral-300"
            placeholder="설문 제목 입력"
          />
          <Input
            type="text"
            className="p-0 border-x-0 border-t-0 border-b-2 border-transparent shadow-none rounded-none !text-sm font-base placeholder:text-neutral-300 focus-visible:ring-0 focus-visible:ring-offset-0 hover:border-neutral-300"
            placeholder="설명 입력"
          />
          <div className="flex flex-row items-center justify-start gap-2 ">
            <p className="w-20 text-xs">설문 기간</p>
            <Dialog>
              <DialogTrigger asChild>
                <Input
                  type="text"
                  readOnly
                  onClick={() => console.log('ㅎㅇ')}
                  className="focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </DialogTrigger>
              <DialogContent className="sm:max-w-xs [&>button]:hidden">
                <DialogHeader>
                  <DialogTitle className="flex justify-center py-1 text-base">
                    설문 기간
                  </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-start gap-6">
                  <div className="flex flex-row gap-2">
                    <Label className="pr-4">시작</Label>
                    <RadioGroup
                      defaultValue="comfortable"
                      className="flex flex-row gap-6"
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="start" id="r1" />
                        <Label htmlFor="r1">즉시 시작</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="custom" id="r2" />
                        <Label htmlFor="r2">직접 설정</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="flex flex-row gap-2">
                    <Label className="pr-4">종료</Label>
                    <RadioGroup
                      defaultValue="comfortable"
                      className="flex flex-row gap-6"
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="noLimit" id="r1" />
                        <Label htmlFor="r1">제한 없음</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="custom" id="r2" />
                        <Label htmlFor="r2">직접 설정</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                <DialogFooter className="sm:justify-start">
                  <div className="w-full flex items-center justify-center gap-2">
                    <DialogClose asChild>
                      <Button
                        type="button"
                        className="w-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded"
                        onClick={handleAddPage}
                      >
                        취소
                      </Button>
                    </DialogClose>
                    <Button
                      type="button"
                      className="w-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded"
                      onClick={handleAddPage}
                    >
                      확인
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
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
