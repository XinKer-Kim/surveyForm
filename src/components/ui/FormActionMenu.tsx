import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
interface FormActionMenuProps {
    formId: string;
}
const FormActionMenu = ({ formId }: { formId: string }) => {
    const navigate = useNavigate();

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
                <DropdownMenuItem disabled>미리보기</DropdownMenuItem>
                <DropdownMenuItem disabled>설문 중지</DropdownMenuItem>
                <DropdownMenuItem disabled>강제 종료</DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert("복사 기능 구현 예정")}>
                    설문 복사
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600" onClick={() => alert("삭제 요청")}>
                    삭제
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
export default FormActionMenu;