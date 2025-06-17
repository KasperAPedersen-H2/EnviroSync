import React, { useEffect, useState, useRef } from "react";
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
import { useDataLimit } from "../../../context/DataLimitContext";

ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, Filler);

const HistoricChart = ({ deviceId, selectedDataType }) => {
    const [chartData, setChartData] = useState(null);
    const { dataLimit } = useDataLimit();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const chartRef = useRef(null);

    const getYAxisLabel = (dataType) => {
        switch (dataType) {
            case 'temperature':
                return 'Temperature (°C)';
            case 'humidity':
                return 'Humidity (%)';
            case 'pressure':
                return 'CO₂ (ppm)';
            case 'tvoc':
                return 'TVOC (ppb)';
            default:
                return 'Value';
        }
    };

    // Track window size
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

                const labels = limitedData.map(d => {
                    const date = new Date(d.createdAt);
                    if (windowWidth <= 480) {
                        return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`; // hour:minute
                    } else if (windowWidth <= 768) {
                        return `${date.getMonth()+1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`; // month/day
                    } else {
                        return date.toLocaleString(); // month/day/year hour:minute
                    }
                });
                
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
                            pointRadius: windowWidth <= 480 ? 2 : 3,
                            borderWidth: windowWidth <= 480 ? 1.5 : 2,
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

    }, [deviceId, selectedDataType, dataLimit, windowWidth]);

    const getChartOptions = () => {
        const isMobile = windowWidth <= 768;
        const isSmallMobile = windowWidth <= 480;
        
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: selectedDataType.charAt(0).toUpperCase() + selectedDataType.slice(1) + " Over Time",
                    font: {
                        size: isSmallMobile ? 14 : (isMobile ? 16 : 18)
                    }
                },
                legend: {
                    display: !isSmallMobile,
                    position: "top",
                    labels: {
                        boxWidth: isMobile ? 10 : 40,
                        font: {
                            size: isMobile ? 10 : 12
                        }
                    }
                },
                tooltip: {
                    enabled: true,
                    titleFont: {
                        size: isSmallMobile ? 10 : 12
                    },
                    bodyFont: {
                        size: isSmallMobile ? 10 : 12
                    }
                }
            },
            scales: {
                x: {
                    type: "category",
                    ticks: {
                        maxRotation: isSmallMobile ? 90 : 45,
                        font: {
                            size: isSmallMobile ? 8 : (isMobile ? 10 : 12)
                        },
                        autoSkip: true,
                        maxTicksLimit: isSmallMobile ? 6 : (isMobile ? 8 : 12)
                    },
                    title: {
                        display: !isSmallMobile,
                        text: "Timestamp",
                        font: {
                            size: isMobile ? 10 : 12
                        }
                    },
                    grid: {
                        display: !isSmallMobile
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: isSmallMobile ? 8 : (isMobile ? 10 : 12)
                        }
                    },
                    title: {
                        display: true,
                        text: getYAxisLabel(selectedDataType),
                        font: {
                            size: isMobile ? 10 : 12
                        }
                    }
                },
            },
            animation: {
                duration: isSmallMobile ? 0 : 1000 // Disable animation on small devices for better performance
            }
        };
    };

    if (!chartData) return <div className="chart-container"><p className="no-device-selected">Select device to display charts</p></div>;

    return (
        <div className="chart-container">
            <Line
                ref={chartRef}
                data={chartData}
                options={getChartOptions()}
            />
        </div>
    );
};

export default HistoricChart;