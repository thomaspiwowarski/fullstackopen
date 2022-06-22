import { useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import { LOGIN } from "../graphql";

const LoginForm = ({ setError, setToken, setPage }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [login, result] = useMutation(LOGIN, {
        onError: (error) => {
            console.log(error);
            setError(error.graphQLErrors[0].message);
        },
    });

    useEffect(() => {
        if (result.data) {
            const token = result.data.login.value;
            setToken(token);
            localStorage.setItem("user-token", token);
        }
    }, [result.data]);

    const handleLogin = async (event) => {
        event.preventDefault();

        login({ variables: { username, password } });
        setPage("add");
    };

    return (
        <div>
            <form onSubmit={handleLogin}>
                <div>
                    username{" "}
                    <input
                        value={username}
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
                    password{" "}
                    <input
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button type='submit'>login</button>
            </form>
        </div>
    );
};

export default LoginForm;
