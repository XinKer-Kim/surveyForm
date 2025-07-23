import { FC, useState } from "react";
import QuestionShortAnswer from "./QuestionShortAnswer";
import QuestionLongAnswer from "./QuestionLongAnswer";
import QuestionMultipleChoice from "@/components/form/QuestionMultipleChoice";
import QuestionDropdown from "@/components/form/QuestionDropdown";
import { Textarea } from "@/components/ui/textarea"; // shadcn/ui
import Input from "./Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface QuestionProps {
  question: any; // 실제 타입은 추후 정의
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
  const [questionType, setQuestionType] = useState(question.type);
  const [questionText, setQuestionText] = useState(question.text || "");

  const handleTypeChange = (type: string) => {
    setQuestionType(type);
    onQuestionChange({ ...question, type });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setQuestionText(newText);
    onQuestionChange({ ...question, text: newText });
  };
  const [options, setOptions] = useState(question.options || [""]);
  const [allowMultiple, setAllowMultiple] = useState(
    question.allowMultiple || false
  );
  const [hasEtc, setHasEtc] = useState(question.hasEtc || false);

  // S : 질문 함수 영역
  // 항목 텍스트 수정
  const handleOptionChange = (value: string, idx: number) => {
    const newOptions = [...options];
    newOptions[idx] = value;
    setOptions(newOptions);
    onQuestionChange({
      ...question,
      options: newOptions,
    });
  };

  // 항목 삭제
  const handleDeleteOption = (idx: number) => {
    const newOptions = options.filter((_, i) => i !== idx);
    setOptions(newOptions);
    onQuestionChange({
      ...question,
      options: newOptions,
    });
  };
  const handleAddOption = () => {
    const newOptions = [...options, ""];
    setOptions(newOptions);
    onQuestionChange({
      ...question,
      options: newOptions,
    });
  };

  // '기타' 토글
  const handleToggleEtc = () => {
    setHasEtc(!hasEtc);
    onQuestionChange({
      ...question,
      hasEtc: !hasEtc,
    });
  };

  // 복수선택 토글
  const handleToggleMultiple = () => {
    setAllowMultiple(!allowMultiple);
    onQuestionChange({
      ...question,
      allowMultiple: !allowMultiple,
    });
  };

  // E : 질문 함수 영역
  return (
    <div className="mb-4 border rounded-md p-4">
      <div className="flex items-center justify-between mb-2">
        <Input
          label={`질문 ${question.order_number}`}
          value={questionText}
          onChange={handleTextChange}
          placeholder="질문을 입력하세요"
          className="flex-grow mr-2"
        />
        <Select value={questionType} onValueChange={handleTypeChange}>
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
      {/* 각 질문 유형에 따른 추가 UI (예: 객관식 답변 옵션 등) */}
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
          onToggleEtc={handleToggleEtc}
          onToggleMultiple={handleToggleMultiple}
        />
      )}
      {questionType === "dropdown" && (
        <QuestionDropdown
          options={options}
          hasEtc={hasEtc}
          onOptionChange={handleOptionChange}
          onDeleteOption={handleDeleteOption}
          onAddOption={handleAddOption}
          onToggleEtc={handleToggleEtc}
        />
      )}

      {questionType === "star" && <div>별점 옵션 UI</div>}
      {questionType === "score" && <div>점수 옵션 UI</div>}

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
        >
          삭제
        </Button>
      </div>
    </div>
  );
};

export default Question;
