import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { Button } from "@/components/ui/button";
import { ClipboardX } from "lucide-react";
import type { QuestionData } from "@/types/question";
import type { FormData } from "@/types/form";
import Swal from "sweetalert2";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/components/store/authStore";

const TakeSurveyPage = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const user_id = user?.id;

  const [formTitle, setFormTitle] = useState("");
  const [formEndTime, setFormEndTime] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!formId) return;

    const fetchForm = async () => {
      const { data: form } = await supabase
        .from("forms")
        .select("title, end_time")
        .eq("id", formId)
        .single();

      setFormTitle(form?.title ?? "");
      setFormEndTime(form?.end_time ?? null);

      const { data: qs } = await supabase
        .from("questions")
        .select(
          "id, text, type, required, allow_multiple, min, max, left_label, right_label, options(id, label)"
        )
        .eq("form_id", formId)
        .order("order_number", { ascending: true });

      if (form) setFormTitle((form as FormData).title);
      if (qs) setQuestions((qs as QuestionData[]) || []);
    };

    fetchForm();
  }, [formId]);

  const handleAnswerOptionChange = (q: QuestionData, optId: any) => {
    if (q.allow_multiple) {
      setAnswers((prev) => {
        const existingAnswers = (prev[q.id] as any[]) || [];
        const newAnswers = existingAnswers.includes(optId)
          ? existingAnswers.filter((id) => id !== optId)
          : [...existingAnswers, optId];
        return { ...prev, [q.id]: newAnswers };
      });
    } else {
      setAnswers((prev) => ({ ...prev, [q.id]: optId }));
    }
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (!user_id) {
      alert("로그인이 필요합니다.");
      return;
    } //비로그인 설문 허용할거면 다른 로직 필요
    for (const q of questions) {
      if (q.required) {
        const val = answers[q.id];
        const isEmpty =
          val === undefined ||
          val === null ||
          (typeof val === "string" && val.trim() === "") ||
          (Array.isArray(val) && val.length === 0);

        if (isEmpty) {
          Swal.fire({
            icon: "warning",
            title: "필수 질문 누락",
            text: `"${q.text}"에 대한 응답을 입력해주세요.`,
          });
          return;
        }
      }
    }
    const { data: responseRow, error } = await supabase
      .from("responses")
      .insert({ user_id, form_id: formId })
      .select()
      .single();

    if (error || !responseRow) {
      alert("응답 저장 실패");
      return;
    }

    const answersToInsert = questions.flatMap((q) => {
      const value = answers[q.id];

      if (
        value === null ||
        value === undefined ||
        (Array.isArray(value) && value.length === 0)
      )
        return [];

      const isMulipleOptionType = q.type === "radio" && q.allow_multiple;
      if (isMulipleOptionType) {
        return Array.isArray(value)
          ? value.map((optId) => ({
              response_id: responseRow.id,
              question_id: q.id,
              text_answer: null,
              option_id: optId,
            }))
          : [];
      }

      const isSingleOptionType =
        (q.type === "radio" && !q.allow_multiple) || q.type === "dropdown";
      if (isSingleOptionType) {
        return [
          {
            response_id: responseRow.id,
            question_id: q.id,
            text_answer: null,
            option_id: value,
          },
        ];
      }

      const isTextOrNumericType = [
        "text_short",
        "text_long",
        "star",
        "score",
      ].includes(q.type);
      if (isTextOrNumericType) {
        return [
          {
            response_id: responseRow.id,
            question_id: q.id,
            text_answer: value.toString(),
            option_id: null,
          },
        ];
      }

      return [];
    });

    if (answersToInsert.length > 0) {
      const { error } = await supabase.from("answers").insert(answersToInsert);
      if (error) {
        Swal.fire({
          icon: "error",
          title: "응답 저장 실패",
          confirmButtonText: "확인",
        });
        return;
      }
    }

    Swal.fire({
      icon: "success",
      title: "응답이 제출되었습니다!",
      confirmButtonText: "확인",
    });
    navigate("/bookmarks");
  };

  // ✅ 설문 종료 여부 체크
  if (formEndTime && new Date(formEndTime) < new Date()) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center text-gray-500">
        <ClipboardX className="w-12 h-12 mb-4" />
        <h2 className="text-xl font-semibold">설문이 종료되었습니다.</h2>
        <p className="text-sm mt-2">더 이상 응답할 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{formTitle}</h1>

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
            />
          )}
          {q.type === "radio" && (
            <div className="space-y-2">
              {q.options
                ? q.options.map((opt: any) => (
                    <>
                      <div key={opt.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={opt.id}
                          className="flex items-center gap-2"
                          checked={
                            q.allow_multiple
                              ? (Array.isArray(answers[q.id]) &&
                                  answers[q.id].includes(opt.id)) ||
                                false
                              : answers[q.id] === opt.id
                          }
                          onCheckedChange={() =>
                            handleAnswerOptionChange(q, opt.id)
                          }
                        ></Checkbox>
                        <Label htmlFor={opt.id}>{opt.label}</Label>
                      </div>
                    </>
                  ))
                : []}
            </div>
          )}
          {q.type === "text_long" && (
            <textarea
              className="w-full border p-2 rounded resize-none h-32"
              value={answers[q.id] || ""}
              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
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

      <Button onClick={handleSubmit}>제출하기</Button>
    </div>
  );
};

export default TakeSurveyPage;
