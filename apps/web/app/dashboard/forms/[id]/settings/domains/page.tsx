import { notFound } from "next/navigation";
import { apiGetOrNull } from "@/lib/api";
import type { ApiForm, FormStats } from "@/lib/api-types";
import { AllowedDomainsClient } from "./client";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AllowedDomainsPage({ params }: Props) {
  const { id } = await params;
  const detail = await apiGetOrNull<{ form: ApiForm; stats: FormStats }>(
    `/api/forms/${id}`,
  );
  if (!detail) notFound();

  return (
    <AllowedDomainsClient
      formId={detail.form.id}
      formName={detail.form.name}
      initialDomains={detail.form.allowedDomains}
      initialStrict={detail.form.strictOrigin}
    />
  );
}
