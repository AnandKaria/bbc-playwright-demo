// BBC demo tests AK
// Data loading utility functions

import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export function loadCSVSync(relFilePath: string): any[] {
  // Loads data from a CSV file into an array of objects
  // Assumes that the file path is in this test project folder somewhere
  // No type checking for the objects returned - BE CAREFUL
  // Parameters:
  // - relFilePath: the relative file path of the CSV file as navigated from the test project folder

  try {
    // Make absolute path
    const absolutePath = path.join(__dirname, '..', relFilePath);

    // Check file exists
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`CSV file not found at path: ${absolutePath}`);
    }

    // Load file
    const fileContent = fs.readFileSync(absolutePath, 'utf-8');

    // Parse file into an object array
    const test_dataset = parse(fileContent, {
      columns: true, // Return each row as an object with column headers as keys
      skip_empty_lines: true,
      trim: true,
    });

    // Throw exception if read succeeded but had no data
    if (test_dataset.length === 0) {
      throw new Error (`No data loaded or parsed from file at path: ${absolutePath}`)
    }
    // TODO - do I want this? If I include this, I have to skip tests in other ways

    return test_dataset;
  } catch (error) {
    console.error(`Error loading CSV file: ${error.message}`);
    throw error; // Rethrow for calling function to handle
  }
}