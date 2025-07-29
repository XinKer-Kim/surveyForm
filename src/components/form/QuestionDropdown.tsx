import { FC } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface OptionItem {
  id: string;
  label: string;
}

interface Props {
  options: OptionItem[];
  onOptionChange: (label: string, idx: number) => void;
  onDeleteOption: (idx: number) => void;
  onAddOption: () => void;
  disabled?: boolean;
}

const QuestionDropdown: FC<Props> = ({
  options,
  onOptionChange,
  onDeleteOption,
  onAddOption,
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
      <div className="flex gap-2 mt-2">
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
    </div>
  );
};

export default QuestionDropdown;
