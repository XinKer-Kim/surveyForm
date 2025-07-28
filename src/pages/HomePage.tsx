import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { templates } from "@/constants/templates";

function HomePage() {
  const navigate = useNavigate();

  const handleSelectTemplate = (templateId: string) => {
    navigate(`/create/template/${templateId}`);
  };

  return (
    <div className="page">
      <div className="container">
        <div className="flex flex-col gap-4 w-full max-w-[1000px]">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            원하는 설문을 만들어보세요!
          </h4>
          {/* 템플릿 영역 */}
          <div className="w-full grid grid-cols-4 gap-4">
            {templates.map((template) => (
              <Card
                key={template.id}
                className="flex flex-col items-center justify-center gap-3 h-[170px] p-4 cursor-pointer hover:shadow-md"
                onClick={() => handleSelectTemplate(template.id)}
              >
                {template.icon}
                <div className="text-sm font-medium text-center">
                  {template.label}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
