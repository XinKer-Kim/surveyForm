import { FC } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Props {
  options: string[];
  hasEtc: boolean;
  onOptionChange: (value: string, idx: number) => void;
  onDeleteOption: (idx: number) => void;
  onAddOption: () => void;
  onToggleEtc: () => void;
}
const QuestionDropdown: FC<Props> = ({
  options,
  onOptionChange,
  onDeleteOption,
  onAddOption,
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

      <div className="flex items-center gap-3 mt-2">
        <Button type="button" size="sm" variant="outline" onClick={onAddOption}>
          + 항목 추가
        </Button>
      </div>
    </div>
  );
};
export default QuestionDropdown;
