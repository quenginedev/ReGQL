import express, { Request, Response } from 'express'
import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import compression from 'compression'
import ReGql from "./lib/ReGql";
import ReGqlMongo from "./lib/ReGqlMongo";
import schema from "./schema";
import {buildSchema, buildSchemaSync} from "type-graphql";

export default function initServer(){

    const app = express()
    app.use(cors())
    app.use(compression())

    const reGql = new ReGql({
        dbDriver: new ReGqlMongo('mongodb://localhost:27017', 'houser'),
        definitions: schema
    })

    const server = new ApolloServer({
        schema: reGql.buildSchema(),
        // typeDefs: `type Query { hello: String }`,
        // resolvers: { Query: { hello: source => 'hello world' } }
    })

    server.applyMiddleware({app, path: '/'})

    app.listen(80, ()=>{
        console.log("Hello server")
    })
}

