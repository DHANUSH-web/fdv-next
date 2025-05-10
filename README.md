# Commercial Establishments Data Viewer

A Next.js web application that allows users to upload and view data files related to commercial establishments, such as those available on the Saudi Open Data Portal.

## Features

- **File Upload**: Upload JSON, XML, CSV, or Excel files containing commercial establishment data
- **Data Parsing**: Automatically parse and display the contents of uploaded files
- **User-Friendly Interface**: View parsed data in a structured, easy-to-read format

## Supported File Formats

- **JSON**: Displays data in a collapsible tree view
- **XML**: Parses XML into JSON and displays in a tree view
- **CSV**: Parses comma-separated values and displays in a tabular format
- **Excel (.xlsx, .xls)**: Displays data in a tabular format

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/commercial-est.git
   cd commercial-est
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Click on "Click to upload" or drag and drop a file into the upload area
2. Select a JSON, XML, or Excel file containing commercial establishment data
3. Click "Process File" to upload and parse the file
4. View the parsed data in the data preview section

## Sample Data

Sample data files are included in the `public` directory:
- `sample-data.json`: Example JSON data
- `sample-data.xml`: Example XML data
- `sample-data.csv`: Example CSV data

## Technologies Used

- **Next.js**: React framework for server-rendered applications
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **xlsx**: Library for parsing Excel files
- **xml2js**: Library for parsing XML files

## License

This project is licensed under the MIT License - see the LICENSE file for details.