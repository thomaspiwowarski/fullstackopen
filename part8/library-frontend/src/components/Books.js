import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../graphql";

const Books = (props) => {
    const [uniqueGenres, setUniqueGenres] = useState([]);
    const [filter, setFilter] = useState("all");
    const books = useQuery(ALL_BOOKS);

    useEffect(() => {
        if (books.data) {
            setUniqueGenres([
                ...new Set(books.data.allBooks.flatMap((g) => g.genres)),
            ]);
        }
    }, [books]);

    if (!props.show) {
        return null;
    }
    if (books.loading) return <div>loading...</div>;

    const booksToShow =
        filter === "all"
            ? books.data.allBooks
            : books.data.allBooks.filter((book) =>
                  book.genres.includes(filter)
              );
    return (
        <div>
            <h2>books</h2>
            <p>in genre {filter}</p>
            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>author</th>
                        <th>published</th>
                    </tr>
                    {booksToShow.map((a) => (
                        <tr key={a.title}>
                            <td>{a.title}</td>
                            <td>{a.Author.name}</td>
                            <td>{a.published}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {uniqueGenres.map((genre) => (
                <button key={genre} onClick={() => setFilter(genre)}>
                    {genre}
                </button>
            ))}
            <button onClick={() => setFilter("all")}>all genres</button>
        </div>
    );
};

export default Books;
