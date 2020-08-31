import { 
    GraphQLScalarType, 
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLFloat,
    GraphQLID,
    GraphQLInputObjectType,
    GraphQLNullableType
} from 'graphql'

import { IFieldIteratorFn, IResolverObject } from 'graphql-tools'
import {Model} from "mongoose";

export interface IReGqlDefinition {
    name: string,
    defs: {
        [field_name: string]: IReGqlDefinitionField | string
    },
}

export interface IReGqlDefinitionField {
    type: string,
    required?: boolean,
    unique?: boolean,
    default?: any,
    many?: boolean,
    ref?: IReGqlDefinitionFieldRef
}

export interface IReGqlDefinitionFieldRef {
    name: string,
    relation?: 'one' | 'many'
}

export interface IReGqlDefinitionRelation {

}

export interface IReGqlDefinitionFieldType {
    type: any,
    gql: GraphQLScalarType | GraphQLObjectType
}

export interface IReGqlSchema {
    [key: string] : IReGqlSchemaObjectType
}

export interface IReGqlSchemaObjectType {
    name: string
    fields:  ()=>{ [ key: string ] : IReGqlSchemaField } | { [ key: string ] : IReGqlSchemaField},
}

export interface IReGqlSchemaField {
    type: GraphQLObjectType | GraphQLScalarType | GraphQLInputObjectType | GraphQLNullableType,
    args?: GraphQLInputObjectType | GraphQLScalarType
    resolve?: (source?: any, args?: any) => any
}

export const rgString:IReGqlDefinitionFieldType  = {
    type: String,
    gql: GraphQLString
}

export const rgInt:IReGqlDefinitionFieldType  = {
    type: Number,
    gql: GraphQLInt
}

export const rgFloat:IReGqlDefinitionFieldType  = {
    type: Number,
    gql: GraphQLFloat
}

export const rgID:IReGqlDefinitionFieldType  = {
    type: String,
    gql: GraphQLID
}

export interface IReGqlDBDriver {
    url: string
    models: {
        [model_name: string] : Model<any>
    }

    createModel: (definition: IReGqlDefinition) => any

    count : (gqlType: GraphQLObjectType, args: any) => any
    findOne : (gqlType: GraphQLObjectType, args: any) => any
}

export interface IReGqlOptions {
    definitions: IReGqlDefinition[],
    dbDriver: IReGqlDBDriver
}