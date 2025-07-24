import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { useNavigate } from "react-router-dom";

const MyTakenList = () => {
  const [responses, setResponses] = useState<any[]>([]);
  const navigate = useNavigate();
  const [userId] = useState<string>("1dd927e3-2b9d-4d7a-a23d-578e1934bac3"); // ✅ 하드코딩된 테스트용 UUID
  useEffect(() => {
    const fetchResponses = async () => {
      // const {
      //   data: { user },
      //   error: userError,
      // } = await supabase.auth.getUser();

      // if (userError || !user) return;

      const { data, error } = await supabase
        .from("responses")
        .select("id, form_id, submitted_at, forms(title, created_at)")
        // .eq("user_id", user.id);
        .eq("user_id", userId);

      if (!error && data) {
        setResponses(data);
      } else {
        console.error("응답 불러오기 실패:", error);
      }
    };

    fetchResponses();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">내가 참여한 설문</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {responses.map((resp) => (
          <div
            key={resp.id}
            className="bg-white rounded-md shadow-sm p-4 cursor-pointer"
            onClick={() => navigate(`/responses/${resp.form_id}`)}
          >
            <h2 className="font-semibold text-lg">
              {resp.forms?.title || "제목 없음"}
            </h2>
            <p className="text-gray-500 text-sm">
              응답일: {new Date(resp.submitted_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTakenList;
