import React, { useEffect, useState } from "react";
import socketService from "../../../services/socketService";
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale,
    Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "./HistoricChart.css";
import { useDataLimit } from "../../../context/DataLimitContext"; // Import context


ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, Filler);

const HistoricChart = ({ deviceId, selectedDataType }) => {
    const [chartData, setChartData] = useState(null);
    const { dataLimit } = useDataLimit(); // Hent context


    const getYAxisLabel = (dataType) => {
        switch (dataType) {
            case 'temperature':
                return 'Celsius (°C)';
            case 'humidity':
                return 'Humidity (%)';
            case 'pressure':
                return 'Pressure (hPa)';
            case 'tvoc':
                return 'TVOC (ppb)';
            default:
                return 'Value';
        }
    };

    useEffect(() => {
        socketService.connect();

        socketService.on("new-data", () => {
            console.log("new data on historic chart");
            fetchData();
        })

        const fetchData = async () => {
            try {
                if(deviceId === null || deviceId === "") {
                    return;
                }

                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/data/${deviceId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!response.ok) {
                    console.error("Failed to fetch historic data");
                    return;
                }

                const data = await response.json();

                const limitedData = data.slice(-dataLimit);

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

        if(deviceId) {
            fetchData();
        }

        return () => {
            socketService.disconnect();
        };

    }, [deviceId, selectedDataType, dataLimit]);

    if (!chartData) return <div className="chart-container"><p className="no-device-selected">Select device to display charts</p></div>;

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
                                text: getYAxisLabel(selectedDataType),
                            },
                        },
                    },
                }}
            />
        </div>
    );
};

export default HistoricChart;