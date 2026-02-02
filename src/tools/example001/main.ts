const btn = document.getElementById("btn-run") as HTMLButtonElement | null;
const status = document.getElementById("status") as HTMLDivElement | null;
const workspace = document.getElementById("workspace") as HTMLDivElement | null;

if (!btn || !status || !workspace) {
  throw new Error("Required DOM elements not found.");
}

function showStatus(message: string, type: "info" | "success" | "error" = "info") {
  const cls =
    type === "error"
      ? "bg-red-50 text-red-700"
      : type === "success"
      ? "bg-green-50 text-green-700"
      : "bg-blue-50 text-blue-700";
  status.className = `block p-4 rounded-lg ${cls}`;
  status.innerHTML = message;
}

async function runProcess() {
  btn.disabled = true;
  btn.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> Processing...`;

  try {
    showStatus("Loading input files...", "info");

    await new Promise((resolve) => setTimeout(resolve, 600));

    workspace.textContent = "Example 001 complete. Replace this with your result.";
    showStatus('<i class="fas fa-check-circle mr-2"></i> Done!', "success");
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    showStatus(`<i class="fas fa-exclamation-triangle mr-2"></i> Error: ${msg}`, "error");
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<i class="fas fa-play mr-2"></i> Run Process`;
  }
}

btn.addEventListener("click", () => {
  void runProcess();
});
