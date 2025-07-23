export type QuestionType =
  | "text_short"
  | "text_long"
  | "radio"
  | "dropdown"
  | "star"
  | "score";

/**
 * 설문 하나의 질문을 구성하는 타입입니다.
 */
export interface QuestionData {
  id: string; // 질문 고유 식별자
  order_number: number; // 설문 내 질문 순서 (1번, 2번, ...)
  type: QuestionType; // 질문 유형
  text: string; // 질문 제목 또는 질문 텍스트
  required: boolean; // 필수 응답 여부

  // 객관식 및 드롭다운용
  options?: string[];
  hasEtc?: boolean; // 객관식만 해당 (기타 옵션 추가 여부)
  allowMultiple?: boolean; // 객관식만 해당 (복수 선택 허용 여부)

  // 별점형 질문
  unit?: 0.5 | 1;

  // 점수형 질문
  min?: number;
  max?: number;
  leftLabel?: string;
  rightLabel?: string;
}
