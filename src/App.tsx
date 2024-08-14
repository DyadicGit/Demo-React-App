import React, { useState } from 'react';
import './App.css';

type TableData = string[][];
let errors: string[] = [];

const App: React.FC = () => {
  const [csvInput, setCsvInput] = useState<string>('');
  const [tableData, setTableData] = useState<TableData>([]);
  const [hasHeader, setHasHeader] = useState<boolean>(false);

  const parseCSV = (text: string): TableData => {
    const rows: TableData = [];
    const delimiters = [',', ';'];
    const stack = Array.from(text.trim());

    let cell = '';
    let row: string[] = [];
    let quoteCount = 0;

    while (stack.length) {
      const char = stack.shift() as string; /* while loop condition ensures truthy value */
      if (char === '"' && quoteCount === 2) {
        cell += char;
        quoteCount = 1;
      } else if (char === '"') {
        quoteCount++;
      } else if (char === '\n' && (quoteCount === 0 || quoteCount === 2)) {
        row.push(cell);
        rows.push(row);
        row = [];
        cell = '';
        quoteCount = 0;
      } else if (delimiters.includes(char) && (quoteCount === 0 || quoteCount === 2)) {
        row.push(cell);
        cell = '';
        quoteCount = 0;
      } else {
        cell += char;
      }

      if (stack.length === 0) {
        row.push(cell);
        rows.push(row);
      }
    }

    return rows;
  };
  const handleTextInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = event.target.value;
    setCsvInput(input);
    errors = [];
    const parsedCSV = parseCSV(input);
    setTableData(parsedCSV);
    console.log(parsedCSV);
    errors.length && console.warn(errors);
  };

  return (
    <main className="App">
      <h1>CSV Parser</h1>
      <label>
        <input type="checkbox" checked={hasHeader} onChange={() => setHasHeader(!hasHeader)} />
        Header Present
      </label>
      <br />
      <textarea value={csvInput} onChange={handleTextInput} placeholder="Enter CSV data here" rows={10} cols={50} />
      <br />
      <Table data={tableData} hasHeader={hasHeader} />
    </main>
  );
};

type TableProps = { data: TableData; hasHeader: boolean };
const Table: React.FC<TableProps> = ({ data, hasHeader }) => {
  if (!data.length) {
    return null;
  }
  return (
    <table border={1}>
      <thead>
        {hasHeader && (
          <tr>
            {data[0].map((cell, cellIndex) => (
              <th key={cellIndex}>{cell}</th>
            ))}
          </tr>
        )}
      </thead>
      <tbody>
        {data.slice(Number(hasHeader)).map((row, rowIndex) => (
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
