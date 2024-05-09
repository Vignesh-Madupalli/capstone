import React, { useState } from 'react';
import axios from 'axios';
import { Bar, Line, Scatter, Pie } from 'react-chartjs-2';
import './Home2.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const FileUploadPage = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fid, setFid] = useState(0);
    const [columns, setColumns] = useState([]);
    const [xAxis, setXAxis] = useState('');
    const [yAxis, setYAxis] = useState('');
    const [aggregateFunction, setAggregateFunction] = useState('');
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [lineChartData, setLineChartData] = useState({ labels: [], datasets: [] });
    const [scatterChartData, setScatterChartData] = useState({ datasets: [] });
    const [pieChartData, setPieChartData] = useState({ labels: [], datasets: [] });

    const handleFileChange = event => {
        setSelectedFile(event.target.files[0]);
    };

    const handleGetData = () => {
        axios.get(`http://localhost:8000/accounts/get_data/?file_id=${fid}&x_axis=${xAxis}&y_axis=${yAxis}&function=${aggregateFunction}`)
        .then(response => {
            const apiData = response.data.data;
            updateChartData(apiData);
            updateLineChartData(apiData);
            updateScatterChartData(apiData);
            updatePieChartData(apiData);
        })
        .catch(error => console.error('Error fetching data:', error));
    };

    const updateChartData = (apiData) => {
        setChartData({
            labels: apiData.map(item => item[xAxis]),
            datasets: [{
                label: `${yAxis} by ${xAxis}`,
                data: apiData.map(item => item[yAxis]),
                backgroundColor: 'rgba(75, 192, 192, 0.5)'
            }]
        });
    };

    const updateLineChartData = (apiData) => {
        setLineChartData({
            labels: apiData.map(item => item[xAxis]),
            datasets: [{
                label: `${yAxis} over time`,
                data: apiData.map(item => item[yAxis]),
                borderColor: 'rgb(54, 162, 235)',
                fill: false
            }]
        });
    };

    const updateScatterChartData = (apiData) => {
        setScatterChartData({
            datasets: [{
                label: `${xAxis} vs ${yAxis}`,
                data: apiData.map(item => ({ x: item[xAxis], y: item[yAxis] })),
                backgroundColor: 'rgba(255, 99, 132, 0.5)'
            }]
        });
    };

    const updatePieChartData = (apiData) => {
        setPieChartData({
            labels: apiData.map(item => item[xAxis]),
            datasets: [{
                label: `${yAxis} distribution`,
                data: apiData.map(item => item[yAxis]),
                backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(255, 206, 86, 0.5)', 'rgba(75, 192, 192, 0.5)', 'rgba(153, 102, 255, 0.5)', 'rgba(255, 159, 64, 0.5)']
            }]
        });
    };

    const handleFormSubmit = async event => {
        event.preventDefault();
        if (!selectedFile) {
            alert('Please select a file before uploading.');
            return;
        }

        const formData = new FormData();
        formData.append('csvfile', selectedFile);
        const username = localStorage.getItem('username');
        formData.append('username', username);

        axios.post('http://localhost:8000/accounts/upload_csv/', formData)
        .then(response => {
            setColumns([...response.data.columns]);
            setFid(response.data.id);
        })
        .catch(e => console.log(e));
    };

    return (
        <>
            <div className="file-upload-container">
                <h2>Upload CSV/Excel File</h2>
                <div className="main-container">
                    <form onSubmit={handleFormSubmit} className="form-container">
                        <input type="file" accept=".csv, .xlsx" onChange={handleFileChange} />
                        <button type="submit">Upload</button>
                        <div>
                            <h3>Select Columns and Function</h3>
                            <select value={xAxis} onChange={e => setXAxis(e.target.value)}>
                                <option value="">Select X-axis</option>
                                {columns.map(col => (
                                    <option key={col} value={col}>{col}</option>
                                ))}
                            </select>
                            <select value={yAxis} onChange={e => setYAxis(e.target.value)}>
                                <option value="">Select Y-axis</option>
                                {columns.map(col => (
                                    <option key={col} value={col}>{col}</option>
                                ))}
                            </select>
                            <select value={aggregateFunction} onChange={e => setAggregateFunction(e.target.value)}>
                                <option value="">Select Function</option>
                                <option value="sum">Sum</option>
                                <option value="average">Average</option>
                                <option value="count">Count</option>
                                <option value="median">Median</option>
                            </select>
                            <button onClick={handleGetData}>Visualize</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="chart-row">
                <div className="chart-container">
                    <h3 style={{ textAlign: 'center', color: 'black' }}>Bar Chart</h3>
                    <Bar data={chartData} />
                </div>
                <div className="chart-container">
                    <h3 style={{ textAlign: 'center', color: 'black' }}>Line Chart</h3>
                    <Line data={lineChartData} />
                </div>
            </div>
            <div className="chart-row">
                <div className="chart-container">
                    <h3 style={{ textAlign: 'center', color: 'black' }}>Scatter Chart</h3>
                    <Scatter data={scatterChartData} />
                </div>
                <div className="chart-container">
                    <h3 style={{ textAlign: 'center', color: 'black' }}>Pie Chart</h3>
                    <Pie data={pieChartData} />
                </div>
            </div>
        </>
    );
};

export default FileUploadPage;
