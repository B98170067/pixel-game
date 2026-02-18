function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'getQuestions') {
    return getQuestions(e.parameter.count);
  }
  
  return ContentService.createTextOutput("Invalid Action");
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const playerId = data.playerId;
    const answers = data.answers;
    
    // Calculate Score
    const scoreResult = calculateScore(answers);
    
    // Save to Sheet
    saveResult(playerId, scoreResult);
    
    return ContentService.createTextOutput(JSON.stringify(scoreResult))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getQuestions(count) {
  count = parseInt(count) || 5;
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Questions");
  const data = sheet.getDataRange().getValues();
  const headers = data.shift(); // Remove headers
  
  // Shuffle and pick N
  const shuffled = data.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);
  
  const questions = selected.map(row => ({
    id: row[0],
    question: row[1],
    options: {
      A: row[2],
      B: row[3],
      C: row[4],
      D: row[5]
    }
    // Answer is at row[6], not sent to client
  }));
  
  return ContentService.createTextOutput(JSON.stringify(questions))
    .setMimeType(ContentService.MimeType.JSON);
}

function calculateScore(answers) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Questions");
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  
  // Create a map of ID -> Answer
  const answerKey = {};
  data.forEach(row => {
    answerKey[row[0]] = row[6]; // Assuming ID at 0, Answer at 6 (G column)
  });
  
  let score = 0;
  let total = 0;
  
  for (const [qId, answer] of Object.entries(answers)) {
    if (answerKey[qId] === answer) {
      score++;
    }
    total++;
  }
  
  const passThreshold = parseInt(PropertiesService.getScriptProperties().getProperty('PASS_THRESHOLD')) || 3;
  
  const details = [];
  for (const [qId, answer] of Object.entries(answers)) {
    details.push({
      id: qId,
      correctAnswer: answerKey[qId],
      userAnswer: answer,
      isCorrect: answerKey[qId] === answer
    });
  }

  return {
    score: score,
    total: total,
    passed: score >= passThreshold,
    details: details
  };
}

function saveResult(id, result) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Responses");
  // Columns: ID, Runs, Total Score, Max Score, First Score, Attempts, Last Played
  
  const data = sheet.getDataRange().getValues();
  let rowIndex = -1;
  
  // Find existing user
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == id) {
      rowIndex = i + 1; // 1-based index
      break;
    }
  }
  
  const timestamp = new Date();
  
  if (rowIndex > 0) {
    // Update existing
    const range = sheet.getRange(rowIndex, 1, 1, 7);
    const row = range.getValues()[0];
    
    const runs = row[1] + 1;
    const totalScore = row[2] + result.score; // Cumulative? "總分" might mean cumulative or latest. Let's assume cumulative based on standard RPG logic or just update. "總分" usually means total accumulated.
    // Requirement: "若同 ID 已通關過，後續分數不覆蓋，僅在同列增加闖關次數"
    // Wait, "First pass score" (第一次通關分數) is separate.
    // "Max Score"
    // Let's implement logic:
    // Runs: +1
    // Total Score: +current (cumulative)
    // Max Score: max(current, existing)
    // First Pass Score: if not set and passed, set it.
    // Attempts to pass: if passed, how many runs it took? "花了幾次通關". This implies "Attempts until first pass".
    
    // Let's re-read requirement carefully:
    // "第一次通關分數（若同 ID 已通關過，後續分數不覆蓋，僅在同列增加闖關次數）"
    // "花了幾次通關" -> "Attempts to clear"
    
    const currentMax = Math.max(row[3], result.score);
    let firstPassScore = row[4];
    let attemptsToPass = row[5];
    
    if (result.passed && !firstPassScore && firstPassScore !== 0) {
       firstPassScore = result.score;
       attemptsToPass = runs;
    }
    
    // Updating row
    sheet.getRange(rowIndex, 2).setValue(runs);
    sheet.getRange(rowIndex, 3).setValue(row[2] + result.score); // Accumulate total score
    sheet.getRange(rowIndex, 4).setValue(currentMax);
    if (result.passed && row[4] === "") { // simple check if empty
         sheet.getRange(rowIndex, 5).setValue(result.score);
         sheet.getRange(rowIndex, 6).setValue(runs);
    }
    sheet.getRange(rowIndex, 7).setValue(timestamp);
    
  } else {
    // New user
    const runs = 1;
    const totalScore = result.score;
    const maxScore = result.score;
    let firstPassScore = "";
    let attemptsToPass = "";
    
    if (result.passed) {
      firstPassScore = result.score;
      attemptsToPass = 1;
    }
    
    sheet.appendRow([id, runs, totalScore, maxScore, firstPassScore, attemptsToPass, timestamp]);
  }
}
