/**
 * Tiện ích xuất nhập dữ liệu chuẩn Enterprise cho bảng dữ liệu (CSV, Excel Template, JSON)
 */

export function exportToCSV<T extends Record<string, any>>(data: T[], filename = 'export.csv') {
  if (!data || data.length === 0) return;

  const actualFilename = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  const headers = Object.keys(data[0]);
  const rows = data.map((item) =>
    headers
      .map((header) => {
        let val = item[header];
        if (typeof val === 'object' && val !== null) {
          val = JSON.stringify(val);
        }
        return `"${String(val ?? '').replace(/"/g, '""')}"`;
      })
      .join(',')
  );

  // UTF-8 BOM for Excel compatibility with Vietnamese characters
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', actualFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToJSON<T>(data: T, filename = 'export.json') {
  const actualFilename = filename.endsWith('.json') ? filename : `${filename}.json`;
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
  const link = document.createElement('a');
  link.setAttribute('href', jsonString);
  link.setAttribute('download', actualFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Tải tệp Excel mẫu chuẩn kèm hàng dữ liệu mẫu để hướng dẫn người dùng
 */
export function downloadExcelTemplate(
  columns: { key: string; label: string; sample?: string }[],
  filename = 'uniflow_template.csv'
) {
  const actualFilename = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  const headers = columns.map((c) => c.label || c.key);
  const keys = columns.map((c) => c.key);
  const sampleRow = columns.map((c) => c.sample || `Sample_${c.key}`);

  const csvContent = '\uFEFF' + [headers.join(','), keys.join(','), sampleRow.join(',')].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', actualFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Phân tích tệp CSV / JSON tải lên từ phía Client
 */
export async function parseImportFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        if (!text) {
          return resolve([]);
        }

        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          return resolve(Array.isArray(parsed) ? parsed : [parsed]);
        }

        // CSV parsing
        const lines = text.split(/\r\n|\n/).filter((l) => l.trim().length > 0);
        if (lines.length === 0) return resolve([]);

        // Strip UTF-8 BOM if present
        let firstLine = lines[0];
        if (firstLine.charCodeAt(0) === 0xfeff) {
          firstLine = firstLine.slice(1);
        }

        const headers = firstLine.split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
        const results: any[] = [];

        for (let i = 1; i < lines.length; i++) {
          const currentLine = lines[i];
          // Skip comment or subheader if any
          if (!currentLine.trim()) continue;

          // Simple CSV row parser handling quoted commas
          const values: string[] = [];
          let insideQuote = false;
          let currentVal = '';

          for (let char of currentLine) {
            if (char === '"') {
              insideQuote = !insideQuote;
            } else if (char === ',' && !insideQuote) {
              values.push(currentVal.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
              currentVal = '';
            } else {
              currentVal += char;
            }
          }
          values.push(currentVal.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));

          const rowObj: Record<string, any> = {};
          headers.forEach((header, idx) => {
            rowObj[header] = values[idx] || '';
          });
          results.push(rowObj);
        }

        resolve(results);
      } catch (err) {
        reject(new Error('Định dạng tệp không hợp lệ: ' + (err as any).message));
      }
    };

    reader.onerror = () => reject(new Error('Không thể đọc tệp dữ liệu'));
    reader.readAsText(file);
  });
}
