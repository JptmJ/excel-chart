import React, { useState } from "react";
import * as XLSX from "xlsx";

function ExcelFileUpload() {
  const [data, setData] = useState([]);
  const [uploadError, setUploadError] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const fileData = e.target.result;
          const workbook = XLSX.read(fileData, { type: "binary" });
          const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
          const sheet = workbook.Sheets[sheetName];
          const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          setData(parsedData);
          setUploadError(null);
        } catch (error) {
          setUploadError(
            "Error parsing Excel file. Please make sure the file is in the correct format."
          );
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  return (
    <div>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      {uploadError && <p style={{ color: "red" }}>{uploadError}</p>}
      {data.length > 0 && (
        <table>
          <thead>
            <tr>
              {data[0].map((cell, index) => (
                <th key={index}>{cell}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ExcelFileUpload;
