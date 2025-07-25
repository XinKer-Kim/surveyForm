import { FC } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface OptionItem {
  id: string;
  label: string;
}

interface QuestionMultipleChoiceProps {
  options: OptionItem[];
  hasEtc: boolean;
  allowMultiple: boolean;
  onOptionChange: (label: string, idx: number) => void;
  onDeleteOption: (idx: number) => void;
  onAddOption: () => void;
  onToggleEtc: () => void;
  onToggleMultiple: () => void;
  disabled?: boolean;
}

const QuestionMultipleChoice: FC<QuestionMultipleChoiceProps> = ({
  options,
  hasEtc,
  allowMultiple,
  onOptionChange,
  onDeleteOption,
  onAddOption,
  onToggleEtc,
  onToggleMultiple,
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
          >
            삭제
          </Button>
        </div>
      ))}
      <div className="flex gap-2 mt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddOption}
          disabled={disabled}
        >
          + 선택지 추가
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onToggleEtc}
          disabled={disabled}
        >
          {hasEtc ? "✔ 기타 허용됨" : "기타 허용"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onToggleMultiple}
          disabled={disabled}
        >
          {allowMultiple ? "✔ 복수 선택 가능" : "복수 선택 허용"}
        </Button>
      </div>
    </div>
  );
};

export default QuestionMultipleChoice;
