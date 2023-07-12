import express, { Request, Response } from "express";
import axios from "axios";
import cors from "cors";
import path from "path";
import { config as dotenvConfig } from "dotenv";
import { AxiosResponse } from "axios";

interface Stock {
	code: string;
	price: number;
}

if (process.env.NODE_ENV !== "production") dotenvConfig();

const app = express();
const PORT: number = Number(process.env.PORT) || 9898;

//-- Middleware --//
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//-- Routes --//
app.get("/api/stocks", async (req: Request, res: Response) => {
	try {
		const apiUrl = "https://join.reckon.com/stock-pricing";

		const response: AxiosResponse<Stock[]> = await axios.get(apiUrl);

		const data: Stock[] = response.data;

		res.json(data);
	} catch (error) {
		console.error(`Error: ${error}`);
		res.status(500).json({
			error: "An error occurred while trying to fetch data from the API",
		});
	}
});

//-- Production Route--//
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "client/build")));

	app.get("*", function (req: Request, res: Response) {
		res.sendFile(path.join(__dirname, "client/build", "index.html"));
	});
}

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
