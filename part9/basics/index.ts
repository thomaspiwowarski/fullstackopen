import express from "express";
import { bmiCalculator } from "./bmiCalculator";
import { exerciseCalculator } from "./exerciseCalculator";
const app = express();

app.use(express.json());

app.get("/hello", (_req, res) => {
    res.send("Hello Full Stack");
});

app.get("/bmi", (req, res) => {
    const height = Number(req.query.height);
    const weight = Number(req.query.weight);
    if (isNaN(height) && isNaN(weight)) {
        res.json({ error: "malformatted paramaters" }).status(400);
    } else {
        const bmi = bmiCalculator(height, weight);
        res.json({
            weight,
            height,
            bmi,
        });
    }
});

app.post("/exercises", (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { daily_exercises, target } = req.body;

    if (target === undefined || !daily_exercises)
        return res.json({ error: "parameters missing" });

    if (
        !Array.isArray(daily_exercises) ||
        !daily_exercises.length ||
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        isNaN(target)
    )
        return res.json({ error: "malforamtted parameters" });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const parsedArgs: Array<number> = daily_exercises.map(Number);

    if (parsedArgs.filter(isNaN).length)
        return res.json({ error: "malformatted parameters" });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return res.json(exerciseCalculator(parsedArgs, target));
});

const PORT = 3003;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
