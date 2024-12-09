const {
  GraphQLSchema,
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
  GraphQLInputObjectType,
} = require("graphql");
const { createUserResolver } = require("./resolvers");

const createTypes = () => {
  // User Type
  const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
      _id: { type: new GraphQLNonNull(GraphQLID) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      email: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: GraphQLString },
      posts: { type: new GraphQLNonNull(new GraphQLList(PostType)) },
    }),
  });

  // Post Type
  const PostType = new GraphQLObjectType({
    name: "Post",
    fields: () => ({
      _id: { type: new GraphQLNonNull(GraphQLID) },
      title: { type: new GraphQLNonNull(GraphQLString) },
      content: { type: new GraphQLNonNull(GraphQLString) },
      imageUrl: { type: new GraphQLNonNull(GraphQLString) },
      creator: { type: new GraphQLNonNull(UserType) },
      createdAt: { type: new GraphQLNonNull(GraphQLString) },
      updatedAt: { type: new GraphQLNonNull(GraphQLString) },
    }),
  });

  // User Input Type
  const UserInputType = new GraphQLInputObjectType({
    name: "UserInputData",
    fields: {
      email: { type: new GraphQLNonNull(GraphQLString) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
    },
  });

  return { UserType, PostType, UserInputType };
};

// Extract types
const { UserType, UserInputType } = createTypes();

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "RootQuery",
    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => "Hello, world!",
      },
    },
  }),
  mutation: new GraphQLObjectType({
    name: "RootMutation",
    fields: {
      createUser: {
        type: UserType,
        args: {
          userInput: { type: new GraphQLNonNull(UserInputType) },
        },
        resolve: createUserResolver,
      },
    },
  }),
});

module.exports = schema;
