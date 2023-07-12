import express from "express";
import axios from "axios";
import cors from "cors";
import path from "path";

const app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, "client/build")));

app.get("/index.html", (req, res) => {
	res.sendFile(path.resolve(__dirname, "client/build", "index.html"));
});

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

app.get("*", (req, res) => {
	res.sendFile(path.resolve(__dirname, "client/build", "index.html"));
});

const PORT = process.env.PORT || 9898;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
