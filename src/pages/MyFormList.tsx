import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface FormType {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  start_time?: string | null;
  end_time?: string | null;
}

const MyFormList = () => {
  const [userId] = useState<string>("1dd927e3-2b9d-4d7a-a23d-578e1934bac3"); // ✅ 하드코딩된 테스트용 UUID
  const [forms, setForms] = useState<FormType[]>([]);

  useEffect(() => {
    const fetchForms = async () => {
      const { data, error } = await supabase
        .from("forms")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });

      if (!error && data) setForms(data);
      else console.error("폼 로딩 오류:", error);
    };

    fetchForms();
  }, [userId]);

  const formatDate = (str: string | null | undefined) => {
    if (!str) return "없음";
    return new Date(str).toLocaleString("ko-KR", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const isOngoing = (endTime: string | null | undefined): boolean => {
    if (!endTime) return true;
    return new Date(endTime) > new Date();
  };
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">내 설문</h2>
      {forms.map((form) => (
        <div
          key={form.id}
          className="border rounded-lg p-4 mb-4 bg-white shadow-sm"
        >
          <div className="flex items-center justify-between mb-1">
            <span
              className={`text-sm font-bold ${
                isOngoing(form.end_time)
                  ? "text-green-600"
                  : "text-gray-400 line-through"
              }`}
            >
              {isOngoing(form.end_time) ? "진행 중" : "종료"}
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
            {formatDate(form.start_time)} ~ {formatDate(form.end_time)}
          </p>
          <div className="flex gap-2">
            <Button onClick={() => navigate(`/results/${form.id}`)}>
              결과 확인
            </Button>

            <Button variant="ghost" size="icon">
              ✏️
            </Button>
            <Button variant="ghost" size="icon">
              ⋯
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyFormList;
