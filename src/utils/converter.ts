import fs from 'fs';

export function base64ToFile(base64Data: string, filePath: string): void {
  // Extract the data from the Base64 string
  const base64DataArray = base64Data.split(',');
  const base64String = base64DataArray.length > 1 ? base64DataArray[1] : base64Data;

  // Decode the Base64 string
  const buffer = Buffer.from(base64String, 'base64');

  // Write the file to disk
  fs.writeFile(filePath, buffer, (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log('File saved successfully:', filePath);
    }
  });
}

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};