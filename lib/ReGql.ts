import {IReGqlDBDriver, IReGqlDefinition, IReGqlOptions, IReGqlSchema} from './dataType'
import ReGqlComposer from "./ReGqlComposer";
export default class ReGql {

    schema: IReGqlSchema = {}

    definitions: IReGqlDefinition[] = []
    db: IReGqlDBDriver
    composer: ReGqlComposer

    constructor(options: IReGqlOptions){
        this.definitions = options.definitions
        this.db = options.dbDriver
        this.composer = new ReGqlComposer(this.db)
        this.createCompositions()
    }

    createCompositions(){
        this.composer.compose(this.definitions)
    }
    public buildSchema() {
        return this.composer.buildQueryAndMutation()
    }
}