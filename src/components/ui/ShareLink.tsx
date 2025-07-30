import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Share2 } from "lucide-react";
import Swal from "sweetalert2";
interface ShareLinkProps {
  formId: string;
}
const ShareLink = ({ formId }: { formId: string }) => {
  const [open, setOpen] = useState(false);
  const url = `${window.location.origin}/take/${formId}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    Swal.fire({
      icon: "success",
      title: "링크가 복사되었습니다!",
      confirmButtonText: "확인",
    });

    setOpen(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="cursor-pointer"
      >
        <Share2 className="w-4 h-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>설문 공유하기</DialogHeader>
          <input
            className="w-full border px-2 py-1 text-sm rounded mt-2"
            value={url}
            readOnly
          />
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button
              className="cursor-pointer"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              취소
            </Button>
            <Button className="cursor-pointer" onClick={handleCopy}>
              링크 복사
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default ShareLink;
