const { composeContext } = require('../pipeline/composer');
const { mockComparisonResponse } = require('../ai/mockResponder');
const { estimateTokens } = require('../pipeline/tokenBudget');

async function threeLevelComparison({ userId, patientId, query }) {
  const level2 = await composeContext({ userId, patientId: null, query, mode: 'hospital_department' });
  const level3 = await composeContext({ userId, patientId, query, mode: 'full' });
  return {
    query,
    levels: [
      {
        level: 1,
        name: 'No Questions / Empty AI',
        included: { supraFastingProtocol: false, formulary: false, padmaMeds: false, ekadashiPattern: false, glimepirideSkipRule: false, bgQ4h: false },
        response: mockComparisonResponse(1),
        score: 2,
        nodeCounts: { selected: 0 },
        tokenUsage: estimateTokens(mockComparisonResponse(1))
      },
      {
        level: 2,
        name: 'Hospital + Department Questions',
        included: { supraFastingProtocol: true, formulary: true, padmaMeds: false, ekadashiPattern: false, glimepirideSkipRule: true, bgQ4h: true },
        response: mockComparisonResponse(2),
        score: 3.5,
        nodeCounts: { selected: level2.selectedNodes.length, byType: level2.counts.byType },
        tokenUsage: level2.tokenUsage,
        contextPreview: level2.contextString
      },
      {
        level: 3,
        name: 'Full + Role + Cohort + Patient',
        included: { supraFastingProtocol: true, formulary: true, padmaMeds: true, ekadashiPattern: true, glimepirideSkipRule: true, bgQ4h: true },
        response: mockComparisonResponse(3),
        score: 4.5,
        nodeCounts: { selected: level3.selectedNodes.length, byType: level3.counts.byType },
        tokenUsage: level3.tokenUsage,
        contextPreview: level3.contextString
      }
    ]
  };
}

module.exports = { threeLevelComparison };
