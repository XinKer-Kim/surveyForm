import type { FC } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Star } from "lucide-react";
import QuestionFooterSwitch from "./QuestionFooterSwitch";

interface Props {
  unit: 0.5 | 1;
  required: boolean;
  onChangeUnit: (unit: 0.5 | 1) => void;
  onToggleRequired: () => void;
  disabled?: boolean;
}

const QuestionStarRating: FC<Props> = ({
  unit,
  required,
  onChangeUnit,
  onToggleRequired,
  disabled,
}) => {
  return (
    <div className="space-y-2 mt-2">
      <div className="flex items-center gap-1 text-yellow-500">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className="w-6 h-6"
            fill="
              {/*currentColor*/}
              "
          />
        ))}
        <span className="ml-2 text-sm text-gray-700">별점 미리보기</span>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
            <span>단위</span>
            <Select
              value={unit.toString()}
              onValueChange={(v) => onChangeUnit(parseFloat(v) as 0.5 | 1)}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="단위 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="0.5">0.5</SelectItem>
              </SelectContent>
            </Select>
          </div>
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

export default QuestionStarRating;
