/**
 * CSV parsing service untuk upload file soal
 */

/**
 * Parse CSV file menjadi question data
 * @param {string} csvContent - Raw CSV content
 * @returns {Object} {success, data, errors}
 */
export const parseCSV = (csvContent) => {
  const errors = [];
  const questions = [];
  const answerKey = [];

  try {
    const lines = csvContent.trim().split('\n');
    
    // Skip header row (first line)
    if (lines.length < 2) {
      return {
        success: false,
        data: null,
        errors: ['File CSV harus memiliki minimal 2 baris (header + 1 soal)']
      };
    }

    // Parse setiap baris
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue; // Skip empty lines

      try {
        const row = parseCSVLine(line);
        
        if (row.length < 6) {
          errors.push(`Baris ${i + 1}: Format tidak valid. Diharapkan 6 kolom (Soal, Opsi A-D, Jawaban)`);
          continue;
        }

        const [soal, opsiA, opsiB, opsiC, opsiD, jawaban] = row;

        // Validasi
        if (!soal) {
          errors.push(`Baris ${i + 1}: Soal tidak boleh kosong`);
          continue;
        }

        if (!opsiA || !opsiB || !opsiC || !opsiD) {
          errors.push(`Baris ${i + 1}: Semua opsi (A-D) harus terisi`);
          continue;
        }

        const jawabanUpper = jawaban.toUpperCase().trim();
        const jawabanMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };

        if (!jawabanMap.hasOwnProperty(jawabanUpper)) {
          errors.push(`Baris ${i + 1}: Jawaban benar harus A, B, C, atau D (diterima: "${jawaban}")`);
          continue;
        }

        questions.push({
          text: soal.trim(),
          options: [
            `A. ${opsiA.trim()}`,
            `B. ${opsiB.trim()}`,
            `C. ${opsiC.trim()}`,
            `D. ${opsiD.trim()}`
          ]
        });

        answerKey.push(jawabanMap[jawabanUpper]);
      } catch (err) {
        errors.push(`Baris ${i + 1}: ${err.message}`);
      }
    }

    if (questions.length === 0) {
      return {
        success: false,
        data: null,
        errors: errors.length > 0 ? errors : ['Tidak ada soal yang berhasil diparse']
      };
    }

    return {
      success: true,
      data: { questions, answerKey },
      errors: errors.length > 0 ? errors : []
    };
  } catch (err) {
    return {
      success: false,
      data: null,
      errors: [`Gagal membaca file: ${err.message}`]
    };
  }
};

/**
 * Parse satu baris CSV dengan proper handling untuk quoted fields
 * @param {string} line - Satu baris CSV
 * @returns {Array} Array of parsed fields
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator (comma outside quotes)
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  // Add last field
  result.push(current.trim());

  return result;
}

/**
 * Generate CSV template content
 * @returns {string} CSV template
 */
export const generateCSVTemplate = () => {
  return `Soal,Opsi A,Opsi B,Opsi C,Opsi D,Jawaban Benar
"Apa nama planet terdekat dari Matahari?","Venus","Mars","Merkurius","Jupiter","C"
"Siapakah pencipta lagu Indonesia Raya?","Ismail Marzuki","W.R. Supratman","Ibu Sud","Kusbini","B"
"Berapa hasil dari 15 x 12?","150","170","180","190","C"
"Unsur kimia dengan lambang O adalah...","Emas","Perak","Oksigen","Osmium","C"
"Ibukota negara Jepang adalah...","Seoul","Beijing","Tokyo","Bangkok","C"`;
};

/**
 * Download CSV template
 */
export const downloadCSVTemplate = () => {
  const template = generateCSVTemplate();
  const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', 'template-soal.csv');
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Validate uploaded file
 * @param {File} file - Input file
 * @returns {Object} {valid, error}
 */
export const validateFile = (file) => {
  if (!file) {
    return { valid: false, error: 'File tidak dipilih' };
  }

  // Check file type
  const validTypes = ['text/csv', 'application/vnd.ms-excel', 'text/plain'];
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Tipe file harus CSV' };
  }

  // Check file size (max 1MB)
  if (file.size > 1024 * 1024) {
    return { valid: false, error: 'Ukuran file maksimal 1MB' };
  }

  return { valid: true };
};

/**
 * Read file as text
 * @param {File} file - Input file
 * @returns {Promise<string>} File content
 */
export const readFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(new Error('Gagal membaca file'));
    reader.readAsText(file, 'UTF-8');
  });
};
