import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { templateMap } from "@/constants/templates";
import Question from "@/components/form/Question";
import { supabase } from "@/supabaseClient";
import QuestionTitle from "@/components/form/QuestionTitle";
import { v4 as uuidv4 } from "uuid";
import { formatDate, formatTime, parseDateTime } from "@/utils/dateUtils";
import { SurveyPeriod } from "@/constants/survey";
import { useAuthStore } from "@/components/store/authStore";
import type { QuestionData } from "@/types/question";
import type { FormData } from "@/types/form";
import Swal from "sweetalert2";

const FormBuilderPage = () => {
  const { formId, templateId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const userId = user?.id ?? null;

  // Questiontitle 상태 관리
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startType, setStartType] = useState<string>(SurveyPeriod.START);
  const [startDateTime, setStartDateTime] = useState<Date | undefined>();
  const [startDate, setStartDate] = useState<string>(formatDate(startDateTime));
  const [startTime, setStartTime] = useState<string>(formatTime(startDateTime));
  const [endType, setEndType] = useState<string>(SurveyPeriod.UNLIMITED);
  const [endDateTime, setEndDateTime] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<string>(formatDate(endDateTime));
  const [endTime, setEndTime] = useState<string>(formatTime(endDateTime));

  const [isTemplateMode, setIsTemplateMode] = useState(false); // 템플릿 모드 여부
  const [formElements, setFormElements] = useState<QuestionData[]>([]);

  type Option = {
    id: string;
    label: string;
    value?: string;
    order_number?: number;
  };

  useEffect(() => {
    if (formId && formId !== "new") {
      console.log("폼 수정 모드");

      const loadForm = async () => {
        // 폼 정보 불러오기
        const { data: form } = await supabase
          .from("forms")
          .select<"*", FormData>("*")
          .eq("id", formId)
          .single();

        setTitle(form?.title ?? "");
        setDescription(form?.description ?? "");

        // 질문 + 응답 존재 여부 포함해서 불러오기
        const { data: rawQuestions } = await supabase
          .from("questions")
          .select(
            `
              id,
              text,
              type,
              order_number,
              required,
              allow_multiple,
              unit,
              min,
              max,
              left_label,
              right_label,
              options (
                id,
                label,
                value,
                order_number
              ),
              answers(id)
            `
          )
          .eq("form_id", formId)
          .order("order_number", { ascending: true });

        setTitle(form?.title ?? "");
        setDescription(form?.description ?? "");
        setStartDateTime(form?.start_time ?? undefined);
        setStartType(
          form?.start_time ? SurveyPeriod.CUSTOM : SurveyPeriod.START
        );
        setEndDateTime(form?.end_time ?? undefined);
        setEndType(
          form?.end_time ? SurveyPeriod.CUSTOM : SurveyPeriod.UNLIMITED
        );

        (rawQuestions as QuestionData[]).forEach((q) => {
          if (q.options && q.options.length > 0) {
            q.options.forEach((o) => {
              if (o.value === "etc") {
                q.hasEtc = true;
                return;
              }
            });
          }
        });

        setFormElements((rawQuestions as QuestionData[]) ?? []);
      };

      loadForm();
    } else if (templateId && templateMap[templateId]) {
      console.log("템플릿 불러오기:", templateId);
      setFormElements(templateMap[templateId]);
      setTitle("");
      setDescription("");
      setIsTemplateMode(true);
    } else {
      console.log("신규 폼 생성 모드");
      setFormElements([]);
      setTitle("");
      setDescription("");
    }
  }, [formId]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setDescription(e.target.value);

  const handleAddInput = () => {
    const isAnyLocked = formElements.some((q) => (q.answers ?? []).length > 0);

    if (isAnyLocked) {
      Swal.fire({
        icon: "error",
        title: "응답이 존재하는 설문에는 질문을 추가할 수 없습니다.",
        confirmButtonText: "확인",
      });
      return;
    }
    setFormElements([
      ...formElements,
      {
        id: uuidv4(),
        type: "radio", // ✅ 기본을 객관식으로 변경
        text: "",
        required: false,
        order_number: formElements.length + 1,
        // hasAnswer: false,
        options: [
          { id: uuidv4(), label: "" },
          { id: uuidv4(), label: "" },
        ],
      },
    ]);
  };

  const handleSaveForm = async () => {
    console.log("userId:", userId);
    if (!userId) {
      Swal.fire({
        icon: "error",
        title: "로그인이 필요합니다.",
        confirmButtonText: "확인",
      });

      return;
    }
    let resolvedFormId = formId;

    if (formId === "new" || isTemplateMode) {
      const { data: formData, error: formError } = await supabase
        .from("forms")
        .insert({
          user_id: userId, // TODO: 현재는 하드코딩, 추후 로그인 기능 추가 시 변경 필요
          title,
          description,
        })
        .select()
        .single();

      if (formError) {
        console.error("폼 생성 에러:", formError);
        Swal.fire({
          icon: "error",
          title: `폼 생성 실패: ${formError.message}`,
          confirmButtonText: "확인",
        });
        return;
      }

      resolvedFormId = formData.id;
    }

    const { error: saveError } = await supabase.rpc(
      "save_form_with_questions",
      {
        payload: {
          form_id: resolvedFormId,
          title,
          description,
          start_time:
            startType === SurveyPeriod.CUSTOM
              ? parseDateTime(startDate, startTime)
              : null,
          end_time:
            endType === SurveyPeriod.CUSTOM
              ? parseDateTime(endDate, endTime)
              : null,
          questions: formElements.map((q, i) => ({
            id: q.id,
            text: q.text,
            type: q.type,
            order_number: i + 1,
            allow_multiple: q.allow_multiple ?? null,
            required: q.required ?? false,
            unit: q.unit ?? null,
            min: q.min ?? null,
            max: q.max ?? null,
            left_label: q.left_label ?? null,
            right_label: q.right_label ?? null,
            options: (() => {
              // 타입이 해당하지 않으면 빈 배열 즉시 반환.
              if (!["radio", "dropdown", "checkbox"].includes(q.type))
                return [];

              // 기존 옵션들 먼저 매핑.
              const baseOptions =
                q.options?.map((opt, j) => ({
                  id: opt.id,
                  label: opt.label,
                  value: opt.value ?? null,
                  order_number: j + 1,
                })) ?? [];

              // 이미 '기타' 옵션이 있는지 확인.
              const hasExistingEtc = baseOptions.some((o) => o.value === "etc");

              // q.hasEtc === true 이고 '기타' 옵션이 아직 없는 경우에만
              // '기타' 옵션을 배열의 마지막에 추가.
              if (q.hasEtc && !hasExistingEtc) {
                baseOptions.push({
                  id: uuidv4(),
                  label: "기타", // 화면에 표시될 텍스트
                  value: "etc", // "etc" 문자열로 '기타' 옵션과 일반 객관식 선택지를 구분.
                  order_number: baseOptions.length + 1, // 항상 기존 옵션들의 마지막 순서.
                });
              }

              return baseOptions;
            })(), // 함수 즉시 실행.
          })),
        },
      }
    );

    if (saveError) {
      console.error("질문 저장 실패:", saveError);

      if (saveError.code === "23503") {
        Swal.fire({
          icon: "error",
          title:
            "이미 응답이 존재하는 질문은 삭제하거나 유형을 바꿀 수 없습니다.",
          confirmButtonText: "확인",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "폼 저장 중 오류가 발생했습니다.",
          confirmButtonText: "확인",
        });
      }

      return;
    }
    Swal.fire({
      icon: "success",
      title: "폼 저장 완료!",
      confirmButtonText: "확인",
    });
    navigate("/list");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        {formId === "new" ? "새 설문 만들기" : "설문 수정"}
      </h1>
      <div className="mb-4">
        <QuestionTitle
          title={title}
          description={description}
          startType={startType}
          startDateTime={startDateTime}
          startDate={startDate}
          startTime={startTime}
          endType={endType}
          endDateTime={endDateTime}
          endDate={endDate}
          endTime={endTime}
          handleTitleChange={handleTitleChange}
          handleDescriptionChange={handleDescriptionChange}
          setStartType={setStartType}
          setStartDate={setStartDate}
          setStartTime={setStartTime}
          setStartDateTime={setStartDateTime}
          setEndDateTime={setEndDateTime}
          setEndType={setEndType}
          setEndDate={setEndDate}
          setEndTime={setEndTime}
          handleAddInput={handleAddInput}
          handleAddPage={() => {}}
        />
      </div>
      <div>
        {formElements.map((element, index) => (
          <Question
            key={element.id}
            question={{ ...element, order_number: index + 1 }}
            onQuestionChange={(updatedQuestion) => {
              const newElements = [...formElements];
              newElements[index] = updatedQuestion;
              setFormElements(newElements);
            }}
            onDuplicate={() => {
              const newElements = [...formElements];
              newElements.splice(index + 1, 0, {
                ...element,
                id: uuidv4(),
                // hasAnswer: false, // 복제된 건 응답 없음
              });
              setFormElements(newElements);
            }}
            onDelete={() => {
              const newElements = formElements.filter((_, i) => i !== index);
              setFormElements(newElements);
            }}
          />
        ))}
      </div>
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
        onClick={handleSaveForm}
      >
        폼 저장
      </button>
      <Link to="/" className="inline-block ml-2 text-gray-500 hover:underline">
        취소
      </Link>
    </div>
  );
};

export default FormBuilderPage;
