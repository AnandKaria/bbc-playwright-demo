// BBC demo tests AK
// Data loading utility functions

import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export function loadCSVSync(relFilePath: string): any[] {
  try {
    const absolutePath = path.join(__dirname, '..', relFilePath);

    if (!fs.existsSync(absolutePath)) {
      throw new Error(`CSV file not found at path: ${absolutePath}`);
    }

    const fileContent = fs.readFileSync(absolutePath, 'utf-8');

    const test_dataset = parse(fileContent, {
      columns: true, // Return each row as an object with column headers as keys
      skip_empty_lines: true,
      trim: true,
    });

    if (test_dataset.length === 0) {
      throw new Error (`No data loaded or parsed from file at path: ${absolutePath}`)
    }

    return test_dataset;
  } catch (error) {
    console.error(`Error loading CSV file: ${error.message}`);
    throw error; // Rethrow for calling function to handle
  }
}