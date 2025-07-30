import type { FC } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import QuestionFooterSwitch from "./QuestionFooterSwitch";

interface OptionItem {
  id: string;
  label: string;
}

interface Props {
  options: OptionItem[];
  required: boolean;
  onOptionChange: (value: string, idx: number) => void;
  onDeleteOption: (idx: number) => void;
  onAddOption: () => void;
  onToggleRequired: () => void;
  disabled?: boolean;
}

const QuestionDropdown: FC<Props> = ({
  options,
  required,
  onOptionChange,
  onDeleteOption,
  onAddOption,
  onToggleRequired,
  disabled,
}) => {
  return (
    <div className="space-y-2">
      {options.map((opt, idx) => (
        <div key={opt.id} className="flex items-center gap-2">
          <Input
            type="text"
            value={opt.label}
            onChange={(e) => onOptionChange(e.target.value, idx)}
            placeholder={`항목 ${idx + 1}`}
            disabled={disabled}
            className="flex-grow"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => onDeleteOption(idx)}
            disabled={disabled}
          >
            삭제
          </Button>
        </div>
      ))}
      <div className="flex flex-col gap-2 mt-4">
        <div className="grid grid-cols-3 gap-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddOption}
            disabled={disabled}
          >
            + 항목 추가
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <QuestionFooterSwitch
            label="답변 필수"
            onCheckedChange={onToggleRequired}
            checked={required}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionDropdown;
