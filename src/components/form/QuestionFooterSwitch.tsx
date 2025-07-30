import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

interface QuestionFooterSwitchProps {
  label?: string;
  onCheckedChange: () => void;
  checked?: boolean;
  disabled: boolean | undefined;
}

function QuestionFooterSwitch({
  label = "답변 필수",
  onCheckedChange,
  checked = false,
  disabled,
}: QuestionFooterSwitchProps) {
  return (
    <>
      <div className="flex items-center justify-start space-x-2">
        <Label>{label}</Label>
        <Switch
          onCheckedChange={onCheckedChange}
          checked={checked}
          disabled={disabled}
          className="switch-naver"
        />
      </div>
    </>
  );
}

export default QuestionFooterSwitch;
