// import schema from '../../../amplify/data/resource;

// export function getSelectionSetForModel(modelName: string): string[] {
//   const model = schema.models[modelName];
//   if (!model) throw new Error(`Model ${modelName} not found in schema`);

//   return Object.entries(model.fields)
//     .filter(([_, field]) => field.type !== 'model') // skip relations
//     .map(([fieldName]) => fieldName);
// }
