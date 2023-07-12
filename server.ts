import express from "express";
import axios from "axios";
import cors from "cors";
import path from "path";

if (process.env.NODE_ENV !== "production") require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 9898;

//-- Middleware --//
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//-- Routes --//
app.get("/api/stocks", async (req, res) => {
	try {
		const apiUrl = "https://join.reckon.com/stock-pricing";

		const response = await axios.get(apiUrl);
		const data = response.data;

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

	app.get("*", function (req, res) {
		res.sendFile(path.join(__dirname, "client/build", "index.html"));
	});
}

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
