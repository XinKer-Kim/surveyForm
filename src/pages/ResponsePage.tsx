import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/supabaseClient";

type AnswerWithQuestion = {
  question_text: string;
  question_type: string;
  text_answer: string | null;
  option_id: string | null;
  option_label: string | null;
  unit?: number;
  min?: number;
  max?: number;
  leftLabel?: string;
  rightLabel?: string;
  order_number?: number;
};

const ResponsePage = () => {
  const { formId } = useParams();
  const [answers, setAnswers] = useState<AnswerWithQuestion[]>([]);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState<string>("");

  useEffect(() => {
    const fetchAnswers = async () => {
      const { data, error } = await supabase
        .from("responses")
        .select(
          `
  submitted_at,
  forms ( title ),
  answers (
    text_answer,
    option_id,
    question_id,
    questions (
      *,
      options ( id, label )
    )
  )
`
        )
        .eq("form_id", formId)
        .eq("user_id", "1dd927e3-2b9d-4d7a-a23d-578e1934bac3") // 고정 유저
        .order("submitted_at", { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        console.error("응답 데이터를 불러오지 못했습니다.", error);
        return;
      }

      setSubmittedAt(data.submitted_at);
      setFormTitle(data.forms.title);

      const parsed: AnswerWithQuestion[] = data.answers.map((a: any) => {
        const question = a.questions;
        const matchedOption = question.options?.find(
          (opt: any) => opt.id === a.option_id
        );

        return {
          question_text: question.text,
          question_type: question.type,
          text_answer: a.text_answer,
          option_id: a.option_id,
          option_label: matchedOption?.label ?? null,
          unit: question.unit,
          min: question.min,
          max: question.max,
          leftLabel: question.leftLabel,
          rightLabel: question.rightLabel,
          order_number: question.order_number, // ✅ 정렬을 위해 추가
        };
      });
      // ✅ order_number로 정렬
      parsed.sort((a, b) => (a.order_number ?? 0) - (b.order_number ?? 0));

      setAnswers(parsed);
    };

    fetchAnswers();
  }, [formId]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{formTitle} - 응답 결과</h1>
      {submittedAt && (
        <p className="text-sm text-muted-foreground mb-6">
          제출일: {new Date(submittedAt).toLocaleString()}
        </p>
      )}

      <div className="space-y-4">
        {/* TODO : 오더id순으로 정렬 */}
        {answers.map((a, i) => {
          let displayAnswer = "";

          if (["radio", "dropdown"].includes(a.question_type)) {
            displayAnswer = a.option_label ?? "응답 없음";
          } else if (a.question_type === "star") {
            displayAnswer = a.text_answer
              ? `${a.text_answer}점${a.unit ? ` (단위: ${a.unit})` : ""}`
              : "응답 없음";
          } else if (a.question_type === "score") {
            displayAnswer = a.text_answer
              ? `${a.text_answer}점 (범위: ${a.min ?? 0} ~ ${a.max ?? 5})`
              : "응답 없음";
          } else {
            displayAnswer = a.text_answer ?? "응답 없음";
          }

          return (
            <Card key={i}>
              <CardHeader>
                <CardTitle>
                  Q{i + 1}. {a.question_text}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base text-gray-800">{displayAnswer}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ResponsePage;
