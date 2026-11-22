import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ReviewActions({
  onApprove,
  onReject,
  approveLabel = "قبول",
}: {
  onApprove: () => void;
  onReject: () => void;
  approveLabel?: string;
}) {
  return (
    <div className="flex gap-1.5">
      <Button size="sm" variant="success" onClick={onApprove}>
        <Check />
        {approveLabel}
      </Button>
      <Button size="sm" variant="danger" onClick={onReject}>
        <X />
        رفض
      </Button>
    </div>
  );
}
