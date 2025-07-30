import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "../ui/dialog";
import { Input } from "../ui/input";
import DateConfigRow from "./DateConfigRow";
import { formatDate, formatTime } from "@/utils/dateUtils";
import { SurveyPeriod } from "@/constants/survey";

interface QuestionTitleProps {
  title: string;
  description: string;
  startType: string;
  startDateTime: Date | undefined;
  startDate: string;
  startTime: string;
  endType: string;
  endDateTime: Date | undefined;
  endDate: string;
  endTime: string;
  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDescriptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setStartType: React.Dispatch<React.SetStateAction<string>>;
  setStartDate: React.Dispatch<React.SetStateAction<string>>;
  setStartTime: React.Dispatch<React.SetStateAction<string>>;
  setEndType: React.Dispatch<React.SetStateAction<string>>;
  setEndDate: React.Dispatch<React.SetStateAction<string>>;
  setEndTime: React.Dispatch<React.SetStateAction<string>>;
  handleAddInput: () => void;
  handleAddPage: () => void;
}

function QuestionTitle({
  title,
  description,
  startType,
  startDateTime,
  startDate,
  startTime,
  endType,
  endDateTime,
  endDate,
  endTime,
  handleTitleChange,
  handleDescriptionChange,
  setStartType,
  setStartDate,
  setStartTime,
  setEndType,
  setEndDate,
  setEndTime,
  handleAddInput,
  handleAddPage,
}: QuestionTitleProps) {
  // Dialog 내에서 관리되는 임시 상태 변수들.
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [startTypeState, setStartTypeState] = useState<string>(
    startDateTime ? SurveyPeriod.CUSTOM : SurveyPeriod.START
  );
  const [startDateState, setStartDateState] = useState<string>(
    formatDate(startDateTime)
  );
  const [startTimeState, setStartTimeState] = useState<string>(
    formatTime(startDateTime)
  );
  const [endTypeState, setEndTypeState] = useState<string>(
    endDateTime ? SurveyPeriod.CUSTOM : SurveyPeriod.UNLIMITED
  );
  const [endDateState, setEndDateState] = useState<string>(
    formatDate(endDateTime)
  );
  const [endTimeState, setEndTimeState] = useState<string>(
    formatTime(endDateTime)
  );

  useEffect(() => {
    setStartType(startType);
    setStartDate(formatDate(startDateTime));
    setStartTime(formatTime(startDateTime));

    setStartTypeState(startType);
    setStartDateState(formatDate(startDateTime));
    setStartTimeState(formatTime(startDateTime));
  }, [startDateTime, isDialogOpen]);

  useEffect(() => {
    setEndType(endType);
    setEndDate(formatDate(endDateTime));
    setEndTime(formatTime(endDateTime));

    setEndTypeState(endType);
    setEndDateState(formatDate(endDateTime));
    setEndTimeState(formatTime(endDateTime));
  }, [endDateTime, isDialogOpen]);

  const dateConfig = useMemo(() => {
    const startPart =
      startType !== SurveyPeriod.CUSTOM
        ? "즉시 시작"
        : `${startDate} ${startTime}`;
    const endPart =
      endType !== SurveyPeriod.CUSTOM ? "제한 없음" : `${endDate} ${endTime}`;

    return `${startPart} ~ ${endPart}`;
  }, [startType, startDate, startTime, endType, endDate, endTime]);

  const handleDialogConfirm = () => {
    setStartType(startTypeState);
    setStartDate(startDateState);
    setStartTime(startTimeState);
    setEndType(endTypeState);
    setEndDate(endDateState);
    setEndTime(endTimeState);

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
            defaultValue={title}
            onChange={handleTitleChange}
          />
          <Input
            type="text"
            className="p-0 border-x-0 border-t-0 border-b-2 border-transparent shadow-none rounded-none !text-sm font-base placeholder:text-neutral-300 focus-visible:ring-0 focus-visible:ring-offset-0 hover:border-neutral-300"
            placeholder="설명 입력"
            defaultValue={description}
            onChange={handleDescriptionChange}
          />
          {/* 설문 기간 Dialog */}
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
                      label: "시작",
                      options: [
                        { value: SurveyPeriod.START, label: "즉시 시작" },
                        { value: SurveyPeriod.CUSTOM, label: "직접 설정" },
                      ],
                      defaultValue: SurveyPeriod.START,
                      onValueChange: (value) => setStartTypeState(value),
                    }}
                    dateType={startTypeState}
                    formDate={startDateState}
                    formTime={startTimeState}
                    onSetDateChange={setStartDateState}
                    onSetTimeChange={setStartTimeState}
                  />
                  <DateConfigRow
                    radioGroup={{
                      label: "종료",
                      options: [
                        { value: SurveyPeriod.UNLIMITED, label: "제한 없음" },
                        { value: SurveyPeriod.CUSTOM, label: "직접 설정" },
                      ],
                      defaultValue: SurveyPeriod.UNLIMITED,
                      onValueChange: (value) => setEndTypeState(value),
                    }}
                    dateType={endTypeState}
                    formDate={endDateState}
                    formTime={endTimeState}
                    onSetDateChange={setEndDateState}
                    onSetTimeChange={setEndTimeState}
                  />
                </div>
                <DialogFooter className="sm:justify-start">
                  <div className="w-full flex items-center justify-center gap-2">
                    <DialogClose asChild>
                      <Button
                        type="button"
                        className="w-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded cursor-pointer"
                      >
                        취소
                      </Button>
                    </DialogClose>
                    <Button
                      type="button"
                      className="w-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded cursor-pointer"
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
            className="w-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded cursor-pointer"
            onClick={handleAddInput}
          >
            질문 추가
          </Button>
          <Button
            className="w-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded cursor-pointer"
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
