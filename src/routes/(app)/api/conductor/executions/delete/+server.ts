import serviceRoleClient from "$lib/server/supabase";
import type { RequestHandler } from "./$types";
import { executions } from "$lib/stores/executionStore";
import { activateStopFlag } from "$lib/server/kevin/action";

export const POST: RequestHandler = async ({ request }) => {
  const { run_id } = await request.json();

  if (!run_id) {
    return new Response(JSON.stringify({ success: false, message: "run_id is required" }), { status: 400 });
  }

  // First stop the execution
  activateStopFlag();

  // Update the store to mark execution as stopped
  executions.update(execs => 
    execs.map(exec => 
      exec.run_id === run_id 
        ? { ...exec, status: "stopped" }
        : exec
    )
  );

  // Then delete from database
  const { error } = await serviceRoleClient.from("executions").delete().eq("run_id", run_id);

  if (error) {
    console.error("Error deleting execution:", error);
    return new Response(JSON.stringify({ success: false, message: "Failed to delete execution" }), { status: 500 });
  }

  // Remove from store after successful database deletion
  executions.update(execs => execs.filter(exec => exec.run_id !== run_id));

  return new Response(JSON.stringify({ success: true, message: "Execution deleted successfully" }), { status: 200 });
};