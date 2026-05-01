import Link from "next/link";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubmissionsTable } from "@/components/jff/submissions-table";
import { WaitingForFirstSubmission } from "@/components/jff/waiting-for-submission";
import { FORMS } from "@/lib/mock-data";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ waiting?: string }>;
};

export default async function SubmissionsPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  const waiting = sp.waiting === "1";

  const form = FORMS.find((f) => f.id === id);
  if (!form) notFound();

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
        {!waiting && (
          <div className="row">
            <Button variant="outline">
              <Download size={14} /> export csv
            </Button>
          </div>
        )}
      </div>

      {waiting ? <WaitingForFirstSubmission formId={form.id} /> : <SubmissionsTable />}

      {!waiting && (
        <p className="text-muted" style={{ fontSize: 13, marginTop: 16 }}>
          rows are stored as <span className="mono text-fg">jsonb</span>. the table reshapes
          when your form changes. nothing to migrate.
        </p>
      )}
    </>
  );
}
