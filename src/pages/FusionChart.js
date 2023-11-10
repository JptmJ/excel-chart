import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  BarChart,
  ResponsiveContainer,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Label,
} from "recharts";
import "../assets/FusionChart.css";

function FusionChart() {
  // State variables
  const [data, setData] = useState([]);
  const [selectedDeveloper, setSelectedDeveloper] = useState("All");
  const [selectedTask, setSelectedTask] = useState("All");
  const [developers, setDevelopers] = useState([]);
  const [tasks, setTasks] = useState([]);

  // Effect to update developers and tasks when data changes
  useEffect(() => {
    // Extract unique developers and tasks from the data
    const uniqueDevelopers = [...new Set(data.map((entry) => entry.Developer))];
    const uniqueTasks = [...new Set(data.map((entry) => entry.Task))];

    // Add "All" as an option
    setDevelopers(["All", ...uniqueDevelopers]);
    setTasks(["All", ...uniqueTasks]);
  }, [data]);

  // Function to handle file upload and parse Excel data
  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const fileData = e.target.result;
          const workbook = XLSX.read(fileData, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const parsedData = XLSX.utils.sheet_to_json(sheet);
          setData(parsedData);
        } catch (error) {
          console.error("Error parsing Excel file:", error);
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  // Filtered data based on selected developer and task
  const filteredData = data.filter(
    (entry) =>
      (selectedDeveloper === "All" || entry.Developer === selectedDeveloper) &&
      (selectedTask === "All" || entry.Task === selectedTask)
  );

  // Custom Tooltip component for displaying additional information on hover         
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const sprintValue = payload[0].payload.Sprint;
      const developerValue = payload[0].payload.Developer;

      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`Sprint: ${sprintValue}`}</p>
          <p className="tooltip-label">{`Developer: ${developerValue}`}</p>
          <p className="tooltip-label">{`Task: ${payload[0].payload.Task}`}</p>
          <hr className="tooltip-separator" />
          <p className="tooltip-label">{`Estimated: ${payload[0].value}`}</p>
          <p className="tooltip-label">{`Actual: ${payload[1].value}`}</p>
        </div>
      );
    }

    return null;
  };

  // JSX for rendering the FusionChart component
  return (
    <div className="fusion-chart-container">
      {/* Filter options */}
      <div className="filters">
        <label>Developer:</label>
        <select
          value={selectedDeveloper}
          onChange={(e) => setSelectedDeveloper(e.target.value)}
        >
          {developers.map((developer) => (
            <option key={developer} value={developer}>
              {developer}
            </option>
          ))}
        </select>

        <label>Task:</label>
        <select
          value={selectedTask}
          onChange={(e) => setSelectedTask(e.target.value)}
        >
          {tasks.map((task) => (
            <option key={task} value={task}>
              {task}
            </option>
          ))}
        </select>
      </div>

      {/* File upload input */}
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

      {/* Render chart if there is filtered data */}
      {filteredData.length > 0 && (
        <ResponsiveContainer width="100%" height={400}>
          {/* Bar chart */}
          <BarChart
            data={filteredData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            {/* X-axis with label */}
            <XAxis dataKey="Task">
              <Label
                value="Task"
                position="insideBottom"
                offset={-10}
                className="chart-heading"
              />
            </XAxis>

            {/* Y-axis with label */}
            <YAxis>
              <Label
                value="Hours"
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: "middle" }}
                className="chart-heading"
              />
            </YAxis>

            {/* Tooltip */}
            <Tooltip content={<CustomTooltip />} />

            {/* Bars for Estimated and Actual data */}
            <Bar dataKey="Estimated" fill="#69c0ff" />
            <Bar dataKey="Actual" fill="#85a5ff" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default FusionChart;
