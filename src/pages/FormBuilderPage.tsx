import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { templateMap } from "@/constants/templates";
import Question from "@/components/form/Question";
import { supabase } from "@/supabaseClient";
import QuestionTitle from "@/components/form/QuestionTitle";
import { v4 as uuidv4 } from "uuid";
import { formatDate, formatTime, parseDateTime } from "@/utils/dateUtils";
import { SurveyPeriod } from "@/constants/survey";

const FormBuilderPage = () => {
  const { formId, templateId } = useParams();
  const navigate = useNavigate();

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
  const [formElements, setFormElements] = useState<any[]>([]);

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
          .select("*")
          .eq("id", formId)
          .single();

        setTitle(form?.title ?? "");
        setDescription(form?.description ?? "");

        // 질문 + 응답 존재 여부 포함해서 불러오기
        const { data: rawQuestions } = await supabase
          .from("questions")
          .select(
            `
              id, text, type, order_number, required, is_required,
              options (
                id, label, value, order_number
              ),
              answers(id)
            `
          )
          .eq("form_id", formId)
          .order("order_number", { ascending: true });
        const questionsWithFlags = (rawQuestions ?? []).map((q) => ({
          ...q,
          hasAnswer: (q.answers ?? []).length > 0,
        }));

        setTitle(form.title);
        setDescription(form.description);
        setStartDateTime(form.start_time);
        setStartType(
          form.start_time ? SurveyPeriod.CUSTOM : SurveyPeriod.START
        );
        setEndDateTime(form.end_time);
        setEndType(
          form.end_time ? SurveyPeriod.CUSTOM : SurveyPeriod.UNLIMITED
        );
        setFormElements(questionsWithFlags);
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
    setFormElements([
      ...formElements,
      {
        id: uuidv4(),
        type: "radio", // ✅ 기본을 객관식으로 변경
        text: "",
        required: false,
        order_number: formElements.length + 1,
        hasAnswer: false,
        options: [
          { id: uuidv4(), label: "" },
          { id: uuidv4(), label: "" },
        ],
      },
    ]);
  };

  const handleSaveForm = async () => {
    let resolvedFormId = formId;

    console.log(`${startType} ${endType}`);

    if (formId === "new" || isTemplateMode) {
      const { data: formData, error: formError } = await supabase
        .from("forms")
        .insert({
          user_id: "1dd927e3-2b9d-4d7a-a23d-578e1934bac3", // TODO: 현재는 하드코딩, 추후 로그인 기능 추가 시 변경 필요
          title,
          description,
        })
        .select()
        .single();

      if (formError || !formData) {
        console.error("폼 생성 실패:", formError);
        alert("폼 저장 실패");
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
            required: q.required ?? false,
            options: ["radio", "dropdown", "checkbox"].includes(q.type)
              ? q.options?.map((opt, j) => ({
                  id: opt.id,
                  label: opt.label,
                  value: opt.value ?? null,
                  order_number: j + 1,
                })) ?? []
              : [], // 주관식 등에는 options 보내지 않음
          })),
        },
      }
    );

    if (saveError) {
      console.error("질문 저장 실패:", saveError);

      if (saveError.code === "23503") {
        alert(
          "이미 응답이 존재하는 질문은 삭제하거나 유형을 바꿀 수 없습니다."
        );
      } else {
        alert("폼 저장 중 오류가 발생했습니다.");
      }

      return;
    }

    alert("폼 저장 완료!");
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
                hasAnswer: false, // 복제된 건 응답 없음
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
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
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
