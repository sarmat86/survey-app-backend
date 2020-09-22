const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type User {
    id: ID!,
    email: String!, 
  }
  
  type Choice {
    id: ID!
    position: Int
    content: String!
  }

  input ChoiceInput{
    content: String!
    position: Int
  }

  type Question {
    id: ID!
    authorId: ID!
    content: String!
    favourite: Boolean
    choices: [Choice!]!
    createdAt: String!
    updatedAt: String!
  }
  
  input QuestionInput {
    content: String!
    favourite: Boolean
    choices: [ChoiceInput!]!
  }

  input QuestionUpdateInput {
    content: String
    favourite: Boolean
    choices: [ChoiceInput!]
  }

  input SurveyInputData {
    topic: String!
  }
  type SurveyQuestion{
    id: ID!
    authorId: ID!
    content: String!
    favourite: Boolean
    position: Int
    choices: [Choice!]!
    createdAt: String!
    updatedAt: String!
  }

  type Survey {
    id: ID!
    author: User!
    topic: String!
    questions: [SurveyQuestion!]!
    createdAt: String!
    updatedAt: String!
  }

  input AnswerInput {
    questionId: ID!
    choices: [ID]! 
  }
  input PollInput {
    answers: [AnswerInput]! 
  }
  type Answer {
    questionId: ID!
    choices: [ID]! 
  }
  type Poll {
    id: ID!
    surveyAuthorId: ID!
    surveyId: ID!
    answers: [Answer]!
    createdAt: String!
    updatedAt: String! 
  }
  type Deleted {
    success: Boolean!
    matchedDocuments: Int!
    deletedCount: Int!
    updatedSurvey: Int
  }

  type Mutation {
    createSurvey(data: SurveyInputData!): Survey!
    updateSurvey(id: ID!, data: SurveyInputData!): Survey!
    deleteSurvey(id: ID!): Boolean

    
    createQuestion(surveyId: ID, position: Int, data: QuestionInput!): Question!
    updateQuestion(id: ID!, data: QuestionUpdateInput!): Question!
    addQuestionToSurvey(id: ID!, surveyId: ID!, position: Int): Boolean!
    deleteQuestion(id: ID!): Deleted!
    deleteQuestions(questionsId: [ID!]!): Deleted!

    createPoll(surveyId: ID!, data: PollInput!): Poll!
    updatePollAnswers(id: ID!, answers: [AnswerInput]!): Poll!
    deletePoll(id: ID!): Boolean!
  }

  type Query{
    surveys:  [Survey!]!
    survey(id: ID!): Survey!

    questions: [Question!]!
    question(id: ID!): Question!
    
    polls: [Poll!]!
    poll(id: ID!): Poll!
  }

  schema {
    query: Query
    mutation: Mutation
  }
`);
