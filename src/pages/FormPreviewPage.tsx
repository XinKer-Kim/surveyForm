import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

const FormPreviewPage = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [formTitle, setFormTitle] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!formId) return;

    const fetchForm = async () => {
      const { data: form } = await supabase
        .from("forms")
        .select("title")
        .eq("id", formId)
        .single();

      const { data: qs } = await supabase
        .from("questions")
        .select(
          "id, text, type, required, min, max, left_label, right_label, options(id, label)"
        )
        .eq("form_id", formId)
        .order("order_number", { ascending: true });

      if (form) setFormTitle(form.title);
      if (qs) setQuestions(qs);
    };

    fetchForm();
  }, [formId]);

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };
  const handlePreviewSubmit = () => {
    Swal.fire({
      icon: "success",
      title: "참여 완료!",
      text: "설문에 참여해 주셔서 감사합니다.",
      confirmButtonText: "확인",
    }).then(() => {
      navigate("/list"); // 사용자가 '확인' 누르면 이동
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{formTitle} (미리보기)</h1>

      {questions.map((q, i) => (
        <div key={q.id} className="mb-6">
          <p className="mb-2 font-medium">
            Q{i + 1}. {q.text} {q.required && "*"}
          </p>

          {q.type === "text_short" && (
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={answers[q.id] || ""}
              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
              placeholder="답변 입력 (미리보기)"
            />
          )}

          {q.type === "radio" && (
            <div className="space-y-2">
              {q.options.map((opt: any) => (
                <label key={opt.id} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={q.id}
                    value={opt.id}
                    checked={answers[q.id] === opt.id}
                    onChange={() => handleAnswerChange(q.id, opt.id)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          )}

          {q.type === "text_long" && (
            <textarea
              className="w-full border p-2 rounded resize-none h-32"
              value={answers[q.id] || ""}
              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
              placeholder="답변 입력 (미리보기)"
            />
          )}

          {q.type === "dropdown" && (
            <select
              className="w-full border p-2 rounded"
              value={answers[q.id] || ""}
              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
            >
              <option value="" disabled>
                선택하세요
              </option>
              {q.options.map((opt: any) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}

          {q.type === "star" && (
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  className={`cursor-pointer text-2xl ${
                    (answers[q.id] || 0) >= n
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  onClick={() => handleAnswerChange(q.id, n)}
                >
                  ★
                </span>
              ))}
            </div>
          )}

          {q.type === "score" && (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between px-2">
                {[...Array((q.max ?? 5) - (q.min ?? 0) + 1)].map((_, idx) => {
                  const score = (q.min ?? 0) + idx;
                  return (
                    <button
                      key={score}
                      className={`w-8 h-8 rounded-full border ${
                        answers[q.id] === score ? "bg-blue-500 text-white" : ""
                      }`}
                      onClick={() => handleAnswerChange(q.id, score)}
                    >
                      {score}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between text-sm text-gray-500 px-2">
                <span>{q.left_label ?? ""}</span>
                <span>{q.right_label ?? ""}</span>
              </div>
            </div>
          )}
        </div>
      ))}
      <Button onClick={handlePreviewSubmit} className="cursor-pointer">
        제출하기
      </Button>

      <p className="text-center text-gray-500 mt-8">
        ※ 이 페이지는 설문지 미리보기 전용입니다. 실제로 제출되지 않습니다.
      </p>
    </div>
  );
};

export default FormPreviewPage;
