import { FC } from "react";
import { Input } from "@/components/ui/input";

const QuestionShortAnswer: FC = () => {
  return (
    <Input
      disabled
      placeholder="참여자의 답변 입력란 (최대 100자)"
      maxLength={100}
      className="mt-2"
    />
  );
};

export default QuestionShortAnswer;
