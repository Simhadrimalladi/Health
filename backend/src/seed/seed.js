const connectDB = require('../config/db');
const { Organization, HierarchyLevel, User, Patient, KnowledgeQuestion, KnowledgeNode, QuestionAnswer } = require('../models');
const data = require('./data');

async function seed() {
  await connectDB();
  await Promise.all([
    Organization.deleteMany({}),
    HierarchyLevel.deleteMany({}),
    User.deleteMany({}),
    Patient.deleteMany({}),
    KnowledgeQuestion.deleteMany({}),
    KnowledgeNode.deleteMany({}),
    QuestionAnswer.deleteMany({})
  ]);

  await Organization.insertMany(data.organizations);
  await HierarchyLevel.insertMany(data.hierarchyLevels);
  await User.insertMany(data.users);
  await Patient.insertMany(data.patients);
  await KnowledgeQuestion.insertMany(data.questions);
  await KnowledgeNode.insertMany([...data.preAnsweredNodes, ...data.patientNodes]);
  await QuestionAnswer.insertMany(data.preAnsweredAnswers);

  console.log('BRAHMO seed complete');
  console.log(`Organizations: ${data.organizations.length}`);
  console.log(`Hierarchy levels: ${data.hierarchyLevels.length}`);
  console.log(`Users: ${data.users.length}`);
  console.log(`Patients: ${data.patients.length}`);
  console.log(`Knowledge questions: ${data.questions.length}`);
  console.log(`Knowledge nodes: ${data.preAnsweredNodes.length + data.patientNodes.length}`);
  await require('mongoose').disconnect();
}

seed().catch(async (error) => {
  console.error(error);
  await require('mongoose').disconnect();
  process.exit(1);
});
