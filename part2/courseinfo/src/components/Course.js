const Header = ({ courseName }) => {
  return <h1>{courseName}</h1>;
};

const Part = ({ part, exercises }) => {
  return (
    <p>
      {part} {exercises}
    </p>
  );
};

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map((part) => {
        return (
          <Part key={part.id} part={part.name} exercises={part.exercises} />
        );
      })}
    </div>
  );
};

const Total = ({ parts }) => {
  const sum = parts.reduce((s, p) => {
    return s + p.exercises;
  }, parts[0].exercises);

  return <p>Number of exercises {sum}</p>;
};

const Course = ({ courses }) => {
  return (
    <>
      <div>
        <Header courseName={courses.name} />
        <Content parts={courses.parts} />
        <Total parts={courses.parts} />
      </div>
    </>
  );
};

export default Course;
