import { supabase } from "@/supabaseClient";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
interface FormActionMenuProps {
  formId: string;
}
const FormActionMenu = ({ formId }: { formId: string }) => {
  const navigate = useNavigate();
  const handleDeleteForm = async () => {
    const confirm = window.confirm("정말로 이 설문을 삭제하시겠습니까?");
    if (!confirm) return;

    const { error } = await supabase.from("forms").delete().eq("id", formId);

    if (error) {
      console.error("삭제 실패:", error);
      alert("설문 삭제 중 오류가 발생했습니다.");
      return;
    }

    alert("설문이 삭제되었습니다.");
    // 삭제 후 목록으로 이동
    navigate("/list");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => navigate(`/builder/${formId}`)}>
          편집
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate(`/preview/${formId}`)}>
          미리보기
        </DropdownMenuItem>
        <DropdownMenuItem disabled>설문 중지</DropdownMenuItem>
        <DropdownMenuItem disabled>강제 종료</DropdownMenuItem>
        <DropdownMenuItem onClick={() => alert("복사 기능 구현 예정")}>
          설문 복사
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-600" onClick={handleDeleteForm}>
          삭제
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default FormActionMenu;
