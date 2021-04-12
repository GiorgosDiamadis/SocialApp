const { ApolloServer, PubSub } = require("apollo-server");
const mongoose = require("mongoose");
const { MONGODB } = require("./config");
const typeDefs = require("./graphql/typeDefs/typeDefs");
const resolvers = require("./graphql/resolvers");
const User = require("./models/User");
const Post = require("./models/Post");
const Comment = require("./models/Comment");
const Like = require("./models/Like");
const moment = require("moment");

const pubsub = new PubSub();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }),
  subscriptions: {
    path: "/subscriptions",
    onConnect: (connectionParams, webSocket, context) => {
      console.log("Client connected");
    },
    onDisconnect: (webSocket, context) => {
      console.log("Client disconnected");
    },
  },
});

mongoose
  .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
    return server.listen({ port: 5000 });
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  });

async function seed() {
  for (var i = 0; i < 50; i++) {
    const user = new User({
      username: `example ${i}`,
      password: `example${i}`,
      email: `example ${i}`,
      createdAt: `example ${i}`,
      born: `example ${i}`,
      livesIn: `example ${i}`,
      isFrom: `example ${i}`,
      graduatedAt: `example ${i}`,
    });

    const post = new Post({
      body: `example post ${i}`,
      user: user,
      createdAt: new Date().toISOString(),
    });
    await user.save();
    await post.save();
  }
}

// seed();
