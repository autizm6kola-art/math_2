// import './App.css';
// import React, { useState, useEffect } from 'react';

// function ProgressBar({ correct, total }) {
//   const percent = total === 0 ? 0 : (correct / total) * 100;

//   const containerStyle = {
//     width: '100%',
//     height: '20px',
//     backgroundColor: '#ddd',
//     borderRadius: '10px',
//     overflow: 'hidden',
//     marginBottom: '20px',
//   };

//   const fillerStyle = {
//     height: '100%',
//     width: `${percent}%`,
//     backgroundColor: '#4caf50',
//     transition: 'width 0.3s ease-in-out',
//   };

//   return (
//     <div style={containerStyle} aria-label={`Прогресс: ${percent.toFixed(0)}%`}>
//       <div style={fillerStyle} />
//     </div>
//   );
// }

// function BackButton() {
//   return (
//     <a href="https://autizm6kola-art.github.io/svet/" className="back-link">
//       ← Назад
//     </a>
//   );
// }

// function App() {
//   const [selectedRange, setSelectedRange] = useState(null);
//   const [correctCount, setCorrectCount] = useState(0);
//   const [answeredTasks, setAnsweredTasks] = useState({});
//   const [allTasks, setAllTasks] = useState([]);
//   const [ranges, setRanges] = useState([]);
//   const [progressByRange, setProgressByRange] = useState({});
//   const [loading, setLoading] = useState(false);

//   // Новый стейт для общего прогресса
//   const [totalCorrect, setTotalCorrect] = useState(0);

//   const getStorageKey = (range) => `progress_${range.start}_${range.end}`;

//   useEffect(() => {
//     setLoading(true);
//     fetch(process.env.PUBLIC_URL + '/tasks.json')
//       .then((res) => res.json())
//       .then((data) => {
//         setAllTasks(data);
//         setLoading(false);

//         // Формируем диапазоны по 10 заданий
//         const sorted = [...data].sort((a, b) => a.id - b.id);
//         const dynamicRanges = [];

//         for (let i = 0; i < sorted.length; i += 10) {
//           const chunk = sorted.slice(i, i + 10);
//           if (chunk.length > 0) {
//             dynamicRanges.push({
//               start: chunk[0].id,
//               end: chunk[chunk.length - 1].id,
//             });
//           }
//         }

//         setRanges(dynamicRanges);
//       })
//       .catch((err) => {
//         console.error('Ошибка при загрузке JSON:', err);
//         setLoading(false);
//       });
//   }, []);

//   // Загружаем прогресс по каждому диапазону
//   useEffect(() => {
//     const progress = {};

//     ranges.forEach((range) => {
//       const key = getStorageKey(range);
//       const saved = localStorage.getItem(key);
//       const totalInRange = allTasks.filter(
//         (t) => t.id >= range.start && t.id <= range.end
//       ).length;

//       if (saved && totalInRange > 0) {
//         const parsed = JSON.parse(saved);
//         const percent = (parsed.correctCount / totalInRange) * 100;
//         progress[key] = percent;
//       } else {
//         progress[key] = 0;
//       }
//     });

//     setProgressByRange(progress);
//   }, [ranges, allTasks]);

//   // Новый useEffect для подсчёта общего количества решённых задач
//   useEffect(() => {
//     if (ranges.length === 0) {
//       setTotalCorrect(0);
//       return;
//     }

//     let sum = 0;

//     ranges.forEach((range) => {
//       const key = getStorageKey(range);
//       const saved = localStorage.getItem(key);
//       if (saved) {
//         const parsed = JSON.parse(saved);
//         sum += parsed.correctCount || 0;
//       }
//     });

//     setTotalCorrect(sum);
//   }, [ranges]);

//   useEffect(() => {
//     if (selectedRange) {
//       const key = getStorageKey(selectedRange);
//       const saved = localStorage.getItem(key);
//       if (saved) {
//         const parsed = JSON.parse(saved);
//         setCorrectCount(parsed.correctCount);
//         setAnsweredTasks(parsed.answeredTasks);
//       } else {
//         setCorrectCount(0);
//         setAnsweredTasks({});
//       }
//     }
//   }, [selectedRange]);

//   const handleCorrectAnswer = (taskId) => {
//     if (!answeredTasks[taskId]) {
//       const updatedTasks = { ...answeredTasks, [taskId]: true };
//       const newCount = correctCount + 1;

//       setAnsweredTasks(updatedTasks);
//       setCorrectCount(newCount);

//       const key = getStorageKey(selectedRange);
//       localStorage.setItem(
//         key,
//         JSON.stringify({
//           correctCount: newCount,
//           answeredTasks: updatedTasks,
//         })
//       );
//     }
//   };

//   if (loading) return <div>Загрузка заданий...</div>;

