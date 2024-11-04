import { serviceRoleClient } from "$lib/supabase";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
  const { run_id } = await request.json();

  if (!run_id) {
    return new Response(JSON.stringify({ success: false, message: "run_id is required" }), { status: 400 });
  }

  const { error } = await serviceRoleClient
    .from("executions")
    .delete()
    .eq("run_id", run_id);

  if (error) {
    console.error("Error deleting execution:", error);
    return new Response(JSON.stringify({ success: false, message: "Failed to delete execution" }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true, message: "Execution deleted successfully" }), { status: 200 });
};