import { useMemo, useRef, useState } from "react";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon, CheckIcon, ClockIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/dateUtils";
import { SurveyPeriod } from "@/constants/survey";

interface RadioGroupProps {
  label: string;
  defaultValue?: string;
  options: {
    value: string;
    label: string;
  }[];
  onValueChange?: (value: string) => void;
}

interface DateConfigRowProps {
  radioGroup: RadioGroupProps;
  dateType: string;
  formDate: string;
  formTime: string;
  onValueChange?: (value: string) => void;
  onSetDateChange: (value: string) => void;
  onSetTimeChange: (value: string) => void;
}

function isValidDate(date: Date | undefined) {
  if (!date) return false;

  return !isNaN(date.getTime());
}

function DateConfigRow({
  radioGroup,
  onSetDateChange,
  onSetTimeChange,
  dateType,
  formDate,
  formTime,
}: DateConfigRowProps) {
  const parsedDate: Date | undefined =
    formDate === "" || dateType !== SurveyPeriod.CUSTOM
      ? undefined
      : new Date(formDate.replaceAll(". ", "-").slice(0, -1));

  const parsedTime: string | undefined =
    formDate === "" || dateType !== SurveyPeriod.CUSTOM ? undefined : formTime;

  // 라디오 그룹 상태 관리
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    dateType
  );

  // 캘린더 상태 관리
  const [openCalendar, setOpenCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    parsedDate
  );
  const [month, setMonth] = useState<Date | undefined>(parsedDate);
  const [formattedDate, setFormattedDate] = useState<string>(
    formatDate(selectedDate)
  );
  const dateInput = useRef<HTMLButtonElement>(null);

  // 시간 선택 드롭다운 상태 관리
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    parsedTime
  );
  const timeInput = useRef<HTMLButtonElement>(null);

  const handleValueChange = (value: string) => {
    setSelectedValue(value);
    if (radioGroup.onValueChange) radioGroup.onValueChange(value);
  };

  // 30분 간격의 시간 목록 동적 생성 (00:00 ~ 23:30).
  const timeOptions = useMemo(() => {
    const timeList = [];
    for (let i = 0; i < 48; i++) {
      const hour = Math.floor(i / 2);
      const minute = (i % 2) * 30;
      const period = hour < 12 ? "오전" : "오후";
      let displayHour = hour % 12;

      if (displayHour === 0) displayHour = 12;

      const timeStr = `${period} ${String(displayHour).padStart(
        2,
        "0"
      )}:${String(minute).padStart(2, "0")}`;

      timeList.push(timeStr);
    }
    return timeList;
  }, []);

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* 라디오 버튼 그룹 */}
        <div className="flex flex-row gap-2">
          <Label className="w-12 flex-shrink-0 pr-4">{radioGroup.label}</Label>
          <RadioGroup
            defaultValue={selectedValue}
            onValueChange={handleValueChange}
            className="flex flex-row gap-6"
          >
            {radioGroup.options.map((option) => {
              const uid = `${radioGroup.label}-${option.value}`;
              return (
                <div key={uid} className="flex items-center gap-3">
                  <RadioGroupItem id={uid} value={option.value} />
                  <Label htmlFor={uid}>{option.label}</Label>
                </div>
              );
            })}
          </RadioGroup>
        </div>

        {/* '직접 설정' 체크 시 컴포넌트 활성화. */}
        {selectedValue === SurveyPeriod.CUSTOM && (
          <div className="flex flex-col gap-2">
            {/* 캘린더 */}
            <div className="relative flex gap-2">
              <Input
                readOnly
                id={`${radioGroup.label}-date`}
                value={formattedDate}
                placeholder="날짜 선택"
                className="bg-background pl-10"
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setFormattedDate(e.target.value);
                  if (isValidDate(date)) {
                    setSelectedDate(date);
                    setMonth(date);
                  }
                }}
                onClick={() => dateInput.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setOpenCalendar(true);
                  }
                }}
              />
              <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                <PopoverTrigger asChild>
                  <Button
                    id="date-picker"
                    variant="ghost"
                    className="absolute top-1/2 left-2 size-6 -translate-y-1/2"
                    ref={dateInput}
                  >
                    <CalendarIcon className="size-4.5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                  alignOffset={-8}
                  sideOffset={10}
                >
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    captionLayout="dropdown"
                    month={month}
                    onMonthChange={setMonth}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setFormattedDate(formatDate(date));
                      setOpenCalendar(false);
                      onSetDateChange(formatDate(date));
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            {/* 설문 시간 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="relative flex gap-2">
                  <Input
                    readOnly
                    id={`${radioGroup.label}-date`}
                    value={selectedTime}
                    placeholder="시간 선택"
                    className="bg-background pl-10"
                    onClick={() => timeInput.current?.click()}
                  />
                  <Button
                    id="time-picker"
                    variant="ghost"
                    className="absolute top-1/2 left-2 size-6 -translate-y-1/2"
                    ref={timeInput}
                  >
                    <ClockIcon className="size-4.5" />
                  </Button>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60" align="center">
                <ScrollArea className="h-72">
                  {timeOptions.map((time) => (
                    <DropdownMenuItem
                      key={time}
                      onSelect={() => {
                        setSelectedTime(time);
                        onSetTimeChange(time);
                      }}
                      className={cn(
                        "cursor-pointer",
                        selectedTime === time ? "text-naver" : "text-black"
                      )}
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4 text-naver",
                          selectedTime === time ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {time}
                    </DropdownMenuItem>
                  ))}
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </>
  );
}

export default DateConfigRow;
