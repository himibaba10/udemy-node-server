const {
  GraphQLSchema,
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
  GraphQLInputObjectType,
} = require("graphql");
const {
  createUserResolver,
  loginResolver,
  createPostResolver,
} = require("./resolvers");

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

  const PostInputType = new GraphQLInputObjectType({
    name: "PostInputData",
    fields: {
      title: { type: new GraphQLNonNull(GraphQLString) },
      content: { type: new GraphQLNonNull(GraphQLString) },
      imageUrl: { type: new GraphQLNonNull(GraphQLString) },
    },
  });

  //Auth data type
  const AuthData = new GraphQLObjectType({
    name: "AuthData",
    fields: {
      userId: { type: new GraphQLNonNull(GraphQLID) },
      token: { type: new GraphQLNonNull(GraphQLString) },
    },
  });

  return { UserType, PostType, UserInputType, AuthData, PostInputType };
};

// Extract types
const { AuthData, UserType, UserInputType, PostType, PostInputType } =
  createTypes();

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "RootQuery",
    fields: {
      login: {
        type: AuthData,
        args: {
          email: { type: new GraphQLNonNull(GraphQLString) },
          password: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: loginResolver,
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
      createPost: {
        type: PostType,
        args: {
          postInput: { type: new GraphQLNonNull(PostInputType) },
        },
        resolve: createPostResolver,
      },
    },
  }),
});

module.exports = schema;
