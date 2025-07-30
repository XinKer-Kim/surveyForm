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
import Swal from "sweetalert2";
interface FormActionMenuProps {
  formId: string;
  endTime: string | null;
  onForceCloseSuccess?: (newTime: string) => void;
}

const FormActionMenu = ({
  formId,
  endTime,
  onForceCloseSuccess,
}: FormActionMenuProps) => {
  const navigate = useNavigate();
  const handleDeleteForm = async () => {
    const confirm = await Swal.fire({
      title: "정말로 이 설문을 삭제하시겠습니까?",
      text: "이 작업은 되돌릴 수 없습니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    });

    if (!confirm) return;

    const { error } = await supabase.from("forms").delete().eq("id", formId);

    if (error) {
      console.error("삭제 실패:", error);
      Swal.fire({
        icon: "error",
        title: "설문 삭제 중 오류가 발생했습니다.",
        text: error.message,
        confirmButtonText: "확인",
      });
      return;
    }
    Swal.fire({
      icon: "success",
      title: "설문이 삭제되었습니다.",
      confirmButtonText: "확인",
    }).then(() => {
      navigate("/list"); // 삭제 후 목록으로 이동
    });
  };
  const handleForceClose = async () => {
    const confirm = await Swal.fire({
      title: "이 설문을 지금 강제 종료하시겠습니까?",
      text: "종료 후에는 더 이상 응답을 받을 수 없습니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "강제 종료",
      cancelButtonText: "취소",
    });

    if (!confirm.isConfirmed) return;

    const now = new Date().toISOString();
    const { error } = await supabase
      .from("forms")
      .update({ end_time: now })
      .eq("id", formId);

    if (error) {
      await Swal.fire({
        icon: "error",
        title: "강제 종료 실패",
        text: error.message,
        confirmButtonText: "확인",
      });
    } else {
      await Swal.fire({
        icon: "success",
        title: "설문이 강제 종료되었습니다.",
        confirmButtonText: "확인",
      });
      if (onForceCloseSuccess) {
        onForceCloseSuccess(now); // 상태 반영 콜백
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="cursor-pointer">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => navigate(`/builder/${formId}`)}
        >
          편집
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => navigate(`/preview/${formId}`)}
        >
          미리보기
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" disabled>
          설문 중지
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={handleForceClose}
          disabled={Boolean(endTime && new Date(endTime) < new Date())}
        >
          강제 종료
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => alert("복사 기능 구현 예정")}
        >
          설문 복사
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-600 cursor-pointer"
          onClick={handleDeleteForm}
        >
          삭제
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default FormActionMenu;
