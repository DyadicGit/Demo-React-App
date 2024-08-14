import React, { useState } from 'react';
import './App.css';

type TableData = string[][];
let errors: string[] = [];

const App: React.FC = () => {
  const [csvInput, setCsvInput] = useState<string>('');
  const [tableData, setTableData] = useState<TableData>([]);

  const parseCSV = (text: string): TableData => {
    const rows: TableData = [];
    const lines = text.split('\n');
    const delimiters = [',', ';'];

    lines.forEach((line, lineIdx) => {
      const cells: string[] = [];
      let insideQuotes = false;
      let currentCell = '';
      let quoteCount = 0;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"' && insideQuotes && line[i + 1] === '"') {
          quoteCount++;
          currentCell += '"'; // Add escaped quote
          i++; // Skip the next quote
        } else if (char === '"') {
          quoteCount++;
          insideQuotes = !insideQuotes;
        } else if (delimiters.includes(char) && !insideQuotes) {
          cells.push(currentCell);
          currentCell = '';
        } else {
          currentCell += char;
        }
      }

      cells.push(currentCell);
      rows.push(cells);
      if (quoteCount > 0 && quoteCount / 2 !== cells.length) {
        quoteCount = 0;
        errors.push(`no quote match in line ${lineIdx}`);
      }
    });

    return rows;
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = event.target.value;
    setCsvInput(input);
    errors = [];
    const parsedData = parseCSV(input);
    setTableData(parsedData);
    console.log(parsedData);
    errors.length && console.warn(errors);
  };

  return (
    <div className="App">
      <h1>CSV Parser</h1>
      <textarea value={csvInput} onChange={handleChange} placeholder="Enter CSV data here" rows={10} cols={50} />
      <Table data={tableData} />
    </div>
  );
};

const Table: React.FC<{ data: TableData }> = ({ data }) => {
  return (
    <table border={1}>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default App;
