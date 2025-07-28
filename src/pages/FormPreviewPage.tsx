import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Question = {
  id: string;
  text: string;
  type: string;
};

function FormPreviewPage() {
  const { formId } = useParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [formTitle, setFormTitle] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!formId) return;

      // 설문 제목
      const { data: formData } = await supabase
        .from("forms")
        .select("title")
        .eq("id", formId)
        .single();

      if (formData) setFormTitle(formData.title);

      // 질문 목록
      const { data: questionData, error } = await supabase
        .from("questions")
        .select("id, text, type")
        .eq("form_id", formId);

      if (error) {
        console.error("질문 불러오기 오류", error);
        return;
      }

      setQuestions(questionData || []);
    };

    fetchData();
  }, [formId]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{formTitle} - 미리보기</h1>

      {questions.map((q, i) => (
        <Card key={q.id}>
          <CardHeader>
            <CardTitle>
              Q{i + 1}. {q.text}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              ({q.type}) 응답 입력은 비활성화되어 있습니다.
            </p>
            {/* 필요하다면 question type별 input 예시도 추가 가능 */}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default FormPreviewPage;
