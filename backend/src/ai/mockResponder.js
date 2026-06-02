function mockSessionResponse({ message, contextString, patient }) {
  const hasPadma = /padma/i.test(contextString || '') || /padma/i.test(message || '');
  const hasFasting = /fasting|ekadashi|glimepiride/i.test(contextString || '');
  if (hasPadma && hasFasting) {
    return "Based on the injected Supra context, Mrs. Padma follows the fasting-diabetic protocol for Ekadashi. For her specific regimen, skip Glimepiride 2mg on Ekadashi fast days, continue Metformin 1000mg with the evening meal when she breaks the fast, monitor blood glucose every 4 hours, and break the fast immediately if BG is below 70 mg/dL or above 300 mg/dL. Also keep juice/glucose available and document readings in the fasting monitoring chart. This is a demo clinical-support response, so final decisions must follow local senior review.";
  }
  return "I can provide general clinical decision support, but I do not see enough patient-specific organizational context in the current prompt. Confirm medications, allergies, renal function, current vitals, and local hospital protocol before changing treatment.";
}

function mockComparisonResponse(level) {
  if (level === 1) {
    return "For a diabetic patient who is fasting, consider checking blood glucose more often, reviewing oral hypoglycemics, and advising the patient to break the fast if symptoms of hypoglycemia occur. Individualize based on medications and clinician judgment.";
  }
  if (level === 2) {
    return "Use Supra's fasting diabetic protocol: adjust insulin timing rather than dose, avoid hypoglycemia-prone medications during fasting, continue safe medications with meals, and monitor BG every 4 hours. This is hospital/department context but does not include Mrs. Padma's exact medication list.";
  }
  return "For Mrs. Padma's Ekadashi fast, apply the full Supra + patient context: she is on Metformin 1000mg BD and Glimepiride 2mg OD, observes Ekadashi twice monthly, and has a prior hypoglycemia pattern on fast days. Skip Glimepiride 2mg on Ekadashi days, continue Metformin 1000mg with the evening meal, monitor BG every 4 hours, keep juice/glucose ready, and break the fast if BG < 70 mg/dL or > 300 mg/dL.";
}

module.exports = { mockSessionResponse, mockComparisonResponse };
