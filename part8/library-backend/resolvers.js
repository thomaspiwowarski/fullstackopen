const { UserInputError, AuthenticationError } = require("apollo-server");
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();
const jwt = require("jsonwebtoken");
const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");

const JWT_SECRET = process.env.JWT_SECRET;

const resolvers = {
    Query: {
        bookCount: () => Book.collection.countDocuments(),
        authorCount: () => Author.collection.countDocuments(),
        allBooks: async (root, args) => {
            if (args.genre && args.author)
                return await Book.find({
                    genres: args.genre,
                    author: args.author,
                }).populate("Author", { name: 1, born: 1 });
            if (args.genre)
                return Book.find({ genres: args.genre }).populate("Author", {
                    name: 1,
                    born: 1,
                });
            if (args.author)
                return Book.find({ author: args.author }).populate("Author", {
                    name: 1,
                    born: 1,
                });
            return await Book.find({}).populate("Author", { name: 1, born: 1 });
        },
        allAuthors: async () => await Author.find({}),
        me: (root, args, context) => {
            return context.currentUser;
        },
        favouriteGenre: (root, args, { currentUser }) =>
            currentUser.favouriteGenre,
    },

    Author: {
        bookCount: async (root) => root.books,
    },

    Mutation: {
        addBook: async (root, args, { currentUser }) => {
            if (!currentUser) {
                throw new AuthenticationError("not authenticated");
            }
            let author = await Author.findOne({ name: args.author });
            if (!author) {
                author = new Author({
                    name: args.author,
                    born: null,
                });
                try {
                    await author.save();
                } catch (error) {
                    throw new UserInputError(error.message, {
                        invalidArgs: args,
                    });
                }
            }
            const book = new Book({ ...args, Author: author._id });
            author.books = author.books.concat(book._id);
            console.log(author);
            try {
                await author.save();
                await book.save();
            } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: args,
                });
            }

            const b = await Book.findById(book._id).populate("Author", {
                name: 1,
                born: 1,
            });
            pubsub.publish("BOOK_ADDED", { bookAdded: b });
            return b;
        },

        editAuthor: async (root, args, { currentUser }) => {
            if (!currentUser) {
                throw new AuthenticationError("not authenticated");
            }
            const author = await Author.findOne({ name: args.name });
            if (!author) return null;
            try {
                author.born = args.year;
                return await author.save();
            } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: args,
                });
            }
        },

        createUser: async (root, args) => {
            const user = new User({
                username: args.username,
                favouriteGenre: args.favouriteGenre,
            });
            try {
                return user.save();
            } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: args,
                });
            }
        },

        login: async (root, args) => {
            const user = await User.findOne({ username: args.username });
            if (!user || args.password !== "secret")
                throw new UserInputError("Wrong credentials");
            const userForToken = { username: user.username, id: user._id };
            return { value: jwt.sign(userForToken, JWT_SECRET) };
        },
    },
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator(["BOOK_ADDED"]),
        },
    },
};

module.exports = resolvers;
