import { useState, useEffect } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/Login";
import Recommendations from "./components/Recommendations";
import { useApolloClient, useSubscription } from "@apollo/client";
import { BOOK_ADDED, updateCache, ALL_BOOKS } from "./graphql";

const App = () => {
    const [page, setPage] = useState("authors");
    const [token, setToken] = useState(null);
    const [error, setError] = useState(null);
    const client = useApolloClient();

    useEffect(() => {
        const token = localStorage.getItem("user-token");
        if (token) {
            setToken(token);
        }
    }, []);

    useSubscription(BOOK_ADDED, {
        onSubscriptionData: ({ subscriptionData, client }) => {
            console.log(subscriptionData);
            updateCache(
                client.cache,
                { query: ALL_BOOKS },
                subscriptionData.data.bookAdded
            );
            alert("NEW BOOK ADDED TO LIBRARY");
        },
    });

    const handleLogout = () => {
        setToken(null);
        localStorage.clear();
        client.resetStore();
    };

    if (error) {
        alert(error);
        return;
    }

    return (
        <div>
            <div>
                <button onClick={() => setPage("authors")}>authors</button>
                <button onClick={() => setPage("books")}>books</button>
                {!token ? (
                    <button onClick={() => setPage("login")}>login</button>
                ) : (
                    <>
                        <button onClick={() => setPage("add")}>add book</button>
                        <button onClick={() => setPage("recommendations")}>
                            recommendations
                        </button>
                        <button onClick={handleLogout}>logout</button>
                    </>
                )}
            </div>

            <Authors show={page === "authors"} />

            <Books show={page === "books"} />

            <NewBook show={page === "add"} />

            <Recommendations show={page === "recommendations"} />

            {!token ? (
                <LoginForm
                    show={page === "login"}
                    setError={setError}
                    setToken={setToken}
                    setPage={setPage}
                />
            ) : null}
        </div>
    );
};

export default App;
