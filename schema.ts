import { 
    IReGqlDefinition,
} from './lib/dataType'

const CustomerSchema: IReGqlDefinition = {
    name: 'Customer',
    defs: {
        title: 'String',
        first: 'String',
        last: 'String',
        email: 'Email',
        dob: 'DateTime',
        // displayName: 'String',
        // phoneNumber: 'Int',
        // email: {
        //     type: 'String',
        //     required: true,
        //     unique: true,
        // },
        // pets: {
        //     type: "Pet",
        //     many: true,
        //     ref: {
        //         name: 'UserPets',
        //         relation: 'one'
        //     }
        // }
    }
}

// const HousingSchema: IReGqlDefinition = {
//     name: 'Housing',
//     defs: {
//         "Community Area Name": 'String'
//         // name: "String",
//         // birth_day: "DateTime",
//         // owner: {
//         //     type: 'User',
//         //     required: true,
//         //     ref: {
//         //         name: 'UserPets',
//         //     }
//         // }
//     }
// }

export default [
    CustomerSchema,
    // HousingSchema
]