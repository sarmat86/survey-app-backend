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
    surveyId: ID!
    authorId: ID!
    content: String!
    position: Int
    choices: [Choice!]!
    createdAt: String!
    updatedAt: String!
  }
  
  input QuestionInput {
    content: String!
    position: Int
    choices: [ChoiceInput!]!
  }

  input QuestionUpdateInput {
    content: String
    position: Int
    choices: [ChoiceInput!]
  }

  input SurveyInputData {
    topic: String!
  }

  type Survey {
    id: ID!
    author: User!
    topic: String!
    questions: [Question!]!
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

  type Mutation {
    createSurvey(data: SurveyInputData!): Survey!
    updateSurvey(id: ID!, data: SurveyInputData!): Survey!
    deleteSurvey(id: ID!): Boolean

    addQuestion(surveyId: ID!, data: QuestionInput!): Question!
    updateQuestion(id: ID!, data: QuestionUpdateInput!): Question!
    deleteQuestion(id: ID!): Boolean!

    createPoll(surveyId: ID!, data: PollInput!): Poll!
    updatePollAnswers(id: ID!, answers: [AnswerInput]!): Poll!
    deletePoll(id: ID!): Boolean!
  }

  type Query{
    surveys:  [Survey!]!
    survey(id: ID!): Survey!

    questions(surveyId: ID): [Question!]!
    question(id: ID!): Question!

    polls: [Poll!]!
    poll(id: ID!): Poll!
    
  }

  schema {
    query: Query
    mutation: Mutation
  }
`);
