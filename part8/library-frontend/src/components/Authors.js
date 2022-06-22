import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { ALL_AUTHORS, SET_BORN } from "../graphql";
import Select from "react-select";

const Authors = (props) => {
    const [name, setName] = useState(null);
    const [year, setYear] = useState(null);
    const authors = useQuery(ALL_AUTHORS);
    const [setBornTo] = useMutation(SET_BORN, {
        refetchQueries: [{ query: ALL_AUTHORS }],
    });

    if (!props.show) {
        return null;
    }

    if (authors.loading) {
        return <div>loading...</div>;
    }

    const handleEdit = (e) => {
        e.preventDefault();
        setBornTo({ variables: { name: name.value, year } });

        setName("");
        setYear("");
    };

    const options = authors.data?.allAuthors.map((a) => ({
        value: a.name,
        label: a.name,
    }));

    return (
        <div>
            <h2>authors</h2>
            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>born</th>
                        <th>books</th>
                    </tr>
                    {authors.data?.allAuthors.map((a) => (
                        <tr key={a.name}>
                            <td>{a.name}</td>
                            <td>{a.born}</td>
                            <td>{a.bookCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <form onSubmit={handleEdit}>
                <Select value={name} onChange={setName} options={options} />
                <input
                    type='text'
                    onChange={({ target }) => setYear(Number(target.value))}
                />
                <button>edit born</button>
            </form>
        </div>
    );
};

export default Authors;
