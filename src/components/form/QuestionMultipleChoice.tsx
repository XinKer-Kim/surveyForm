import type { FC } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import QuestionFooterSwitch from "./QuestionFooterSwitch";

interface OptionItem {
  id: string;
  label: string;
  value?: string;
}

interface QuestionMultipleChoiceProps {
  options: OptionItem[];
  hasEtc: boolean;
  required: boolean;
  allowMultiple: boolean;
  onOptionChange: (label: string, idx: number) => void;
  onDeleteOption: (idx: number) => void;
  onAddOption: () => void;
  onToggleEtc: () => void;
  onToggleRequired: () => void;
  onToggleMultiple: () => void;
  disabled?: boolean;
}

const QuestionMultipleChoice: FC<QuestionMultipleChoiceProps> = ({
  options,
  hasEtc,
  required,
  allowMultiple,
  onOptionChange,
  onDeleteOption,
  onAddOption,
  onToggleEtc,
  onToggleRequired,
  onToggleMultiple,
  disabled,
}) => {
  return (
    <div className="space-y-2">
      {/* 객관식 선택지 리스트 */}
      {options.map((opt, idx) => {
        if (opt.value !== "etc")
          return (
            <div key={opt.id} className="flex items-center gap-2">
              <Input
                type="text"
                value={opt.label}
                onChange={(e) => onOptionChange(e.target.value, idx)}
                placeholder={`선택지 ${idx + 1}`} // ✅ 여기에!
                disabled={disabled}
                className="flex-grow"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => onDeleteOption(idx)}
                disabled={disabled}
                className="cursor-pointer"
              >
                삭제
              </Button>
            </div>
          );
      })}
      <div className="flex flex-col gap-2 mt-2">
        {/*
          '기타' Input 태그.
          hasEtc === true 일 때만 활성화 및 Option 리스트에 추가.
        */}
        {hasEtc ? (
          <div className="flex items-center gap-2">
            <Input disabled className="flex-grow" placeholder="기타" />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={onToggleEtc}
              disabled={disabled}
              className="cursor-pointer"
            >
              삭제
            </Button>
          </div>
        ) : (
          <></>
        )}

        <div className="grid grid-cols-3 gap-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddOption}
            disabled={disabled}
          >
            + 선택지 추가
          </Button>
          {!hasEtc ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onToggleEtc}
              disabled={disabled}
            >
              '기타' 추가
            </Button>
          ) : (
            <></>
          )}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <QuestionFooterSwitch
            label="답변 필수"
            onCheckedChange={onToggleRequired}
            checked={required}
            disabled={disabled}
          />
          <QuestionFooterSwitch
            label="복수 선택"
            onCheckedChange={onToggleMultiple}
            checked={allowMultiple}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionMultipleChoice;
