import {IReGqlDBDriver, IReGqlDefinition, IReGqlDefinitionField} from "./dataType";
import {GraphQLObjectType} from "graphql";
import mongoose, {Model} from 'mongoose'
import {
    ByteResolver,
    CurrencyResolver,
    DateTimeResolver,
    EmailAddressResolver, HexColorCodeResolver, IPv4Resolver, IPv6Resolver, ISBNResolver, JSONResolver, MACResolver,
    PhoneNumberResolver, PortResolver,
    PostalCodeResolver, RGBAResolver, RGBResolver,
    URLResolver
} from "graphql-scalars";
import {Mode} from "fs";
interface IMongodbRelationOptions {

}
export default class ReGqlMongo implements IReGqlDBDriver {
    dataType: {
        [key: string] : string
    } = {
        DateTime: 'Date',
        Email: 'String',
        PhoneNumber: 'String',
        PostalCode: 'String',
        URL: 'String',
        Hex: 'String',
        IPv4: 'String',
        IPv6: 'String',
        ISBN: 'String',
        MAC: 'String',
        Port: 'Number',
        RGB: 'String',
        RGBA: 'String',
        Currency: 'Number',
        JSON: 'Map',


        String: 'String',
        ID: 'ObjectId',
        Int: 'Number',
        Float: 'Number',
    }
    url: string
    db_name: string
    models: {
        [model_name: string] : Model<any>
    } = {}

    constructor(url: string, db_name: string){
        this.url = url
        this.db_name = db_name
    }

    createModel(definition: IReGqlDefinition){
        let fields: any = {}
        Object.keys(definition.defs).forEach((field_name: string)=>{
            let field: IReGqlDefinitionField = <IReGqlDefinitionField>definition.defs[field_name]

            fields[field_name] = this.dataType[field.type] ? {
                type : this.dataType[field.type],
                required: field.required,
                unique: field.unique
            } : {
                type: 'ObjectId',
                ref: field.type
            }
        })
        this.models[definition.name] = mongoose.model(definition.name, new mongoose.Schema<any>(fields))
    }

    addRelation(relation: IMongodbRelationOptions){

    }

    async findOne(gqlType: GraphQLObjectType, args: any){
        console.log('Querying', this.models[gqlType.name])
        let pipeline = []
        // create a lookup aggregator that looks for relations and nested relations
        // match where field
        // sort field in ascending or descending order
        // limit values

        pipeline.push({ $match : {} })
        pipeline.push({ $sort: { "address.street.name" : 1 } })
        if (args.limit)
            pipeline.push({ $limit : args.limit })

        let startTime = Date.now()
        let query = await this.models[gqlType.name].aggregate(pipeline)
        console.log(Date.now() - startTime, 'ms')
        return query
    }

    async count (gqlType: GraphQLObjectType, args: any){
        let pipeline = []
        pipeline.push({ $match : {} })
        pipeline.push({$count: "count" })
        let query = await this.models[gqlType.name].aggregate(pipeline)
        return query[0]
    }

}