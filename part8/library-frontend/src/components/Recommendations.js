import { useEffect, useState } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import { FAVOURITE_GENRE_BOOKS, FAVOURITE_GENRE } from "../graphql";

const Recommendations = (props) => {
    const [matchingBooks, setMatchingBooks] = useState([]);
    const favouriteGenre = useQuery(FAVOURITE_GENRE);
    const [getFavGenreBooks, favGenreBooks] = useLazyQuery(
        FAVOURITE_GENRE_BOOKS
    );

    useEffect(() => {
        if (!favouriteGenre.loading) {
            getFavGenreBooks({
                variables: { genre: favouriteGenre.data?.me?.favouriteGenre },
            });
            localStorage.removeItem("user-fav-genre");
            localStorage.setItem(
                "user-fav-genre",
                favouriteGenre.data?.me?.favouriteGenre
            );
        }
    }, [favouriteGenre]);

    useEffect(() => {
        if (favGenreBooks.data) {
            setMatchingBooks(favGenreBooks.data.allBooks);
        }
    }, [favGenreBooks]);

    if (!props.show) {
        return null;
    }
    if (favouriteGenre.loading) return <div>loading...</div>;
    return (
        <div>
            <h2>books</h2>
            <p>
                books in your favourite genre{" "}
                {favouriteGenre.data?.me?.favouriteGenre}
            </p>
            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>author</th>
                        <th>published</th>
                    </tr>
                    {matchingBooks.map((a) => (
                        <tr key={a.title}>
                            <td>{a.title}</td>
                            <td>{a.Author.name}</td>
                            <td>{a.published}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Recommendations;
