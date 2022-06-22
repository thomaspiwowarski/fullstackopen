import { gql } from "@apollo/client";

export const ALL_AUTHORS = gql`
    query {
        allAuthors {
            name
            born
            id
        }
    }
`;

export const ALL_BOOKS = gql`
    query {
        allBooks {
            title
            published
            Author {
                name
            }
            genres
        }
    }
`;

export const CREATE_BOOK = gql`
    mutation createBook(
        $title: String!
        $published: Int!
        $author: String!
        $genres: [String!]!
    ) {
        addBook(
            title: $title
            published: $published
            author: $author
            genres: $genres
        ) {
            title
            published
            Author {
                name
            }
            genres
        }
    }
`;

export const SET_BORN = gql`
    mutation setBorn($name: String!, $year: Int!) {
        editAuthor(name: $name, year: $year) {
            name
            born
            id
        }
    }
`;

export const LOGIN = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            value
        }
    }
`;

export const FAVOURITE_GENRE = gql`
    query {
        me {
            favouriteGenre
        }
    }
`;

export const FAVOURITE_GENRE_BOOKS = gql`
    query favouriteGenreBooks($genre: String) {
        allBooks(genre: $genre) {
            title
            published
            genres
            Author {
                name
            }
        }
    }
`;

const BOOK_DETAILS = gql`
    fragment BookDetails on Book {
        title
        published
        Author {
            name
        }
        genres
    }
`;

export const BOOK_ADDED = gql`
    subscription {
        bookAdded {
            ...BookDetails
        }
    }
    ${BOOK_DETAILS}
`;

export const updateCache = (cache, query, addedBook) => {
    const uniqByName = (a) => {
        let seen = new Set();
        return a.filter((item) => {
            let k = item.title;
            return seen.has(k) ? false : seen.add(k);
        });
    };

    cache.updateQuery(query, ({ allBooks }) => {
        console.log(allBooks, addedBook);
        return {
            allBooks: uniqByName(allBooks.concat(addedBook)),
        };
    });
};
