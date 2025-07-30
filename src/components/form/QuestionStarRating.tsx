import { FC } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Star } from "lucide-react";

interface Props {
  unit: 0.5 | 1;
  onChangeUnit: (unit: 0.5 | 1) => void;
  disabled?: boolean;
}

const QuestionStarRating: FC<Props> = ({ unit, onChangeUnit }) => {
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

      <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
        <span>단위</span>
        <Select
          value={unit.toString()}
          onValueChange={(v) => onChangeUnit(parseFloat(v) as 0.5 | 1)}
        >
          <SelectTrigger className="w-[80px] cursor-pointer">
            <SelectValue placeholder="단위 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="cursor-pointer" value="1">
              1
            </SelectItem>
            <SelectItem className="cursor-pointer" value="0.5">
              0.5
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default QuestionStarRating;
