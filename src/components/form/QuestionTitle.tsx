import { useState } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import DateConfigRow from './DateConfigRow';
import { DialogDescription } from '@radix-ui/react-dialog';

interface QuestionTitleProps {
  handleAddInput: () => void;
  handleAddPage: () => void;
}

function QuestionTitle({ handleAddInput, handleAddPage }: QuestionTitleProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [startType, setStartType] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endType, setEndType] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [dateConfig, setDateConfig] = useState<string>('');

  const handleDialogConfirm = () => {
    setDateConfig(
      `${
        startDate === '' || startType !== 'custom' ? '바로 시작' : startDate
      } ${startTime} ~ ${
        endDate === '' || endType !== 'custom' ? '제한 없음' : endDate
      } ${endTime}`
    );

    if (isDialogOpen) setIsDialogOpen(false);
  };

  return (
    <>
      <div className="flex flex-col items-start border border-t-4 border-naver rounded-b-md p-4 gap-4">
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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Input
                  readOnly
                  type="text"
                  value={dateConfig}
                  className="focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </DialogTrigger>
              <DialogContent showCloseButton={false} className="sm:max-w-xs">
                <DialogHeader>
                  <DialogTitle className="flex justify-center py-1 text-base">
                    설문 기간
                  </DialogTitle>
                  <DialogDescription />
                </DialogHeader>
                <div className="flex flex-col items-start gap-8">
                  <DateConfigRow
                    radioGroup={{
                      label: '시작',
                      options: [
                        { value: 'start', label: '즉시 시작' },
                        { value: 'custom', label: '직접 설정' },
                      ],
                      defaultValue: 'start',
                      onValueChange: (value) => setStartType(value),
                    }}
                    dateType={startType}
                    formDate={startDate}
                    formTime={startTime}
                    onSetDateChange={setStartDate}
                    onSetTimeChange={setStartTime}
                  />
                  <DateConfigRow
                    radioGroup={{
                      label: '종료',
                      options: [
                        { value: 'noLimit', label: '제한 없음' },
                        { value: 'custom', label: '직접 설정' },
                      ],
                      defaultValue: 'noLimit',
                      onValueChange: (value) => setEndType(value),
                    }}
                    dateType={endType}
                    formDate={endDate}
                    formTime={endTime}
                    onSetDateChange={setEndDate}
                    onSetTimeChange={setEndTime}
                  />
                </div>
                <DialogFooter className="sm:justify-start">
                  <div className="w-full flex items-center justify-center gap-2">
                    <DialogClose asChild>
                      <Button
                        type="button"
                        className="w-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded"
                      >
                        취소
                      </Button>
                    </DialogClose>
                    <Button
                      type="button"
                      className="w-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded"
                      onClick={handleDialogConfirm}
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
