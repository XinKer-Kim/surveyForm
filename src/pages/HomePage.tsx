import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { templates } from "@/constants/templates";
import { Sparkles } from "lucide-react";
function HomePage() {
  const navigate = useNavigate();

  const handleSelectTemplate = (templateId: string) => {
    navigate(`/create/template/${templateId}`);
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-[1100px]">
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        원하는 설문을 만들어보세요!
      </h4>
      {/* 템플릿 영역 */}
      <div className="w-full flex flex-wrap gap-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            className="flex flex-col items-center justify-center gap-3 w-[125px] h-[130px] p-4 cursor-pointer hover:shadow-md"
            onClick={() => handleSelectTemplate(template.id)}
          >
            {template.icon}
            <div className="text-sm font-medium text-center">
              {template.label}
            </div>
          </Card>
        ))}
        <Card
          // key={template.id}
          className="flex flex-col items-center justify-center gap-3 w-[125px] h-[130px] p-4 cursor-pointer hover:shadow-md"
          onClick={() => navigate("/builder/new")}
        >
          <Sparkles className="w-6 h-6 text-gray-500" />
          <div className="text-sm font-medium text-center">직접 만들기</div>
        </Card>
      </div>
    </div>
  );
}

export default HomePage;
// {
//   id: "custom",
//   label: "직접 만들기",
//   icon: <Sparkles className="w-6 h-6 text-gray-500" />,
// },
