import * as XLSX from 'xlsx';
import { XMLParser } from 'fast-xml-parser';

/**
 * Parse JSON data from a string
 */
export function parseJsonData(jsonString: string) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    // Error handled by returning error object
    // Return a simplified error object instead of throwing
    return { 
      error: true, 
      message: `Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`,
      originalData: jsonString.substring(0, 200) + (jsonString.length > 200 ? '...' : '')
    };
  }
}

/**
 * Parse XML data from a string
 */
export function parseXmlData(xmlString: string) {
  try {
    // Check if the string looks like XML
    if (!xmlString.trim().startsWith('<?xml') && !xmlString.trim().startsWith('<')) {
      return { 
        error: true, 
        message: 'Invalid XML format: File does not appear to be valid XML',
        originalData: xmlString.substring(0, 200) + (xmlString.length > 200 ? '...' : '')
      };
    }
    
    // Clean the XML string to handle potential issues
    const cleanXml = xmlString.trim();
    
    // Configure the parser with options for better handling
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      allowBooleanAttributes: true,
      parseAttributeValue: true,
      trimValues: true,
      parseTagValue: true,
      isArray: (name, jpath, isLeafNode, isAttribute) => {
        // Make certain elements always arrays for consistency
        if (name === 'facility' || name === 'establishment') return true;
        return false;
      }
    });
    
    // Parse the XML
    const result = parser.parse(cleanXml);
    
    return result;
  } catch (error) {
    // Error handled by returning error object
    // Return a simplified error object instead of throwing
    return { 
      error: true, 
      message: `Failed to parse XML: ${error instanceof Error ? error.message : 'Unknown error'}`,
      originalData: xmlString.substring(0, 200) + (xmlString.length > 200 ? '...' : '')
    };
  }
}

/**
 * Parse Excel data from an ArrayBuffer
 */
export function parseExcelData(buffer: ArrayBuffer) {
  try {
    const data = new Uint8Array(buffer);
    const workbook = XLSX.read(data, { type: 'array' });
    
    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    return XLSX.utils.sheet_to_json(worksheet);
  } catch (error) {
    // Error handled by returning error object
    // Return a simplified error object instead of throwing
    return { 
      error: true, 
      message: `Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Parse CSV data from a string
 */
export function parseCsvData(csvString: string) {
  try {
    // Check if the string is empty
    if (!csvString.trim()) {
      return { 
        error: true, 
        message: 'Empty CSV file',
        originalData: csvString
      };
    }
    
    // Split the CSV into lines
    const lines = csvString.split(/\r?\n/).filter(line => line.trim());
    
    if (lines.length === 0) {
      return { 
        error: true, 
        message: 'No data found in CSV file',
        originalData: csvString
      };
    }
    
    // Get the headers from the first line
    const headers = lines[0].split(',').map(header => header.trim().replace(/^["'](.*)["']$/, '$1'));
    
    // Parse the data rows
    const data: Record<string, string>[] = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Handle quoted values with commas inside them
      const values: string[] = [];
      let inQuote = false;
      let currentValue = '';
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        
        if (char === '"' && (j === 0 || line[j-1] !== '\\')) {
          inQuote = !inQuote;
        } else if (char === ',' && !inQuote) {
          values.push(currentValue.trim().replace(/^["'](.*)["']$/, '$1'));
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      
      // Add the last value
      values.push(currentValue.trim().replace(/^["'](.*)["']$/, '$1'));
      
      // Create an object from the values and headers
      const rowObject: Record<string, string> = {};
      headers.forEach((header, index) => {
        rowObject[header] = values[index] !== undefined ? values[index] : '';
      });
      
      data.push(rowObject);
    }
    
    return data;
  } catch (error) {
    // Error handled by returning error object
    return { 
      error: true, 
      message: `Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`,
      originalData: csvString.substring(0, 200) + (csvString.length > 200 ? '...' : '')
    };
  }
}

/**
 * Determine file type from file name
 */
export function getFileType(fileName: string): 'json' | 'xml' | 'excel' | 'csv' | 'unknown' {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  if (!extension) return 'unknown';
  
  if (extension === 'json') return 'json';
  if (extension === 'xml') return 'xml';
  if (extension === 'xlsx' || extension === 'xls') return 'excel';
  if (extension === 'csv') return 'csv';
  
  return 'unknown';
}