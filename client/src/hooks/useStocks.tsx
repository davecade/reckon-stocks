import { useEffect, useState, useRef } from "react";
import axios from "axios";

interface StockData {
	code: string;
	startingPrice: number;
	lowestPrice: number;
	highestPrice: number;
	currentPrice: number;
}

interface StockApiResponse {
	code: string;
	price: number;
}

const useStocks = (): [StockData[] | null, StockData[] | null] => {
	const [data, setData] = useState<StockData[] | null>(null);
	const [prevData, setPrevData] = useState<StockData[] | null>(null);

	// using useRef because I want to keep the reference to the previous data
	const dataRef = useRef<StockData[] | null>(null);
	dataRef.current = data;

	useEffect(() => {
		const fetchStockData = async () => {
			try {
				const response = await axios.get<StockApiResponse[]>("/api/stocks");
				if (dataRef.current === null) {
					const initialData = response.data.map((stock: StockApiResponse) => ({
						code: stock.code,
						startingPrice: stock.price,
						lowestPrice: stock.price,
						highestPrice: stock.price,
						currentPrice: stock.price,
					}));

					setData(initialData);
				} else {
					const updatedData = dataRef.current.map((stock) => {
						const newStock = response.data.find(
							(s: StockApiResponse) => s.code === stock.code
						);
						if (newStock) {
							return {
								...stock,
								lowestPrice: Math.min(stock.lowestPrice, newStock.price),
								highestPrice: Math.max(stock.highestPrice, newStock.price),
								currentPrice: newStock.price,
							};
						}
						return stock;
					});

					setPrevData(dataRef.current);
					setData(updatedData);
				}
			} catch (error) {
				console.error(error);
			}
		};
		fetchStockData();

		// fetch new data every 4 seconds
		const intervalId = setInterval(fetchStockData, 4000);
		return () => clearInterval(intervalId);
	}, []);

	return [data, prevData];
};

export default useStocks;
