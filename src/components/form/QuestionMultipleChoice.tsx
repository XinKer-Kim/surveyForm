import { FC } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Props {
  options: string[];
  hasEtc: boolean;
  allowMultiple: boolean;
  onOptionChange: (value: string, idx: number) => void;
  onDeleteOption: (idx: number) => void;
  onAddOption: () => void;
  onToggleEtc: () => void;
  onToggleMultiple: () => void;
}

const QuestionMultipleChoice: FC<Props> = ({
  options,
  hasEtc,
  allowMultiple,
  onOptionChange,
  onDeleteOption,
  onAddOption,
  onToggleEtc,
  onToggleMultiple,
}) => {
  return (
    <div className="space-y-3 mt-4">
      {options.map((opt, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <Input
            value={opt}
            onChange={(e) => onOptionChange(e.target.value, idx)}
            placeholder={`항목 ${idx + 1}`}
            className="flex-1"
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => onDeleteOption(idx)}
            className="text-gray-500 hover:text-red-500"
          >
            ✕
          </Button>
        </div>
      ))}

      {hasEtc && (
        <div className="flex items-center gap-2 text-muted-foreground italic">
          <span>기타</span>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={onToggleEtc}
            className="text-gray-500 hover:text-red-500"
          >
            ✕
          </Button>
        </div>
      )}

      <div className="flex items-center gap-3 mt-2">
        <Button type="button" size="sm" variant="outline" onClick={onAddOption}>
          + 항목 추가
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onToggleEtc}
          disabled={hasEtc}
        >
          ‘기타’ 추가
        </Button>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="multiple"
            checked={allowMultiple}
            onCheckedChange={onToggleMultiple}
          />
          <Label htmlFor="multiple">복수 선택 허용</Label>
        </div>
      </div>
    </div>
  );
};

export default QuestionMultipleChoice;
