import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/ui/starRating.tsx"; // StarRating 컴포넌트 임포트
import type { QuestionData } from "@/types/question";
import type { FormData } from "@/types/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";

const TakeSurveyPage = () => {
  const { formId } = useParams();
  const navigate = useNavigate();

  const [formTitle, setFormTitle] = useState("");
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({}); // question.id → 사용자 응답
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        console.error("로그인된 사용자 없음", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!formId) return;

    const fetchForm = async () => {
      const { data: form, error: formError } = await supabase
        .from("forms")
        .select("title")
        .eq("id", formId)
        .single();

      const { data: qs } = await supabase
        .from("questions")
        .select(
          `
            id,
            text,
            type,
            required,
            allow_multiple,
            unit,
            min,
            max,
            left_label,
            right_label,
            options(id, label)
          `
        )
        .eq("form_id", formId)
        .order("order_number", { ascending: true });
      if (form) setFormTitle((form as FormData).title);

      if (qs) {
        const questions: QuestionData[] = qs as QuestionData[];

        questions.forEach((q) => {
          if (q.type === "radio" && q.options) {
            /**
             * 선택지가 있는 객관식에 대한 추가적인 로직 필요 시 작성.
             */
          }
        });

        setQuestions(questions);
      }
    };

    fetchForm();
  }, [formId]);

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (!userId) {
      Swal.fire({
        icon: "error",
        title: "로그인 후 응답 가능합니다.",
        confirmButtonText: "확인",
      });

      return;
    }
    // 추후 auth로 교체

    const { data: responseRow, error } = await supabase
      .from("responses")
      .insert({ user_id: userId, form_id: formId })
      .select()
      .single();

    if (error || !responseRow) {
      Swal.fire({
        icon: "error",
        title: "응답 저장 실패",
        confirmButtonText: "확인",
      });
      return;
    }

    const answersToInsert = questions.map((q) => {
      const value = answers[q.id];

      const isOptionType = ["radio", "dropdown"].includes(q.type);
      const isTextType = ["text_short", "text_long"].includes(q.type);
      const isNumericType = ["star", "score"].includes(q.type);

      return {
        response_id: responseRow.id,
        question_id: q.id,
        text_answer:
          isTextType || isNumericType ? value?.toString() ?? null : null,
        option_id: isOptionType ? value ?? null : null,
      };
    });

    await supabase.from("answers").insert(answersToInsert);
    Swal.fire({
      icon: "success",
      title: "응답이 제출되었습니다!",
      confirmButtonText: "확인",
    });
    navigate("/bookmarks");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{formTitle}</h1>

      {questions.map((q, i) => (
        <div key={q.id} className="mb-6">
          <p className="mb-2 font-medium">
            Q{i + 1}. {q.text} {q.required && "*"}
          </p>
          {/* 주관식 단답형 */}
          {q.type === "text_short" && (
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={answers[q.id] || ""}
              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
            />
          )}
          {/* 객관식 */}
          {q.type === "radio" && (
            <div className="space-y-2">
              {q.options
                ? q.options.map((opt) => {
                    return (
                      <div key={opt.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={opt.id}
                          className="flex items-center gap-2"
                          checked={undefined}
                          onCheckedChange={() =>
                            handleAnswerChange(q.id, opt.id)
                          }
                        ></Checkbox>
                        <Label htmlFor={opt.id}>{opt.label}</Label>
                      </div>
                    );
                  })
                : []}
            </div>
          )}
          {/* 주관식 서술형 */}
          {q.type === "text_long" && (
            <textarea
              className="w-full border p-2 rounded resize-none h-32"
              value={answers[q.id] || ""}
              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
            />
          )}
          {/* 드롭다운 */}
          {q.type === "dropdown" && (
            <select
              className="w-full border p-2 rounded"
              value={answers[q.id] || ""}
              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
            >
              <option value="" disabled>
                선택하세요
              </option>
              {q.options
                ? q.options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))
                : []}
            </select>
          )}
          {q.type === "star" && (
            <div className="flex items-center gap-1">
              <StarRating
                score={answers[q.id] ?? 0}
                unit={q.unit ?? 1} // unit prop 전달
                onChange={(value) => handleAnswerChange(q.id, value)}
                maxStars={q.max ?? 5} // maxStars prop 전달 (별의 최대 개수)
              />
              <span className="ml-2 text-sm text-gray-500">
                {answers[q.id] ?? "0"}점
              </span>
              <span className="ml-2 text-sm text-gray-500">
                ({(q.unit ?? 1) === 0.5 ? "0.5~5점" : "1~5점"}까지 선택
                가능합니다.)
              </span>
            </div>
          )}

          {/* 점수형 */}
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
                <span>{q.left_label}</span>
                <span>{q.right_label}</span>
              </div>
            </div>
          )}
        </div>
      ))}

      <Button onClick={handleSubmit}>제출하기</Button>
    </div>
  );
};

export default TakeSurveyPage;
