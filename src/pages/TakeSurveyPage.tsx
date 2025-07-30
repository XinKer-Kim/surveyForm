import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, ClipboardX } from "lucide-react";
import type { QuestionData } from "@/types/question";
import type { FormData } from "@/types/form";
import Swal from "sweetalert2";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/components/store/authStore";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const TakeSurveyPage = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const user_id = user?.id;

  const [formTitle, setFormTitle] = useState("");
  const [formEndTime, setFormEndTime] = useState<string | null>(null);
  const [existingResponses, setExistingResponses] = useState<any[]>([]);
  const [selectedResponseId, setSelectedResponseId] = useState<string | null>(
    null
  );
  const [editMode, setEditMode] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchExisting = async () => {
      if (!formId) return;

      let query = supabase
        .from("responses")
        .select("id, submitted_at")
        .eq("form_id", formId)
        .order("submitted_at", { ascending: true });

      if (user?.id) {
        query = query.eq("user_id", user.id);
      }

      const { data, error } = await query;

      if (data && data.length > 0) {
        setExistingResponses(data);
      }
    };

    fetchExisting();

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
  }, [formId, user]);
  useEffect(() => {
    if (!editMode || !selectedResponseId) return;

    const fetchAnswers = async () => {
      const { data, error } = await supabase
        .from("answers")
        .select("question_id, text_answer, option_id")
        .eq("response_id", selectedResponseId);

      if (data) {
        const mapped: Record<string, any> = {};
        for (const ans of data) {
          mapped[ans.question_id] = ans.option_id ?? ans.text_answer;
        }
        setAnswers(mapped);
      }
    };

    fetchAnswers();
  }, [editMode, selectedResponseId]);

  if (!editMode && existingResponses.length > 0) {
    return (
      <div className="text-center mt-20 text-gray-600">
        <ClipboardCheck className="w-full h-full mb-4" />
        <p className="text-lg font-semibold mb-4">이미 참여한 설문입니다.</p>
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => {
              setSelectedResponseId(existingResponses[0].id); // 최초 응답 선택
              setEditMode(true);
            }}
          >
            답변 수정
          </Button>
          <Button onClick={() => setEditMode(true)}>설문 추가 참여</Button>
        </div>
      </div>
    );
  }

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
    }

    // ✅ 필수 질문 확인
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

    // ✅ 응답 ID 확보
    let responseId = selectedResponseId;

    if (!editMode) {
      // 신규 응답: responses에 insert
      const { data: responseRow, error } = await supabase
        .from("responses")
        .insert({ user_id, form_id: formId })
        .select()
        .single();

      if (error || !responseRow) {
        alert("응답 저장 실패");
        return;
      }

      responseId = responseRow.id;
    } else {
      // 수정 응답: 기존 answers 삭제
      const { error: deleteError } = await supabase
        .from("answers")
        .delete()
        .eq("response_id", selectedResponseId);

      if (deleteError) {
        Swal.fire({
          icon: "error",
          title: "기존 응답 삭제 실패",
          text: deleteError.message,
        });
        return;
      }
    }

    // ✅ answers insert
    const answersToInsert = questions.flatMap((q) => {
      const value = answers[q.id];

      if (
        value === null ||
        value === undefined ||
        (Array.isArray(value) && value.length === 0)
      )
        return [];

      const isMultiple = q.type === "radio" && q.allow_multiple;
      if (isMultiple) {
        return Array.isArray(value)
          ? value.map((optId) => ({
              response_id: responseId,
              question_id: q.id,
              text_answer: null,
              option_id: optId,
            }))
          : [];
      }

      const isSingle =
        (q.type === "radio" && !q.allow_multiple) || q.type === "dropdown";
      if (isSingle) {
        return [
          {
            response_id: responseId,
            question_id: q.id,
            text_answer: null,
            option_id: value,
          },
        ];
      }

      const isTextOrNumeric = [
        "text_short",
        "text_long",
        "star",
        "score",
      ].includes(q.type);
      if (isTextOrNumeric) {
        return [
          {
            response_id: responseId,
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
        <ClipboardX className="w-full h-full mb-4" />
        <h2 className="text-xl font-semibold">설문이 종료되었습니다.</h2>
        <p className="text-sm mt-2">더 이상 응답할 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {existingResponses.length > 0 && editMode && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">수정할 응답 선택</h2>
          <Select
            value={selectedResponseId ?? ""}
            onValueChange={(val) => setSelectedResponseId(val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="응답을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {existingResponses.map((resp, idx) => {
                const dateStr = new Date(resp.submitted_at).toLocaleString(
                  "ko-KR",
                  {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                );

                return (
                  <SelectItem key={resp.id} value={resp.id}>
                    {`${idx + 1}번째 답변 : ${dateStr}`}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      )}

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
                ? q.options.map((opt: any) => {
                    return (
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
                    );
                  })
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
