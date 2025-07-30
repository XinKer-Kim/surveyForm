import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { useNavigate } from "react-router-dom";
import { formatDate, isOngoing } from "@/utils/dateUtils";
const MyTakenList = () => {
  const [responses, setResponses] = useState<any[]>([]);
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null); // ✅ 하드코딩된 테스트용 UUID

  useEffect(() => {
    const fetchUserId = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
      } else {
        console.error("유저 정보 없음", error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchResponses = async () => {
      if (!userId) return;

      const { data, error } = await supabase
        .from("responses")
        .select("form_id, forms(title, created_at, end_time)")
        .eq("user_id", userId);

      if (!error && data) {
        const uniqueForms = Array.from(
          new Map(data.map((resp) => [resp.form_id, resp.forms])).entries()
        ).map(([form_id, form]) => ({
          form_id,
          ...form,
        }));
        setResponses(uniqueForms);
      } else {
        console.error("응답 불러오기 실패:", error);
      }
    };

    fetchResponses();
  }, [userId]);

  return (
    <div className=" p-6">
      <h1 className="text-2xl font-bold mb-6">내가 참여한 설문</h1>

      <div className=" flex flex-col gap-4">
        {responses.map((f) => (
          <div
            key={f.form_id}
            className="bg-white rounded-md shadow-sm p-4 cursor-pointer"
            onClick={() => navigate(`/take/${f.form_id}`)}
          >
            <h2 className="font-semibold text-lg">{f.title}</h2>
            <p className="text-gray-500 text-sm">
              {f.start_time ? formatDate(f.start_time) : "시작 시간 없음"} ~
              {f.end_time ? formatDate(f.end_time) : "종료 시간 없음"}
            </p>
            <span
              className={`text-sm font-semibold ${
                isOngoing(f.end_time) ? "text-green-600" : "text-gray-400"
              }`}
            >
              {isOngoing(f.end_time) ? "진행 중" : "종료"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTakenList;
