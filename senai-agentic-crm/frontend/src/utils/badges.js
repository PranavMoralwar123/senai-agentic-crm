export function actionBadgeClass(actionType) {
  const type = (actionType || "").toLowerCase();
  if (type.includes("escalat")) return "bg-danger";
  if (type.includes("reply") || type.includes("respond")) return "bg-success";
  if (type.includes("follow")) return "bg-info text-dark";
  if (type.includes("close")) return "bg-dark";
  return "bg-secondary";
}

export function urgencyBadgeClass(urgency) {
  const level = (urgency || "").toLowerCase();
  if (level.includes("high") || level.includes("critical")) return "bg-danger";
  if (level.includes("medium") || level.includes("med")) return "bg-warning text-dark";
  return "bg-success";
}

export function categoryBadgeClass(category) {
  const cat = (category || "").toLowerCase();
  if (cat.includes("billing") || cat.includes("refund")) return "bg-primary";
  if (cat.includes("support") || cat.includes("technical")) return "bg-info text-dark";
  if (cat.includes("sales")) return "bg-success";
  if (cat.includes("complaint")) return "bg-danger";
  return "bg-secondary";
}

export function churnRiskClass(score) {
  if (score == null) return "bg-secondary";
  if (score >= 0.7) return "bg-danger";
  if (score >= 0.4) return "bg-warning";
  return "bg-success";
}
