// import { getDataClient } from '@aws-amplify/backend';

// const client = getDataClient();

// export const handler = async (event: any) => {
//   const user = event.request.userAttributes;

//   await client.models.User.create({
//     id: user.sub,
//     email: user.email,
//     phoneNumber: user.phone_number,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   });

//   return event;
// };
