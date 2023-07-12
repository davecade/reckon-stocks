import React, { useEffect, useState } from "react";
import useStocks from "../hooks/useStocks";
import classes from "./summaryTable.module.scss";

const SummaryTable: React.FC = () => {
	const [data, prevData] = useStocks();
	const [highlight, setHighlight] = useState<{ [key: string]: boolean }>({});

	useEffect(() => {
		if (data && prevData) {
			const newHighlight: { [key: string]: boolean } = {};
			data.forEach((stock, i) => {
				const prevStock = prevData[i];
				if (prevStock) {
					newHighlight[`${stock.code}-lowest`] =
						prevStock.lowestPrice !== stock.lowestPrice;
					newHighlight[`${stock.code}-highest`] =
						prevStock.highestPrice !== stock.highestPrice;
					newHighlight[`${stock.code}-current`] =
						prevStock.currentPrice !== stock.currentPrice;
				}
			});

			// highlight the updated prices for 1 second
			setHighlight(newHighlight);

			const timeoutId = setTimeout(() => {
				setHighlight({});
			}, 1000);

			return () => {
				clearTimeout(timeoutId);
			};
		}
	}, [data, prevData]);

	return (
		<div className={classes.container}>
			<h2>Summary</h2>
			<table className={classes.summary_table}>
				<thead>
					<tr>
						<th>Stock</th>
						<th>Starting</th>
						<th>Lowest</th>
						<th>Highest</th>
						<th>Current</th>
					</tr>
				</thead>
				<tbody>
					{data ? (
						data.map((stock, i) => (
							<tr key={stock.code}>
								<td>{stock.code}</td>
								<td>{stock.startingPrice.toFixed(2)}</td>
								<td
									className={
										highlight[`${stock.code}-lowest`]
											? classes.price_updated
											: ""
									}
								>
									{stock.lowestPrice.toFixed(2)}
								</td>
								<td
									className={
										highlight[`${stock.code}-highest`]
											? classes.price_updated
											: ""
									}
								>
									{stock.highestPrice.toFixed(2)}
								</td>
								<td
									className={
										highlight[`${stock.code}-current`]
											? classes.price_updated
											: ""
									}
								>
									{stock.currentPrice.toFixed(2)}
								</td>
							</tr>
						))
					) : (
						<div className={classes.loading}>
							<p>...loading data</p>
						</div>
					)}
				</tbody>
			</table>
		</div>
	);
};

export default SummaryTable;
