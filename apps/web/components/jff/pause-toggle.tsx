"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { updateFormAction } from "@/app/dashboard/forms/actions";

type Props = {
  formId: string;
  isActive: boolean;
};

export function PauseToggle({ formId, isActive }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      const result = await updateFormAction(formId, { isActive: !isActive });
      if (result.ok) router.refresh();
    });
  };

  return (
    <Button
      variant={isActive ? "outline" : "default"}
      size="sm"
      onClick={onClick}
      disabled={pending}
    >
      {pending ? "..." : isActive ? "pause" : "resume"}
    </Button>
  );
}
