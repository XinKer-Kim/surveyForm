import { FC, useState, useEffect } from "react";
import Input from "./Input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Props {
  min: number;
  max: number;
  left_label: string;
  right_label: string;
  onChange: (
    partial: Partial<{
      min: number;
      max: number;
      left_label: string;
      right_label: string;
    }>
  ) => void;
  disabled?: boolean;
}

const QuestionScore: FC<Props> = ({
  min,
  max,
  left_label,
  right_label,
  onChange,
}) => {
  const [scoreMin, setScoreMin] = useState<number>(min ?? 0);
  const [scoreMax, setScoreMax] = useState<number>(max ?? 5);
  const [labelLeft, setLabelLeft] = useState(left_label ?? "");
  const [labelRight, setLabelRight] = useState(right_label ?? "");

  const handleMinChange = (val: string) => {
    const newMin = parseInt(val);
    setScoreMin(newMin);
    if (scoreMax <= newMin) {
      const autoMax = newMin + 1;
      setScoreMax(autoMax);
      onChange({ min: newMin, max: autoMax });
    } else {
      onChange({ min: newMin });
    }
  };

  const handleMaxChange = (val: string) => {
    const newMax = parseInt(val);
    setScoreMax(newMax);
    onChange({ max: newMax });
  };
  useEffect(() => {
    console.log(min, max, left_label, right_label);
    onChange({
      min: scoreMin,
      max: scoreMax,
      left_label: labelLeft,
      right_label: labelRight,
    });
  }, []);
  return (
    <div className="space-y-3 mt-2">
      {/* 점수 미리보기 표시 */}
      <div className="flex justify-between px-2">
        {[...Array(scoreMax - scoreMin + 1)].map((_, idx) => {
          const score = scoreMin + idx;
          return (
            <div
              key={idx}
              className="flex flex-col items-center text-sm text-gray-700"
            >
              <div className="w-5 h-5 border rounded-full" />
              <span className="mt-1">{score}</span>
            </div>
          );
        })}
      </div>

      {/* 점수 범위 선택 */}
      <div className="flex gap-2 items-center">
        <span className="text-sm text-gray-600">점수 범위</span>
        <Select value={scoreMin.toString()} onValueChange={handleMinChange}>
          <SelectTrigger className="w-[60px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">0</SelectItem>
            <SelectItem value="1">1</SelectItem>
          </SelectContent>
        </Select>
        <span>~</span>
        <Select value={scoreMax.toString()} onValueChange={handleMaxChange}>
          <SelectTrigger className="w-[60px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 9 }, (_, i) => i + 2)
              .filter((n) => n > scoreMin)
              .map((n) => (
                <SelectItem key={n} value={n.toString()}>
                  {n}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/* 좌우 라벨 */}
      <div className="flex gap-2">
        <Input
          className="w-1/2"
          placeholder={`점수 ${scoreMin}일 경우`}
          value={labelLeft}
          onChange={(e) => {
            setLabelLeft(e.target.value);
            onChange({ left_label: e.target.value });
          }}
        />
        <Input
          className="w-1/2"
          placeholder={`점수 ${scoreMax}일 경우`}
          value={labelRight}
          onChange={(e) => {
            setLabelRight(e.target.value);
            onChange({ right_label: e.target.value });
          }}
        />
      </div>
    </div>
  );
};

export default QuestionScore;
