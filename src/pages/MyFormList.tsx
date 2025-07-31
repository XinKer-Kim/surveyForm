import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { Button } from "@/components/ui/button";
import ShareLink from "@/components/ui/ShareLink";
import FormActionMenu from "@/components/ui/FormActionMenu";
import { useNavigate } from "react-router-dom";
import type { FormData } from "@/types/form";
import { isOngoing, formatDate } from "@/utils/dateUtils";

const MyFormList = () => {
  const [userId, setUserId] = useState<string | null>(null); // ✅ 하드코딩된 테스트용 UUID
  const [forms, setForms] = useState<FormData[]>([]);

  useEffect(() => {
    const sessionStr = sessionStorage.getItem("supabase_session");
    if (sessionStr) {
      try {
        const sessionUser = JSON.parse(sessionStr);
        if (sessionUser?.id) {
          setUserId(sessionUser.id);
        }
      } catch (e) {
        console.error("세션 파싱 실패:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchForms = async () => {
      const { data, error } = await supabase
        .from("forms")
        .select<"*", FormData>("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });

      if (!error && data) setForms(data);
      else console.error("폼 로딩 오류:", error);
    };

    fetchForms();
  }, [userId]);

  // const formatDate = (str: string | null | undefined) => {
  //   if (!str) return "없음";
  //   return new Date(str).toLocaleString("ko-KR", {
  //     year: "numeric",
  //     month: "numeric",
  //     day: "numeric",
  //     hour: "numeric",
  //     minute: "numeric",
  //     hour12: true,
  //   });
  // };

  const navigate = useNavigate();

  return (
    <div className="w-full min-w-80 p-4">
      <h2 className="text-lg font-semibold mb-4">내 설문</h2>
      {forms.map((form: FormData) => (
        <div
          key={form.id}
          className="w-full border rounded-lg p-4 mb-4 bg-white shadow-sm"
        >
          <div className="flex items-center justify-between mb-1">
            <span
              className={`text-sm font-bold ${
                isOngoing(form.end_time ?? undefined)
                  ? "text-green-600"
                  : "text-gray-400 line-through"
              }`}
            >
              {isOngoing(form.end_time ?? undefined) ? "진행 중" : "종료"}
            </span>
            <span className="text-xs text-gray-500">
              {formatDate(form.updated_at)} 수정
            </span>
          </div>
          <h3
            className="text-base font-semibold mb-1 cursor-pointer hover:underline"
            onClick={() => navigate(`/builder/${form.id}`)}
          >
            {form.title}
          </h3>
          <p className="text-xs text-gray-500 mb-2">
            {form.start_time ? formatDate(form.start_time) : "즉시 시작"} ~
            {form.end_time ? formatDate(form.end_time) : "제한 없음"}
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => navigate(`/results/${form.id}`)}
              variant="outline"
              size="sm"
              className="cursor-pointer"
            >
              결과 확인
            </Button>
            <ShareLink formId={form.id} />
            <FormActionMenu
              formId={form.id}
              endTime={
                form.end_time ? new Date(form.end_time).toISOString() : null
              }
              onForceCloseSuccess={(newTime) =>
                setForms((prev) =>
                  prev.map((f) =>
                    f.id === form.id
                      ? ({ ...f, end_time: new Date(newTime) } as FormData)
                      : f
                  )
                )
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyFormList;
