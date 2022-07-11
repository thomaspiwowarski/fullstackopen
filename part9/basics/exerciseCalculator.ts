interface Result {
    periodLength: number;
    trainingDays: number;
    success: boolean;
    rating: number;
    ratingDescription: string;
    target: number;
    average: number;
}

interface Rating {
    rating: number;
    ratingDescription: string;
}

interface ParsedArgs {
    target: number;
    days: Array<number>;
}

const parseArguments = (args: Array<string>): ParsedArgs => {
    if (args.length < 4) throw new Error("Not enough arguments");
    args.shift();
    args.shift();
    const parsedArgs = args.map((arg) => Number(arg));
    if (parsedArgs.filter((arg) => isNaN(arg)).length)
        throw new Error("Provided values were not numbers");
    const [target, ...days] = parsedArgs;
    return {
        target,
        days,
    };
};

const getTrainingDays = (trainingHoursArray: Array<number>): number => {
    return trainingHoursArray.filter((day) => day !== 0).length;
};

const getAverage = (
    trainingHoursArray: Array<number>,
    periodLength: number
): number => {
    return (
        trainingHoursArray.reduce((prev, curr) => prev + curr) / periodLength
    );
};

const getRating = (avg: number, averageTarget: number): Rating => {
    if (avg > averageTarget)
        return { rating: 3, ratingDescription: "well done" };
    if (avg === averageTarget)
        return {
            rating: 2,
            ratingDescription: "not too bad but could be better",
        };
    return { rating: 1, ratingDescription: "you have to try harder" };
};

export const exerciseCalculator = (
    trainingHoursArray: Array<number>,
    averageTarget: number
): Result => {
    const trainingDays = getTrainingDays(trainingHoursArray);
    const avg = getAverage(trainingHoursArray, trainingDays);
    const rating = getRating(avg, averageTarget);

    return {
        periodLength: trainingHoursArray.length,
        trainingDays: trainingDays,
        success: avg >= averageTarget ? true : false,
        rating: rating.rating,
        ratingDescription: rating.ratingDescription,
        target: averageTarget,
        average: avg,
    };
};

try {
    const object: ParsedArgs = parseArguments(process.argv);
    console.log(exerciseCalculator(object.days, object.target));
} catch (error: unknown) {
    let errorMessage = "Something bad happened.";
    if (error instanceof Error) {
        errorMessage += " Error: " + error.message;
    }
    console.log(errorMessage);
}
