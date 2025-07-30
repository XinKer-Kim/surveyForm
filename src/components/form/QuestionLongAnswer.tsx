import type { FC } from "react";
import { Textarea } from "@/components/ui/textarea";

const QuestionLongAnswer: FC = () => {
  return (
    <Textarea
      disabled
      placeholder="참여자의 답변 입력란 (최대 2000자)"
      maxLength={2000}
      className="mt-2"
    />
  );
};

export default QuestionLongAnswer;
