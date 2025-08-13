import { APP_CONFIG } from '@/lib/utils/constants';

export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateUploadedFile(file: File): FileValidationResult {
  const errors: string[] = [];

  // Check file size
  if (file.size > APP_CONFIG.MAX_FILE_SIZE) {
    errors.push(`File size exceeds ${APP_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB limit`);
  }

  // Check file type
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!APP_CONFIG.SUPPORTED_FILE_TYPES.includes(fileExtension)) {
    errors.push(`File type ${fileExtension} is not supported. Supported types: ${APP_CONFIG.SUPPORTED_FILE_TYPES.join(', ')}`);
  }

  // Check file name
  if (!file.name || file.name.length > 255) {
    errors.push('Invalid file name');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateUploadedData(data: any): FileValidationResult {
  const errors: string[] = [];

  // Check if data is array
  if (!Array.isArray(data)) {
    errors.push('Data must be an array');
    return { isValid: false, errors };
  }

  // Check if data is empty
  if (data.length === 0) {
    errors.push('File contains no data');
    return { isValid: false, errors };
  }

  // Check if data has consistent structure
  if (data.length > 0) {
    const firstRowKeys = Object.keys(data[0]);
    const hasConsistentStructure = data.every(row => 
      Object.keys(row).length === firstRowKeys.length &&
      firstRowKeys.every(key => key in row)
    );

    if (!hasConsistentStructure) {
      errors.push('Data has inconsistent structure across rows');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}