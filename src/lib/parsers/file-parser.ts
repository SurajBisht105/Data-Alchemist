import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { parseWithAI } from '../ai/ai-parser';

export async function parseFile(file: File, useAI: boolean = true): Promise<any[]> {
  const fileType = file.name.toLowerCase().endsWith('.csv') ? 'csv' : 'xlsx';
  
  let rawData: any[];
  
  if (fileType === 'csv') {
    rawData = await parseCSV(file);
  } else {
    rawData = await parseExcel(file);
  }

  if (useAI) {
    const entityType = detectEntityType(file.name);
    if (entityType) {
      return await parseWithAI(rawData, entityType);
    }
  }

  return normalizeData(rawData);
}

async function parseCSV(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error)
    });
  });
}

async function parseExcel(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

function detectEntityType(filename: string): 'client' | 'worker' | 'task' | null {
  const lower = filename.toLowerCase();
  if (lower.includes('client')) return 'client';
  if (lower.includes('worker')) return 'worker';
  if (lower.includes('task')) return 'task';
  return null;
}

function normalizeData(data: any[]): any[] {
  return data.map(row => {
    const normalized: any = {};
    
    Object.entries(row).forEach(([key, value]) => {
      // Handle array fields
      if (typeof value === 'string' && value.includes(',')) {
        const arrayValue = value.split(',').map(v => v.trim());
        // Check if it's a numeric array
        if (arrayValue.every(v => !isNaN(Number(v)))) {
          normalized[key] = arrayValue.map(Number);
        } else {
          normalized[key] = arrayValue;
        }
      }
      // Handle JSON fields
      else if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
        try {
          normalized[key] = JSON.parse(value);
        } catch {
          normalized[key] = value;
        }
      }
      // Handle phase ranges (e.g., "1-3")
      else if (typeof value === 'string' && /^\d+-\d+$/.test(value)) {
        const [start, end] = value.split('-').map(Number);
        normalized[key] = Array.from({ length: end - start + 1 }, (_, i) => start + i);
      }
      // Handle boolean values
      else if (typeof value === 'string' && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
        normalized[key] = value.toLowerCase() === 'true';
      }
      // Keep other values as is
      else {
        normalized[key] = value;
      }
    });
    
    return normalized;
  });
}