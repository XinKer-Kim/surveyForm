import { v4 as uuidv4 } from "uuid";
import {
  Sparkles,
  Star,
  Table,
  Type,
  ListChecks,
  CheckSquare,
} from "lucide-react";

// 폼 빌더용 질문 데이터
export const templateMap: Record<string, any[]> = {
  "1": [
    {
      id: uuidv4(),
      type: "radio",
      text: "객관식 질문 예시",
      order_number: 1,
      required: false,
      options: [
        { id: uuidv4(), label: "", value: null, order_number: 1 },
        { id: uuidv4(), label: "", value: null, order_number: 2 },
      ],
    },
  ],
  "2": [
    {
      id: uuidv4(),
      type: "text_short",
      text: "단답형 질문 예시",
      order_number: 1,
      required: false,
    },
  ],
  "3": [
    {
      id: uuidv4(),
      type: "text_long",
      text: "서술형 질문 예시",
      order_number: 1,
      required: false,
    },
  ],
  "4": [
    {
      id: uuidv4(),
      type: "star",
      text: "별점을 매겨주세요",
      order_number: 1,
      required: false,
      unit: 5,
    },
  ],
  // ...필요 시 더 추가
};

// 홈 화면 템플릿 카드용
export const templates = [
  {
    id: "1",
    label: "객관식",
    icon: <CheckSquare className="w-6 h-6 text-yellow-500" />,
  },
  {
    id: "2",
    label: "주관식 (단답)",
    icon: <Table className="w-6 h-6 text-orange-400" />,
  },
  {
    id: "3",
    label: "주관식 (서술)",
    icon: <Type className="w-6 h-6 text-blue-400" />,
  },
  {
    id: "4",
    label: "별점형",
    icon: <Star className="w-6 h-6 text-green-500" />,
  },
  {
    id: "custom",
    label: "직접 만들기",
    icon: <Sparkles className="w-6 h-6 text-gray-500" />,
  },
];
