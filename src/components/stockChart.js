// src/components/StockChart.js
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale, // x-axis
    LinearScale,   // y-axis
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import Slider from 'react-slider'; // Range slider import

// Register required Chart.js components
ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend,
    annotationPlugin
);

const StockChart = ({ stocks }) => {
    const [chartData, setChartData] = useState({});
    const [allDates, setAllDates] = useState([]); // Store all dates
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState([42, 100]); // Initialize range (start and end percentages)
    
    const [filteredDates, setFilteredDates] = useState([]);
    const [filteredDataSets, setFilteredDataSets] = useState([]);

    // Handle the slider range change
    const handleSliderChange = (newRange) => {
        setDateRange(newRange);
    };

    // Fetch stock data and store dates and closing prices
    useEffect(() => {
        const fetchData = async () => {
            try {
                const closingPricesDataSet = [];
                let dates = [];

                for (const [stockName, stockData] of Object.entries(stocks)) {
                    const response = await fetch(`/${stockName}.json`);

                    if (!response.ok) {
                        throw new Error(`Error fetching ${stockName}.json: ${response.statusText}`);
                    }

                    const data = await response.json();

                    // Fetch the dates from the first dataset
                    if (dates.length === 0) {
                        dates = Object.keys(data).reverse(); // Reverse for chronological order
                        setAllDates(dates); // Store all dates initially
                    }

                    closingPricesDataSet.push({
                        label: `${stockName} Closing Price`,  // Fixed label format
                        data: dates.map(date => data[date]["4. close"]),
                        borderColor: stockData['colour'],
                        fill: false,
                        tension: 0.1, // For a slightly curved line
                    });
                }

                setFilteredDates(dates); // Initialize filtered dates with full data
                setFilteredDataSets(closingPricesDataSet); // Store datasets for filtering
                setChartData({
                    labels: dates,
                    datasets: closingPricesDataSet,
                });
                setLoading(false);
            } catch (error) {
                console.error('Error loading JSON:', error);
            }
        };

        fetchData();
    }, [stocks]);

    // Update chart data when the range slider changes
    useEffect(() => {
        const [start, end] = dateRange;
        const startIndex = Math.floor((start / 100) * allDates.length);
        const endIndex = Math.floor((end / 100) * allDates.length);

        // Filter dates and datasets within the slider range
        const newFilteredDates = allDates.slice(startIndex, endIndex + 1);
        const newFilteredDataSets = filteredDataSets.map(dataset => ({
            ...dataset,
            data: dataset.data.slice(startIndex, endIndex + 1)
        }));

        setChartData({
            labels: newFilteredDates,
            datasets: newFilteredDataSets,
        });
    }, [dateRange, allDates, filteredDataSets]);

    // Chart options
    const options = {
        plugins: {
            annotation: {
                annotations: {
                    line1: {
                        type: 'line',
                        xMin: '2024-08-26',
                        xMax: '2024-08-26',
                        borderColor: 'red',
                        borderWidth: 2,
                        label: {
                            content: 'August',
                            enabled: true,
                            position: 'top',
                        },
                    },
                },
            },
        },
    };

    return (
        <div>
            {loading ? (
                <p>Loading chart...</p>
            ) : (
                <>
                    <Line data={chartData} options={options} />
                    {/* Date Range Slider */}
                    <div style={{ marginTop: '20px' }}>
                        <Slider
                            value={dateRange}
                            onChange={handleSliderChange}
                            min={0}
                            max={100}
                            step={1}
                            renderTrack={(props, state) => (
                                <div {...props} style={{ ...props.style, height: '6px', background: '#ddd' }}>
                                    {state.valueNow}
                                </div>
                            )}
                            renderThumb={(props, state) => (
                                <div {...props} style={{ ...props.style, height: '20px', width: '20px', background: '#999' }}>
                                    {state.valueNow}%
                                </div>
                            )}
                        />
                        {/* <div>
                            <p>Start Date: {filteredDates[0]}</p>
                            <p>End Date: {filteredDates[filteredDates.length - 1]}</p>
                        </div> */}
                    </div>
                </>
            )}
        </div>
    );
};

export default StockChart;
