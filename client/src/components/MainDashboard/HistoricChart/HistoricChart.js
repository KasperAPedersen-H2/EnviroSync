import React, { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "./HistoricChart.css";

ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale);

const HistoricChart = ({ deviceId, selectedDataType }) => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/user/data/${deviceId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!response.ok) {
                    console.error("Failed to fetch historic data");
                    return;
                }

                const data = await response.json();

                const limitedData = data.slice(-20);

                const labels = limitedData.map(d => new Date(d.createdAt).toLocaleString());
                const dataSets = {
                    temperature: limitedData.map(d => d.temperature),
                    humidity: limitedData.map(d => d.humidity),
                    pressure: limitedData.map(d => d.pressure),
                    tvoc: limitedData.map(d => d.tvoc),
                };

                const selectedData = dataSets[selectedDataType];

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: `${selectedDataType.charAt(0).toUpperCase() + selectedDataType.slice(1)} Data`,
                            data: selectedData,
                            borderColor: "rgba(75, 192, 192, 1)",
                            backgroundColor: "rgba(75, 192, 192, 0.2)",
                            fill: true,
                            tension: 0.4,
                        },
                    ],
                });
            } catch (error) {
                console.error("Error fetching historic data:", error);
            }
        };

        fetchData();
    }, [deviceId, selectedDataType]);

    if (!chartData) return <p>Loading chart...</p>;

    return (
        <div className="chart-container">
            <Line
                data={chartData}
                options={{
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: selectedDataType.charAt(0).toUpperCase() + selectedDataType.slice(1) + " Over Time",
                        },
                        legend: {
                            position: "top",
                        },
                    },
                    scales: {
                        x: {
                            type: "category",
                            title: {
                                display: true,
                                text: "Timestamp",
                            },
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: "Value",
                            },
                        },
                    },
                }}
            />
        </div>
    );
};

export default HistoricChart;