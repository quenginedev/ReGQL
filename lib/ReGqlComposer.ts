import {
    IReGqlDBDriver,
    IReGqlDefinition,
    IReGqlDefinitionField,
    IReGqlSchema,
    IReGqlSchemaField,
    IReGqlSchemaObjectType
} from "./dataType";
import {
    GraphQLString,
    GraphQLInt,
    GraphQLFloat,
    GraphQLID,
    GraphQLScalarType,
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLObjectTypeConfig,
    GraphQLFieldConfig,
    GraphQLOutputType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLNullableType,
    GraphQLFieldConfigMap,
    GraphQLSchema

} from 'graphql'
import {
    DateTimeResolver,
    EmailAddressResolver,
    PhoneNumberResolver,
    PostalCodeResolver,
    URLResolver,
    HexColorCodeResolver,
    IPv4Resolver,
    IPv6Resolver,
    ISBNResolver,
    MACResolver,
    PortResolver,
    RGBResolver,
    RGBAResolver,
    CurrencyResolver,
    JSONResolver,
} from 'graphql-scalars';
import pluralize from 'pluralize'
import { camelCase } from 'camel-case'
import { GraphQLISODateTime } from "type-graphql";
import {Model} from "mongoose";

export default class ReGqlComposer {
    outputTypes: {
        [key: string] : GraphQLOutputType
    } = {
        DateTime: DateTimeResolver,
        // Email: EmailAddressResolver,
        Email: GraphQLString,
        PhoneNumber: PhoneNumberResolver,
        PostalCode: PostalCodeResolver,
        URL: URLResolver,
        Hex: HexColorCodeResolver,
        IPv4: IPv4Resolver,
        IPv6: IPv6Resolver,
        ISBN: ISBNResolver,
        MAC: MACResolver,
        Port: PortResolver,
        RGB: RGBResolver,
        RGBA: RGBAResolver,
        Currency: CurrencyResolver,
        JSON: JSONResolver,

        String: GraphQLString,
        Int: GraphQLInt,
        Float: GraphQLFloat,
        ID: GraphQLID
    }

    types: { [key: string] : GraphQLOutputType | GraphQLObjectType | GraphQLInputObjectType} = {}


    db: IReGqlDBDriver
    queryType: GraphQLFieldConfigMap<any, any> = {}
    mutationType: IReGqlSchema = {}

    constructor(db: IReGqlDBDriver) {
        this.db = db
    }

    compose(definitions: IReGqlDefinition[]) {
        definitions.forEach(definition => {
            definition = this.normalizeDefinitions(definition)
            this.extractRelationships(definition)
            this.db.createModel(definition)
            this.createOutputType(definition)
        })
    }

    // Normalizes definitions to the right format for processing
    normalizeDefinitions(definition: IReGqlDefinition): IReGqlDefinition{
        Object.keys(definition.defs).forEach(def_key=>{
            let normalizedDefField: IReGqlDefinitionField
            let defaults = {
                required: false,
                unique: false,
                many: false
            }
            if(typeof definition.defs[def_key] == "string"){
                definition.defs[def_key] = {
                    type : definition.defs[def_key].toString()
                }
            }

            if (typeof definition.defs[def_key] === 'object'){
                definition.defs[def_key] = { ...defaults, ...<IReGqlDefinitionField>definition.defs[def_key] }
            }
        })
        return definition
    }



    createOutputType(definition: IReGqlDefinition){
        let objectType: GraphQLObjectTypeConfig<any, any> = {
            name: definition.name,
            fields: ()=>{
                let result: {
                    [name: string] : GraphQLFieldConfig<any,any>
                } = {}

                // Process collection field
                Object.keys(definition.defs).forEach((def_key: string)=>{
                    let composition: IReGqlDefinitionField = <IReGqlDefinitionField>definition.defs[def_key]
                    let type = this.outputTypes[composition.type]
                    type = composition.required ? new GraphQLNonNull(type) : type
                    type = composition.many ? new GraphQLList(type) : type
                    result[def_key] = {
                        type
                    }
                })
                return result
            }
        }

        let outputType = new GraphQLObjectType({
            name: objectType.name,
            fields: objectType.fields
        })

        this.outputTypes[definition.name] = outputType
        this.types[definition.name] = outputType

        // TODO Add ObjectType to gqlDataTypes
        // this.queries[name] = {
        //     name,
        //     field:
        // }
        // this.queries[pluralize(schema.name.toLowerCase())] = {
        //     name: pluralize(schema.name.toLowerCase()),
        //     field: {
        //
        //     }
        // }
    }
    extractRelationships(definition: IReGqlDefinition){
        Object.keys(definition.defs).forEach((field_name: string)=>{
            if(typeof definition.defs[field_name] == "object"){
                let composition = <IReGqlDefinitionField>definition.defs[field_name]
                if(!!composition.ref){
                    // this.relations[composition.ref.relation] = {

                    // }
                }
            }
        })
    }

    buildQueryAndMutation(){
        Object.keys(this.types).forEach(type_name=>{
            this.findOne(<GraphQLObjectType>this.types[type_name])
        })
        return new GraphQLSchema({
            query: new GraphQLObjectType({
                name: 'Query',
                fields: this.queryType
            })
        })
    }

    findOne(type: GraphQLObjectType){
        this.queryType[pluralize(camelCase(type.name))] = {
            type: new GraphQLList(type) ,
            args: {
                limit: {
                    type: GraphQLInt,
                    description: `limits ${type.name} results`
                }
            },
            description: `find many ${pluralize(type.name)}`,
            resolve: async (source, args, context, info) =>{
                // console.log({source, args, context, info})
                //Todo add args
                let doc = await this.db.findOne(type, args)
                return doc
            }

        }
    }

}