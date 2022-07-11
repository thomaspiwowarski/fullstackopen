interface bmiArg {
    height: number;
    weight: number;
}

const parseBmiArguments = (args: Array<string>): bmiArg => {
    if (args.length < 4) throw new Error("Not enough arguments");
    if (args.length > 4) throw new Error("Too many arguments");
    if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
        return {
            height: Number(args[2]),
            weight: Number(args[3]),
        };
    } else {
        throw new Error("Provided values were not numbers!");
    }
};

export const bmiCalculator = (
    height: number,
    weight: number
): string | void => {
    const bmi: number = weight / (height / 100) ** 2;
    if (bmi >= 30.0) return "Obese";
    if (bmi >= 25.0) return "Overweight";
    if (bmi >= 18.5 && bmi <= 24.9) return "Normal (healthy weight)";
    if (bmi <= 18.4) return "Underweight";
};

try {
    const object: bmiArg = parseBmiArguments(process.argv);
    console.log(bmiCalculator(object.height, object.weight));
} catch (error: unknown) {
    let errorMessage = "Something bad happened.";
    if (error instanceof Error) {
        errorMessage += " Error: " + error.message;
    }
    console.log(errorMessage);
}