//   if (selectedRange) {
//     const tasks = allTasks.filter(
//       (t) => t.id >= selectedRange.start && t.id <= selectedRange.end
//     );

//     return (
//       <div
//         style={{
//           maxWidth: 700,
//           margin: 'auto',
//           padding: '80px 20px 20px',
//           position: 'relative',
//         }}
//       >
//         <BackButton />

//         <h1 style={{ margin: '45px 20px 8px 220px' }}>
//           Задачи {selectedRange.start}–{selectedRange.end}
//         </h1>

//         <button
//           onClick={() => setSelectedRange(null)}
//           className="back-link"
//           style={{ top: '77px', position: 'absolute', left: '540px' }}
//         >
//           ← Назад к выбору
//         </button>

//         <ProgressBar correct={correctCount} total={tasks.length} />

//         <p>
//           <strong>
//             Правильных ответов: {correctCount} из {tasks.length}
//           </strong>
//         </p>
//         <hr />

//         <div className="task-grid">
//           {tasks.map((task) => (
//             <div className="task-item" key={task.id}>
//               <Task
//                 task={task}
//                 onCorrect={handleCorrectAnswer}
//                 alreadyCorrect={answeredTasks[task.id]}
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // Главная страница (меню)
//   return (
//     <div
//       style={{
//         maxWidth: 600,
//         margin: 'auto',
//         padding: '60px 20px 20px 20px',
//         position: 'relative',
//       }}
//     >
//       <BackButton />

//       <h1 style={{ margin: '0 0 10px 230px' }}>ЗАДАЧИ</h1>

//       {/* Общий прогресс под заголовком */}
//     <div style={{ marginBottom: '30px' }}>
//       <ProgressBar correct={totalCorrect} total={allTasks.length} />
//       <p style={{ textAlign: 'center', fontWeight: 'bold' }}>
//         Решено {totalCorrect} задач из {allTasks.length}
//       </p>
//     </div>

//       {ranges.map((range, index) => {
//         const key = getStorageKey(range);
//         const progress = progressByRange[key] || 0;

//         let buttonClass = 'range-button';
//         if (progress === 100) {
//           buttonClass += ' completed';
//         } else if (progress > 0) {
//           buttonClass += ' partial';
//         }

//         const label = `${range.start}–${range.end} (${Math.round(progress)}%)`;

//         return (
//           <button
//             key={index}
//             onClick={() => setSelectedRange(range)}
//             className={buttonClass}
//           >
//             {label}
//           </button>
//         );
//       })}

      
//     </div>
//   );
// }

// // function Task({ task, onCorrect, alreadyCorrect }) {
// //   const [answer, setAnswer] = React.useState('');
// //   const [isCorrect, setIsCorrect] = React.useState(null);

// //   useEffect(() => {
// //     if (alreadyCorrect) {
// //       setIsCorrect(true);
// //     }
// //   }, [alreadyCorrect]);

// //   const handleChange = (e) => {
// //     setAnswer(e.target.value);
// //     setIsCorrect(null);
// //   };

// //   const checkAnswer = () => {
// //     if (answer.trim().toLowerCase() === task.correctAnswer.toLowerCase()) {
// //       if (!isCorrect) {
// //         setIsCorrect(true);
// //         onCorrect(task.id);
// //       }
// //     } else {
// //       setIsCorrect(false);
// //     }
// //   };

// //   const inputStyle = {
// //     backgroundColor:
// //       isCorrect === null ? 'white' : isCorrect ? '#c8f7c5' : '#f7c5c5',
// //     padding: '5px',
// //     marginRight: '10px',
// //   };

// //   return (
// //     <div style={{ marginBottom: '20px' }}>
// //       <p>
// //         <strong>Задача {task.id}</strong>
// //       </p>
// //       <p>{task.text}</p>

// //       <input
// //         type="text"
// //         value={answer}
// //         onChange={handleChange}
// //         style={inputStyle}
// //         placeholder="Введите ответ"
// //         disabled={isCorrect === true}
// //       />
// //       <button onClick={checkAnswer} disabled={isCorrect === true}>
// //         Проверить
// //       </button>
// //     </div>
// //   );
// // }

// function Task({ task, onCorrect, alreadyCorrect }) {
//   const [answer, setAnswer] = React.useState('');
//   const [isCorrect, setIsCorrect] = React.useState(null);

//   useEffect(() => {
//     if (alreadyCorrect) {
//       setIsCorrect(true);
//     }
//   }, [alreadyCorrect]);

//   // Функция для проверки равенства ответов
//   const compareAnswers = (userAns, correctAns) => {
//     // Если правильный ответ — массив
//     if (Array.isArray(correctAns)) {
//       // Преобразуем ответ пользователя в массив чисел, разделяя по запятым, пробелам
//       const userArr = userAns
//         .split(/[\s,]+/)
//         .map(s => s.trim())
//         .filter(s => s.length > 0)
//         .map(Number)
//         .filter(n => !isNaN(n));
      
