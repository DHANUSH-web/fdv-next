import { NextRequest, NextResponse } from 'next/server';
import { parseJsonData, parseXmlData, parseExcelData, parseCsvData } from '@/utils/fileParser';

// This is needed for API routes in Next.js App Router
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Check if the request is a FormData request
    if (!req.headers.get('content-type')?.includes('multipart/form-data')) {
      return NextResponse.json(
        { parsedData: { error: true, message: 'Content type must be multipart/form-data' } },
        { status: 400 }
      );
    }

    // Parse the form data
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { parsedData: { error: true, message: 'No file uploaded' } },
        { status: 400 }
      );
    }

    const fileName = file.name;
    const fileExtension = fileName.split('.').pop()?.toLowerCase();

    if (!fileExtension || !['json', 'xml', 'xlsx', 'xls', 'csv'].includes(fileExtension)) {
      return NextResponse.json(
        { parsedData: { error: true, message: 'Unsupported file format. Please upload JSON, XML, CSV, or Excel files.' } },
        { status: 400 }
      );
    }

    // Parse the file based on its extension
    let parsedData;
    const arrayBuffer = await file.arrayBuffer();

    try {
      switch (fileExtension) {
        case 'json':
          const jsonText = new TextDecoder().decode(arrayBuffer);
          parsedData = parseJsonData(jsonText);
          break;
        
        case 'xml':
          const xmlText = new TextDecoder().decode(arrayBuffer);
          parsedData = parseXmlData(xmlText);
          break;
        
        case 'csv':
          const csvText = new TextDecoder().decode(arrayBuffer);
          parsedData = parseCsvData(csvText);
          break;
        
        case 'xlsx':
        case 'xls':
          parsedData = parseExcelData(arrayBuffer);
          break;
        
        default:
          return NextResponse.json({ 
            parsedData: { 
              error: true, 
              message: `Unsupported file type: ${fileExtension}` 
            } 
          });
      }
    } catch (error) {
      // Error handled by returning error response
      return NextResponse.json({ 
        parsedData: { 
          error: true, 
          message: `Error processing file: ${error instanceof Error ? error.message : 'Unknown error'}` 
        } 
      });
    }

    return NextResponse.json({ parsedData });
  } catch (error) {
    // Error handled by returning error response
    return NextResponse.json({ 
      parsedData: { 
        error: true, 
        message: `Error processing upload: ${error instanceof Error ? error.message : 'Unknown error'}` 
      } 
    }, { status: 500 });
  }
}