/**
 * Determines the health impact level based on a given descriptive text.
 *
 * @param {string} [text=""] — A textual description potentially indicating health impact (optional).
 * @returns {{ label: string, color: string }} An object with a label indicating the impact category ("Perjudicial", "Recomendado", "Neutro", or "Sin Informacion") and a color code for UI styling.
 * @example
 * getImpactLevel("Este producto puede aumentar el colesterol.");
 * // Returns: { label: "Perjudicial", color: "destructive" }
 *
 * getImpactLevel("Este alimento es beneficioso para la salud.");
 * // Returns: { label: "Recomendado", color: "success" }
 *
 * getImpactLevel("Este ingrediente no afecta la salud.");
 * // Returns: { label: "Neutro", color: "secondary" }
 */
export function getImpactLevel(text = "") {
  const normalized = text.toLowerCase();
  if (
    normalized.includes("perjudicial") ||
    normalized.includes("riesgo") ||
    normalized.includes("exceso") ||
    normalized.includes("aumentar el colesterol") ||
    normalized.includes("hipertensión") ||
    normalized.includes("diabetes")
  ) {
    return { label: "Perjudicial", color: "destructive" };
  } else if (
    normalized.includes("positivo") ||
    normalized.includes("beneficioso") ||
    normalized.includes("bueno") ||
    normalized.includes("recomendado") ||
    normalized.includes("saludable") ||
    normalized.includes("ayuda")
  ) {
    return { label: "Recomendado", color: "success" };
  } else if (
    normalized.includes("neutro") ||
    normalized.includes("normal") ||
    normalized.includes("no afecta") ||
    normalized.includes("sin efecto") ||
    normalized.includes("no perjudicial")
  ) {
    return { label: "Neutro", color: "secondary" };
  }

  else {
    return { label: "Sin Informacion", color: "secondary" };
  }
}