//       // Сравним длины
//       if (userArr.length !== correctAns.length) return false;

//       // Сравним элементы (без учёта порядка)
//       const sortedUser = [...userArr].sort();
//       const sortedCorrect = [...correctAns].sort();

//       for (let i = 0; i < sortedUser.length; i++) {
//         if (sortedUser[i] !== sortedCorrect[i]) return false;
//       }
//       return true;
//     } else {
//       // Правильный ответ строка или число — сравним как строки, игнорируя пробелы и регистр
//       return userAns.trim().toLowerCase() === String(correctAns).trim().toLowerCase();
//     }
//   };

//   const handleChange = (e) => {
//     setAnswer(e.target.value);
//     setIsCorrect(null);
//   };

//   const checkAnswer = () => {
//     if (compareAnswers(answer, task.correctAnswer)) {
//       if (!isCorrect) {
//         setIsCorrect(true);
//         onCorrect(task.id);
//       }
//     } else {
//       setIsCorrect(false);
//     }
//   };

//   const inputStyle = {
//     backgroundColor:
//       isCorrect === null ? 'white' : isCorrect ? '#c8f7c5' : '#f7c5c5',
//     padding: '5px',
//     marginRight: '10px',
//   };

//   return (
//     <div style={{ marginBottom: '20px' }}>
//       <p>
//         <strong>Задача {task.id}</strong>
//       </p>
//       <p>{task.text}</p>

//       <input
//         type="text"
//         value={answer}
//         onChange={handleChange}
//         style={inputStyle}
//         placeholder="Введите ответ"
//         disabled={isCorrect === true}
//       />
//       <button onClick={checkAnswer} disabled={isCorrect === true}>
//         Проверить
//       </button>
//     </div>
//   );
// }



// export default App;
import './App.css';
import React, { useState, useEffect } from 'react';

function ProgressBar({ correct, total }) {
  const percent = total === 0 ? 0 : (correct / total) * 100;

  const containerStyle = {
    width: '100%',
    height: '20px',
    backgroundColor: '#ddd',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '20px',
  };

  const fillerStyle = {
    height: '100%',
    width: `${percent}%`,
    backgroundColor: '#4caf50',
    transition: 'width 0.3s ease-in-out',
  };

  return (
    <div style={containerStyle} aria-label={`Прогресс: ${percent.toFixed(0)}%`}>
      <div style={fillerStyle} />
    </div>
  );
}

function BackButton() {
  return (
    <a href="https://autizm6kola-art.github.io/svet/" className="back-link">
      ← Назад
    </a>
  );
}

