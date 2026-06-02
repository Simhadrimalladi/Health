const connectDB = require('../config/db');
const { KnowledgeNode } = require('../models');

const types = ['CONSTRAINT', 'DECISION', 'ANTI_PATTERN', 'FACT'];
const departments = [null, 'medicine', 'ortho'];
const titles = {
  CONSTRAINT: ['Mandatory review checkpoint', 'Critical prescribing guardrail', 'Procedure safety rule'],
  DECISION: ['Ward decision protocol', 'Escalation pathway', 'Formulary preference'],
  ANTI_PATTERN: ['Avoid repeated failure pattern', 'Do not use outdated workflow', 'Unsafe shortcut warning'],
  FACT: ['Operational fact', 'Clinic timing detail', 'Local patient-flow note']
};

function makeNode(i) {
  const type = types[i % types.length];
  const department = departments[i % departments.length];
  const importance = Number((0.35 + ((i % 60) / 100)).toFixed(2));
  const zone = department ? 1 : 2;
  const title = `${titles[type][i % 3]} #${i + 1}`;
  const hierarchyLevelId = department === 'ortho' ? 'HL-05-ORTHO' : department === 'medicine' ? 'HL-08-MED' : 'HL-GLOBAL';
  return {
    id: `N-MONTH12-${String(i + 1).padStart(3, '0')}`,
    orgId: 'supra',
    hierarchyLevelId,
    type,
    title,
    content: `${title}: Month-12 simulated institutional knowledge. It should compete with other nodes but only enter final context when rules and injection weights justify it. Department scope: ${department || 'hospital-wide'}.`,
    importance,
    zone,
    status: 'ACTIVE',
    department,
    derivabilityScore: Number((0.05 + ((i % 20) / 100)).toFixed(2)),
    sourceQuestionId: `Q-SIM-${i + 1}`,
    sourceType: 'QUESTION',
    createdBy: i % 2 ? 'U-ANANYA' : 'U-MEERA',
    decayProfile: type === 'CONSTRAINT' ? 'FIXED' : type === 'FACT' ? 'FAST_12M' : 'STANDARD_24M',
    retrievalWeight: Number((importance + (type === 'CONSTRAINT' ? 0.15 : 0.05)).toFixed(2)),
    injectionWeight: Number((importance + (type === 'CONSTRAINT' ? 0.20 : 0.08)).toFixed(2)),
    compressionMode: type === 'CONSTRAINT' ? 'FULL' : 'COMPRESSED'
  };
}

async function seedMonth12() {
  await connectDB();
  const nodes = Array.from({ length: 500 }, (_, i) => makeNode(i));
  await KnowledgeNode.bulkWrite(nodes.map(node => ({
    updateOne: { filter: { id: node.id }, update: { $set: node }, upsert: true }
  })));
  console.log('Month-12 scalability seed complete: 500 extra nodes upserted.');
  await require('mongoose').disconnect();
}

seedMonth12().catch(async (error) => {
  console.error(error);
  await require('mongoose').disconnect();
  process.exit(1);
});
