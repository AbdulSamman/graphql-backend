import * as model from "./model.js";
import express from "express";
import cors from "cors";
import * as config from "./config.js";
import { graphqlHTTP } from "express-graphql";
//import { schema } from "./schema.js";

import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
} from "graphql";
const jobs = model.getJobs();

const JobType = new GraphQLObjectType({
  name: "Job",
  fields: () => ({
    id: { type: GraphQLInt },
    title: { type: GraphQLString },
    company: { type: GraphQLString },
    url: { type: GraphQLString },
    description: { type: GraphQLString },
    skillList: { type: GraphQLString },
    publicationDate: { type: GraphQLString },
  }),
});

const rootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    mainMessage: {
      type: GraphQLString,
      resolve(parent, args) {
        return "Hello";
      },
    },
    jobs: {
      type: new GraphQLList(JobType),
      args: { id: { type: GraphQLInt } },
      resolve(parent, args) {
        return jobs;
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createJob: {
      type: JobType,
      args: {
        title: { type: GraphQLString },
        company: { type: GraphQLString },
        url: { type: GraphQLString },
      },
      resolve(parent, args) {
        const newJob = {
          id: jobs.length + 1,
          title: args.title,
          company: args.company,
          url: args.url,
          description: "",
          skillList: "",
          publicationDate: "",
        };
        jobs.push(newJob);
        return newJob;
      },
    },
  },
});

const app = express();
app.use(cors());

// GraphQL
// root was wir zurückgeben

const schema = new GraphQLSchema({ query: rootQuery, mutation });

app.use(
  "/graphql",
  graphqlHTTP({
    schema,

    graphiql: true,
  })
);

// REST

app.get("/", (req: express.Request, res: express.Response) => {
  res.send(model.getApiInstructions());
});

app.get("/jobs", (req: express.Request, res: express.Response) => {
  res.json(model.getJobs());
});

app.get("/skills", (req: express.Request, res: express.Response) => {
  res.json(model.getSkills());
});

app.listen(config.port, () => {
  console.log(`listening on port http://localhost:${config.port}`);
});
