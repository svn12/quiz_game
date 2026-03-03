// Google Apps Script - Deploy as Web App (Anyone, even anonymous)
// Bound to the Google Sheet with "題目" and "回答" sheets

const QUESTION_SHEET = '題目';
const ANSWER_SHEET = '回答';

function doGet(e) {
  const action = e.parameter.action;
  if (action === 'getQuestions') {
    return handleGetQuestions(e);
  }
  return jsonResponse({ error: 'Unknown action' });
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  if (data.action === 'submitAnswers') {
    return handleSubmitAnswers(data);
  }
  return jsonResponse({ error: 'Unknown action' });
}

function handleGetQuestions(e) {
  const count = parseInt(e.parameter.count) || 10;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(QUESTION_SHEET);
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0]; // [題號, 題目, A, B, C, D, 解答]
  const dataRows = rows.slice(1);

  // Shuffle and pick `count` questions
  const shuffled = dataRows.sort(() => Math.random() - 0.5).slice(0, count);

  const questions = shuffled.map((row) => ({
    id: row[0],
    question: row[1],
    A: row[2],
    B: row[3],
    C: row[4],
    D: row[5],
    answer: String(row[6]).trim().toUpperCase(),
  }));

  return jsonResponse({ questions });
}

function handleSubmitAnswers(data) {
  const { userId, answers } = data;
  // answers: [{ questionId, selected }]

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const qSheet = ss.getSheetByName(QUESTION_SHEET);
  const aSheet = ss.getSheetByName(ANSWER_SHEET);

  // Build answer key
  const qRows = qSheet.getDataRange().getValues();
  const answerKey = {};
  qRows.slice(1).forEach((row) => {
    answerKey[String(row[0])] = String(row[6]).trim().toUpperCase();
  });

  // Calculate score
  let score = 0;
  answers.forEach(({ questionId, selected }) => {
    if (answerKey[String(questionId)] === String(selected).trim().toUpperCase()) {
      score++;
    }
  });

  const passThreshold = data.passThreshold || 8;
  const passed = score >= passThreshold;
  const now = new Date();

  // Find existing row for userId
  const aRows = aSheet.getDataRange().getValues();
  let existingRowIndex = -1;
  for (let i = 1; i < aRows.length; i++) {
    if (String(aRows[i][0]) === String(userId)) {
      existingRowIndex = i;
      break;
    }
  }

  if (existingRowIndex === -1) {
    // New user — append row
    // Cols: ID | 闖關次數 | 總分 | 最高分 | 第一次通關分數 | 花了幾次通關 | 最近遊玩時間
    const firstClear = passed ? score : '';
    const clearCount = passed ? 1 : 0;
    aSheet.appendRow([userId, 1, score, score, firstClear, clearCount, now]);
  } else {
    // Existing user — update
    const row = aRows[existingRowIndex];
    const playCount = (row[1] || 0) + 1;
    const totalScore = (row[2] || 0) + score;
    const highScore = Math.max(row[3] || 0, score);
    const firstClear = row[4] !== '' ? row[4] : (passed ? score : '');
    const clearCount = (row[5] || 0) + (passed ? 1 : 0);

    const sheetRow = existingRowIndex + 1;
    aSheet.getRange(sheetRow, 2).setValue(playCount);
    aSheet.getRange(sheetRow, 3).setValue(totalScore);
    aSheet.getRange(sheetRow, 4).setValue(highScore);
    aSheet.getRange(sheetRow, 5).setValue(firstClear);
    aSheet.getRange(sheetRow, 6).setValue(clearCount);
    aSheet.getRange(sheetRow, 7).setValue(now);
  }

  return jsonResponse({ score, passed, total: answers.length });
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
