import { FC, useState, useEffect } from "react";
import QuestionShortAnswer from "./QuestionShortAnswer";
import QuestionLongAnswer from "./QuestionLongAnswer";
import QuestionMultipleChoice from "@/components/form/QuestionMultipleChoice";
import QuestionDropdown from "@/components/form/QuestionDropdown";
import QuestionStarRating from "./QuestionStarRating";
import QuestionScore from "./QuestionScore";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Input from "./Input";
import { v4 as uuidv4 } from "uuid";

interface OptionItem {
  id: string;
  label: string;
  value?: string;
}

interface QuestionProps {
  question: any; // TODO: define proper type
  onQuestionChange: (newQuestion: any) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const Question: FC<QuestionProps> = ({
  question,
  onQuestionChange,
  onDuplicate,
  onDelete,
}) => {
  const isLocked = question.hasAnswer;

  const [questionType, setQuestionType] = useState(question.type);
  const [questionText, setQuestionText] = useState(question.text || "");
  const [options, setOptions] = useState<OptionItem[]>(question.options || []);
  const [hasEtc, setHasEtc] = useState(question.hasEtc || false);
  const [allowMultiple, setAllowMultiple] = useState(
    question.allowMultiple || false
  );
  const [starUnit, setStarUnit] = useState(question.unit || 1);
  const [scoreMin, setScoreMin] = useState(question.min ?? 0);
  const [scoreMax, setScoreMax] = useState(question.max ?? 5);
  const [scoreLeftLabel, setScoreLeftLabel] = useState(
    question.left_label ?? ""
  );
  const [scoreRightLabel, setScoreRightLabel] = useState(
    question.right_label ?? ""
  );

  useEffect(() => {
    onQuestionChange({
      ...question,
      type: questionType,
      text: questionText,
      options,
      hasEtc,
      allowMultiple,
      unit: starUnit,
      min: scoreMin,
      max: scoreMax,
      left_label: scoreLeftLabel,
      right_label: scoreRightLabel,
    });
  }, [
    questionType,
    questionText,
    options,
    hasEtc,
    allowMultiple,
    starUnit,
    scoreMin,
    scoreMax,
    scoreLeftLabel,
    scoreRightLabel,
  ]);

  const handleAddOption = () => {
    const newOption = { id: uuidv4(), label: `선택지 ${options.length + 1}` };
    setOptions([...options, newOption]);
  };

  const handleOptionChange = (value: string, idx: number) => {
    const newOptions = [...options];
    newOptions[idx] = { ...newOptions[idx], label: value };
    setOptions(newOptions);
  };

  const handleDeleteOption = (idx: number) => {
    setOptions(options.filter((_, i) => i !== idx));
  };

  return (
    <div className="mb-4 border rounded-md p-4">
      <div className="flex items-center justify-between mb-2">
        <Input
          label={`질문 ${question.order_number}`}
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="질문을 입력하세요"
          className="flex-grow mr-2"
          disabled={isLocked}
        />
        <Select
          value={questionType}
          onValueChange={(val) => setQuestionType(val)}
          disabled={isLocked}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="질문 유형 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text_short">주관식 (단답)</SelectItem>
            <SelectItem value="text_long">주관식 (서술)</SelectItem>
            <SelectItem value="radio">객관식</SelectItem>
            <SelectItem value="dropdown">드롭다운</SelectItem>
            <SelectItem value="star">별점</SelectItem>
            <SelectItem value="score">점수</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {questionType === "text_short" && <QuestionShortAnswer />}
      {questionType === "text_long" && <QuestionLongAnswer />}
      {questionType === "radio" && (
        <QuestionMultipleChoice
          options={options}
          hasEtc={hasEtc}
          allowMultiple={allowMultiple}
          onOptionChange={handleOptionChange}
          onDeleteOption={handleDeleteOption}
          onAddOption={handleAddOption}
          onToggleEtc={() => setHasEtc(!hasEtc)}
          onToggleMultiple={() => setAllowMultiple(!allowMultiple)}
          disabled={isLocked}
        />
      )}
      {questionType === "dropdown" && (
        <QuestionDropdown
          options={options}
          onOptionChange={handleOptionChange}
          onDeleteOption={handleDeleteOption}
          onAddOption={handleAddOption}
          disabled={isLocked}
        />
      )}

      {questionType === "star" && (
        <QuestionStarRating
          unit={starUnit}
          onChangeUnit={setStarUnit}
          disabled={isLocked}
        />
      )}
      {questionType === "score" && (
        <QuestionScore
          min={question.min ?? 0}
          max={question.max ?? 5}
          left_label={question.left_label ?? ""}
          right_label={question.right_label ?? ""}
          onChange={(partial) => {
            onQuestionChange({
              ...question,
              ...partial,
            });
          }}
          disabled={isLocked}
        />
      )}

      <div className="flex justify-end mt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mr-2"
          onClick={onDuplicate}
        >
          복제
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={onDelete}
          disabled={isLocked}
        >
          삭제
        </Button>
      </div>
    </div>
  );
};

export default Question;
