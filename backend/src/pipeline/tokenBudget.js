function estimateTokens(text) {
  if (!text) return 0;
  return Math.ceil(String(text).split(/\s+/).filter(Boolean).length * 1.35);
}

function firstSentence(text) {
  if (!text) return '';
  const match = String(text).match(/^[^.!?]+[.!?]/);
  return match ? match[0] : String(text).slice(0, 160);
}

function compressNode(node) {
  if (node.compressionMode === 'FULL' || node.type === 'CONSTRAINT' || node.sourceType === 'PATIENT') return node.content;
  return firstSentence(node.content);
}

module.exports = { estimateTokens, firstSentence, compressNode };