function App() {
  const [selectedRange, setSelectedRange] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredTasks, setAnsweredTasks] = useState({});
  const [allTasks, setAllTasks] = useState([]);
  const [ranges, setRanges] = useState([]);
  const [progressByRange, setProgressByRange] = useState({});
  const [loading, setLoading] = useState(false);

  // Новый стейт для общего прогресса
  const [totalCorrect, setTotalCorrect] = useState(0);

  const getStorageKey = (range) => `progress_${range.start}_${range.end}`;

  useEffect(() => {
    setLoading(true);
    fetch(process.env.PUBLIC_URL + '/tasks_for.json')
      .then((res) => res.json())
      .then((data) => {
        setAllTasks(data);
        setLoading(false);

        // Формируем диапазоны по 10 заданий
        const sorted = [...data].sort((a, b) => a.id - b.id);
        const dynamicRanges = [];

        for (let i = 0; i < sorted.length; i += 10) {
          const chunk = sorted.slice(i, i + 10);
          if (chunk.length > 0) {
            dynamicRanges.push({
              start: chunk[0].id,
              end: chunk[chunk.length - 1].id,
            });
          }
        }

        setRanges(dynamicRanges);
      })
      .catch((err) => {
        console.error('Ошибка при загрузке JSON:', err);
        setLoading(false);
      });
  }, []);

  // Загружаем прогресс по каждому диапазону
  useEffect(() => {
    const progress = {};

    ranges.forEach((range) => {
      const key = getStorageKey(range);
      const saved = localStorage.getItem(key);
      const totalInRange = allTasks.filter(
        (t) => t.id >= range.start && t.id <= range.end
      ).length;

      if (saved && totalInRange > 0) {
        const parsed = JSON.parse(saved);
        const percent = (parsed.correctCount / totalInRange) * 100;
        progress[key] = percent;
      } else {
        progress[key] = 0;
      }
    });

    setProgressByRange(progress);
  }, [ranges, allTasks]);

  // Новый useEffect для подсчёта общего количества решённых задач
  useEffect(() => {
    if (ranges.length === 0) {
      setTotalCorrect(0);
      return;
    }

    let sum = 0;

    ranges.forEach((range) => {
      const key = getStorageKey(range);
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        sum += parsed.correctCount || 0;
      }
    });

    setTotalCorrect(sum);
  }, [ranges]);

  useEffect(() => {
    if (selectedRange) {
      const key = getStorageKey(selectedRange);
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        setCorrectCount(parsed.correctCount);
        setAnsweredTasks(parsed.answeredTasks);
      } else {
        setCorrectCount(0);
        setAnsweredTasks({});
      }
    }
  }, [selectedRange]);

  const handleCorrectAnswer = (taskId) => {
    if (!answeredTasks[taskId]) {
      const updatedTasks = { ...answeredTasks, [taskId]: true };
      const newCount = correctCount + 1;

      setAnsweredTasks(updatedTasks);
      setCorrectCount(newCount);

      const key = getStorageKey(selectedRange);
      localStorage.setItem(
        key,
        JSON.stringify({
          correctCount: newCount,
          answeredTasks: updatedTasks,
        })
      );
    }
  };

  if (loading) return <div>Загрузка заданий...</div>;

  if (selectedRange) {
    const tasks = allTasks.filter(
      (t) => t.id >= selectedRange.start && t.id <= selectedRange.end
    );

    return (
      <div
        style={{
          maxWidth: 700,
          margin: 'auto',
          padding: '80px 20px 20px',
          position: 'relative',
        }}
      >
        <BackButton />

        <h1 style={{ margin: '45px 20px 8px 220px' }}>
          Задачи {selectedRange.start}–{selectedRange.end}
        </h1>

        <button
          onClick={() => setSelectedRange(null)}
          className="back-link"
          style={{ top: '77px', position: 'absolute', left: '540px' }}
        >
          ← Назад к выбору
        </button>

        <ProgressBar correct={correctCount} total={tasks.length} />

        <p>
          <strong>
            Правильных ответов: {correctCount} из {tasks.length}
          </strong>
        </p>
        <hr />

        <div className="task-grid">
          {tasks.map((task) => (
            <div className="task-item" key={task.id}>
              <Task
                task={task}
                onCorrect={handleCorrectAnswer}
                alreadyCorrect={answeredTasks[task.id]}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Главная страница (меню)
  return (
    <div
      style={{
        maxWidth: 600,
        margin: 'auto',
        padding: '60px 20px 20px 20px',
        position: 'relative',
      }}
    >
      <BackButton />

      <h1 style={{ margin: '0 0 10px 230px' }}>ЗАДАЧИ</h1>

      {/* Общий прогресс под заголовком */}
    <div style={{ marginBottom: '30px' }}>
      <ProgressBar correct={totalCorrect} total={allTasks.length} />
      <p style={{ textAlign: 'center', fontWeight: 'bold' }}>
        Решено {totalCorrect} задач из {allTasks.length}
      </p>
    </div>

      {ranges.map((range, index) => {
        const key = getStorageKey(range);
        const progress = progressByRange[key] || 0;

        let buttonClass = 'range-button';
        if (progress === 100) {
          buttonClass += ' completed';
        } else if (progress > 0) {
          buttonClass += ' partial';
        }

        const label = `${range.start}–${range.end} (${Math.round(progress)}%)`;

        return (
          <button
            key={index}
            onClick={() => setSelectedRange(range)}
            className={buttonClass}
          >
            {label}
          </button>
        );
      })}

      
    </div>
  );
}

function Task({ task, onCorrect, alreadyCorrect }) {
  const [answer, setAnswer] = React.useState('');
  const [isCorrect, setIsCorrect] = React.useState(null);

  useEffect(() => {
    if (alreadyCorrect) {
      setIsCorrect(true);
    }
  }, [alreadyCorrect]);

  const handleChange = (e) => {
    setAnswer(e.target.value);
    setIsCorrect(null);
  };

  const checkAnswer = () => {
    if (answer.trim().toLowerCase() === task.correctAnswer.toLowerCase()) {
      if (!isCorrect) {
        setIsCorrect(true);
        onCorrect(task.id);
      }
    } else {
      setIsCorrect(false);
    }
  };

  const inputStyle = {
    backgroundColor:
      isCorrect === null ? 'white' : isCorrect ? '#c8f7c5' : '#f7c5c5',
    padding: '5px',
    marginRight: '10px',
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <p>
        <strong>Задача {task.id}</strong>
      </p>
      <p>{task.text}</p>

      <input
        type="text"
        value={answer}
        onChange={handleChange}
        style={inputStyle}
        placeholder="Введите ответ"
        disabled={isCorrect === true}
      />
      <button onClick={checkAnswer} disabled={isCorrect === true}>
        Проверить
      </button>
    </div>
  );
}

export default App;
