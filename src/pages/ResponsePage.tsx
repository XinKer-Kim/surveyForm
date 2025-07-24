import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/supabaseClient";

type AnswerWithQuestion = {
  question_text: string;
  question_type: string;
  text_answer: string | null;
  option_label: string | null;
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
      question_id,
      questions ( text, type )
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

      const parsed: AnswerWithQuestion[] = data.answers.map((a: any) => ({
        question_text: a.questions.text,
        question_type: a.questions.type,
        text_answer: a.text_answer,
        option_label: null, // 옵션 없음
      }));

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
        {answers.map((a, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>
                Q{i + 1}. {a.question_text}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base">
                {a.option_label ?? a.text_answer ?? (
                  <span className="text-gray-400">응답 없음</span>
                )}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ResponsePage;
