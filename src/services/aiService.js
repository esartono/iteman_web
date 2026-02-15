import { GEMINI_ENDPOINT, AI_SYSTEM_PROMPT } from '../config/appConfig';

/**
 * Dapatkan saran AI dari Gemini untuk soal yang bermasalah
 * @param {Object} questionData - Data soal dari hasil analisis
 * @param {string} apiKey - Gemini API Key
 * @returns {Promise<string>} AI suggestion text
 */
export const getAiSuggestion = async (questionData, apiKey) => {
  if (!apiKey) {
    return 'API Key Gemini tidak dikonfigurasi. Silakan set GEMINI_API_KEY.';
  }

  const userPrompt = buildPrompt(questionData);

  try {
    const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userPrompt }] }],
        systemInstruction: { parts: [{ text: AI_SYSTEM_PROMPT }] }
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const result = await response.json();
    return (
      result.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Gagal mendapatkan respons dari AI.'
    );
  } catch (err) {
    console.error('AI API Error:', err);
    return `Gagal memanggil AI: ${err.message}`;
  }
};

/**
 * Bangun prompt untuk AI berdasarkan data soal
 * @param {Object} questionData - Question data from analysis
 * @returns {string} Formatted prompt
 */
export const buildPrompt = (questionData) => {
  return `Analisislah soal ini:

Teks Soal: "${questionData.questionText}"

Statistik Analisis:
- Indeks Kesukaran (P): ${questionData.pValue}
- Daya Pembeda (D): ${questionData.dValue}
- Status: ${questionData.status}

Berikan:
1. Penjelasan mengapa soal ini bermasalah
2. Saran perbaikan untuk meningkatkan kualitas soal
3. Draf soal baru yang lebih valid dengan topik yang sama`;
};

/**
 * Validasi API Key format
 * @param {string} apiKey - API key to validate
 * @returns {boolean}
 */
export const isValidApiKey = (apiKey) => {
  return apiKey && apiKey.length > 20;
};
