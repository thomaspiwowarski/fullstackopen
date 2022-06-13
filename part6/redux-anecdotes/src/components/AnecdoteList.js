import { connect } from "react-redux";
import { voteAnecdote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const Anecdote = ({ anecdote, handleVote }) => (
  <div key={anecdote.id}>
    <div>{anecdote.content}</div>
    <div>
      has {anecdote.votes}
      <button onClick={handleVote}>vote</button>
    </div>
  </div>
);
const AnecdoteList = (props) => {
  const vote = (id, content, votes) => {
    props.voteAnecdote(id, content, votes);
    props.setNotification(`you voted '${content}'`, 5);
  };

  return (
    <>
      {props.anecdotes.map((anecdote) => (
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleVote={() => vote(anecdote.id, anecdote.content, anecdote.votes)}
        />
      ))}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    anecdotes: [...state.anecdotes]
      .filter((anecdote) =>
        anecdote.content.toLowerCase().includes(state.filter.toLowerCase())
      )
      .sort((a, b) => b.votes - a.votes),
  };
};

const mapDispatchToProps = {
  voteAnecdote,
  setNotification,
};

const ConnectedAnecdoteList = connect(
  mapStateToProps,
  mapDispatchToProps
)(AnecdoteList);
export default ConnectedAnecdoteList;
