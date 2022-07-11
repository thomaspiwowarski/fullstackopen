interface CoursePartBase {
    name: string;
    exerciseCount: number;
    type: string;
}

interface CourseSpecialPart {
    name: "Backend development";
    exerciseCount: 21;
    description: "Typing the backend";
    requirements: ["nodejs", "jest"];
    type: "special";
}

interface CourseNormalAndSubmission extends CoursePartBase {
    description: string;
}

interface CourseNormalPart extends CourseNormalAndSubmission {
    type: "normal";
}
interface CourseProjectPart extends CoursePartBase {
    type: "groupProject";
    groupProjectCount: number;
}

interface CourseSubmissionPart extends CourseNormalAndSubmission {
    type: "submission";
    exerciseSubmissionLink: string;
}

type CoursePart =
    | CourseNormalPart
    | CourseProjectPart
    | CourseSubmissionPart
    | CourseSpecialPart;

const Header = ({ courseName }: { courseName: string }) => (
    <>
        <h1>{courseName}</h1>
    </>
);

const Part = ({ part }: { part: CoursePart }) => {
    const assertNever = (value: never): never => {
        throw new Error(`Unhandled discriminated union member ${value}`);
    };

    const propperAttributes = () => {
        switch (part.type) {
            case "normal":
                return (
                    <div>
                        <h3>
                            {part.name} {part.exerciseCount}
                        </h3>
                        <i>{part.description}</i>
                    </div>
                );
                break;
            case "groupProject":
                return (
                    <div>
                        <h3>
                            {part.name} {part.exerciseCount}
                        </h3>
                        <i>project exercise {part.groupProjectCount}</i>
                    </div>
                );
                break;
            case "submission":
                return (
                    <div>
                        <h3>
                            {part.name} {part.exerciseCount}
                        </h3>
                        <i>{part.description}</i>
                        <p>submit to {part.exerciseSubmissionLink}</p>
                    </div>
                );
                break;
            case "special":
                return (
                    <div>
                        <h3>
                            {part.name} {part.exerciseCount}
                        </h3>
                        <i>{part.description}</i>
                        <p>required skills {part.requirements.join(", ")}</p>
                    </div>
                );
                break;
            default:
                return assertNever(part);
        }
    };

    return <>{propperAttributes()}</>;
};

const Content = ({ courseParts }: { courseParts: CoursePart[] }) => {
    return (
        <div>
            {courseParts.map((part: CoursePart) => (
                <Part key={part.name} part={part} />
            ))}
        </div>
    );
};

const Total = ({ courseParts }: { courseParts: Array<CoursePart> }) => (
    <p>
        Number of exercises{" "}
        {courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
    </p>
);

const App = () => {
    const courseName = "Half Stack application development";
    const courseParts: CoursePart[] = [
        {
            name: "Fundamentals",
            exerciseCount: 10,
            description: "This is the leisured course part",
            type: "normal",
        },
        {
            name: "Advanced",
            exerciseCount: 7,
            description: "This is the harded course part",
            type: "normal",
        },
        {
            name: "Using props to pass data",
            exerciseCount: 7,
            groupProjectCount: 3,
            type: "groupProject",
        },
        {
            name: "Deeper type usage",
            exerciseCount: 14,
            description: "Confusing description",
            exerciseSubmissionLink:
                "https://fake-exercise-submit.made-up-url.dev",
            type: "submission",
        },
        {
            name: "Backend development",
            exerciseCount: 21,
            description: "Typing the backend",
            requirements: ["nodejs", "jest"],
            type: "special",
        },
    ];

    return (
        <div>
            <Header courseName={courseName} />
            <Content courseParts={courseParts} />
            <Total courseParts={courseParts} />
        </div>
    );
};

export default App;
