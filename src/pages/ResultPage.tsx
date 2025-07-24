import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";

const ResultPage = () => {
  const { formId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const { data: qData } = await supabase
        .from("questions")
        .select("*")
        .eq("form_id", formId)
        .order("order_number", { ascending: true });

      setQuestions(qData || []);

      const { data: aData } = await supabase
        .from("answers")
        .select("*")
        .in(
          "question_id",
          (qData || []).map((q) => q.id)
        );

      setAnswers(aData || []);
    };

    if (formId) loadData();
  }, [formId]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">설문 결과</h1>

      {questions.map((q) => (
        <div key={q.id} className="mb-6 p-4 border rounded-md bg-white">
          <h2 className="font-semibold text-base mb-2">
            {q.order_number}. {q.text}
          </h2>

          <div className="flex flex-col gap-2">
            {answers
              .filter((a) => a.question_id === q.id)
              .map((a, i) => (
                <div
                  key={a.id}
                  className="border p-2 rounded text-sm text-gray-800 bg-gray-50"
                >
                  응답 {i + 1}: {a.text_answer || "(객관식 응답 또는 미응답)"}
                </div>
              ))}

            {answers.filter((a) => a.question_id === q.id).length === 0 && (
              <p className="text-sm text-gray-400 italic">아직 응답 없음</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultPage;
