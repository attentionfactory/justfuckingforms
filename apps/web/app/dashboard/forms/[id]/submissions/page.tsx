import Link from "next/link";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubmissionsTable } from "@/components/jff/submissions-table";
import { WaitingForFirstSubmission } from "@/components/jff/waiting-for-submission";
import { apiGet, apiGetOrNull } from "@/lib/api";
import type {
  ApiForm,
  FormStats,
  SchemaResponse,
  SubmissionsListResponse,
} from "@/lib/api-types";

type Props = {
  params: Promise<{ id: string }>;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

export default async function SubmissionsPage({ params }: Props) {
  const { id } = await params;

  const detail = await apiGetOrNull<{ form: ApiForm; stats: FormStats }>(
    `/api/forms/${id}`,
  );
  if (!detail) notFound();
  const { form } = detail;

  const [list, schema] = await Promise.all([
    apiGet<SubmissionsListResponse>(`/api/forms/${id}/submissions?limit=50`),
    apiGet<SchemaResponse>(`/api/forms/${id}/schema`),
  ]);

  const isWaiting = list.total === 0;

  return (
    <>
      <div className="between" style={{ marginBottom: 24 }}>
        <div>
          <div className="crumb">
            forms /{" "}
            <Link href={`/dashboard/forms/${form.id}`} style={{ color: "var(--jff-fg)" }}>
              {form.name}
            </Link>{" "}
            / submissions
          </div>
          <h1>submissions</h1>
        </div>
        {!isWaiting && (
          <div className="row">
            <Button variant="outline" asChild>
              <a href={`${API_BASE}/api/forms/${form.id}/submissions/export`}>
                <Download size={14} /> export csv
              </a>
            </Button>
          </div>
        )}
      </div>

      {isWaiting ? (
        <WaitingForFirstSubmission formId={form.id} />
      ) : (
        <SubmissionsTable
          formId={form.id}
          rows={list.rows}
          total={list.total}
          fields={schema.fields}
        />
      )}

      {!isWaiting && (
        <p className="text-muted" style={{ fontSize: 13, marginTop: 16 }}>
          rows are stored as <span className="mono text-fg">jsonb</span>. the table reshapes
          when your form changes. nothing to migrate.
        </p>
      )}
    </>
  );
}
