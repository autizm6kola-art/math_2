// const fs = require('fs');
// const path = require('path');

// // Путь к исходному текстовому файлу
// const inputFile = path.join(__dirname, 'tasks.txt');

// // Путь к выходному JSON
// const outputFile = path.join(__dirname, 'tasks.json');

// function shuffleArray(arr) {
//   for (let i = arr.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [arr[i], arr[j]] = [arr[j], arr[i]];
//   }
//   return arr;
// }

// function parseAnswer(ans) {
//   ans = ans.trim();
//   if (ans.startsWith('[') && ans.endsWith(']')) {
//     try {
//       const parsed = JSON.parse(ans);
//       if (Array.isArray(parsed)) return parsed;
//       else return ans;
//     } catch {
//       return ans; // если не удалось распарсить, оставить как есть
//     }
//   }
//   return ans;
// }

// function readAndConvert() {
//   const content = fs.readFileSync(inputFile, 'utf-8');
//   const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);

//   const blockSize = 30;
//   const blocks = [];

//   for (let i = 0; i < lines.length; i += blockSize) {
//     const block = lines.slice(i, i + blockSize);
//     blocks.push(block);
//   }

//   const tasks = [];

//   blocks.forEach(block => {
//     const shuffledBlock = shuffleArray(block);

//     shuffledBlock.forEach(line => {
//       const parts = line.split('|').map(p => p.trim());
//       if (parts.length !== 3) {
//         console.warn(`Неправильный формат строки: ${line}`);
//         return;
//       }

//       const [id, text, correctAnswerRaw] = parts;

//       const correctAnswer = parseAnswer(correctAnswerRaw);

//       tasks.push({
//         id: Number(id),    // преобразуем id к числу
//         text,
//         correctAnswer,
//       });
//     });
//   });

//   fs.writeFileSync(outputFile, JSON.stringify(tasks, null, 2), 'utf-8');
//   console.log(`Готово! Создан файл ${outputFile} с ${tasks.length} задачами.`);
// }

// readAndConvert();
const fs = require('fs');
const path = require('path');

// Путь к исходному текстовому файлу
const inputFile = path.join(__dirname, 'tasks.txt');

// Путь к выходному JSON
const outputFile = path.join(__dirname, 'tasks.json');

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function parseAnswer(ans) {
  ans = ans.trim();
  if (ans.startsWith('[') && ans.endsWith(']')) {
    try {
      const parsed = JSON.parse(ans);
      if (Array.isArray(parsed)) return parsed;
      else return ans;
    } catch {
      return ans; // если не удалось распарсить, оставить как есть
    }
  }
  return ans;
}

function readAndConvert() {
  const content = fs.readFileSync(inputFile, 'utf-8');
  const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);

  const blockSize = 30;
  const blocks = [];

  for (let i = 0; i < lines.length; i += blockSize) {
    const block = lines.slice(i, i + blockSize);
    blocks.push(block);
  }

  const tasks = [];

  blocks.forEach(block => {
    const shuffledBlock = shuffleArray(block);

    shuffledBlock.forEach(line => {
      const parts = line.split('|').map(p => p.trim());
      if (parts.length !== 3) {
        console.warn(`Неправильный формат строки: ${line}`);
        return;
      }

      const [id, text, correctAnswerRaw] = parts;

      const correctAnswer = parseAnswer(correctAnswerRaw);

      tasks.push({
        id: Number(id),    // преобразуем id к числу
        text,
        correctAnswer,
      });
    });
  });

  fs.writeFileSync(outputFile, JSON.stringify(tasks, null, 2), 'utf-8');
  console.log(`Готово! Создан файл ${outputFile} с ${tasks.length} задачами.`);
}

readAndConvert();
