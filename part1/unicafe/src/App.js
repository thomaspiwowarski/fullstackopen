import { useState } from "react";

const Button = ({ handler, name }) => {
  return <button onClick={handler}>{name}</button>;
};

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

const Statistics = (props) => {
  const { good, neutral, bad, sum, average, positive } = props;
  return (
    <>
      <h2>statistics</h2>
      {sum ? (
        <table>
          <tbody>
            <StatisticLine text='good' value={good} />
            <StatisticLine text='neutral' value={neutral} />
            <StatisticLine text='bad' value={bad} />
            <StatisticLine text='all' value={sum} />
            <StatisticLine text='average' value={average} />
            <StatisticLine text='positive' value={positive} />
          </tbody>
        </table>
      ) : (
        <p>No feedback given</p>
      )}
    </>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const sum = good + neutral + bad;
  const average = (good - bad) / sum;
  const positive = good / sum;

  return (
    <div>
      <h2>give feedback</h2>
      <Button handler={() => setGood(good + 1)} name='good' />
      <Button handler={() => setNeutral(neutral + 1)} name='neutral' />
      <Button handler={() => setBad(bad + 1)} name='bad' />
      <Statistics {...{ good, neutral, bad, sum, average, positive }} />
    </div>
  );
};

export default App;
