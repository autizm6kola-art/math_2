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
    <a href="https://autizm6kola-art.github.io/rumpel/" className="back-link">
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
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [loading, setLoading] = useState(false);

  const getTaskKey = (id) => `task_answer_${id}`;

  useEffect(() => {
    setLoading(true);
    fetch(process.env.PUBLIC_URL + '/tasks_zad1.json')
      .then((res) => res.json())
      .then((data) => {
        setAllTasks(data);
        setLoading(false);

        const sorted = [...data].sort((a, b) => a.id - b.id);
        const dynamicRanges = [];

        for (let i = 0; i < sorted.length; i += 2) {
          const chunk = sorted.slice(i, i + 2);
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

  useEffect(() => {
  const migrateOldProgress = () => {
    const keys = Object.keys(localStorage);
    const oldProgressKeys = keys.filter(key => key.startsWith("progress_"));

    oldProgressKeys.forEach((key) => {
      try {
        const data = JSON.parse(localStorage.getItem(key));
        if (data && data.answeredTasks) {
          Object.keys(data.answeredTasks).forEach((taskId) => {
            localStorage.setItem(`task_answer_${taskId}`, "true");
          });
        }
        // Не удаляем старые ключи, на всякий случай:
        // localStorage.removeItem(key);
      } catch (e) {
        console.error("Ошибка при миграции из", key, e);
      }
    });
  };

  migrateOldProgress();
}, []);


  // Прогресс по диапазонам
  useEffect(() => {
    const progress = {};

    ranges.forEach((range) => {
      const tasksInRange = allTasks.filter(
        (t) => t.id >= range.start && t.id <= range.end
      );

      const totalInRange = tasksInRange.length;
      let correctInRange = 0;

      tasksInRange.forEach((task) => {
        const saved = localStorage.getItem(getTaskKey(task.id));
        if (saved === 'true') correctInRange++;
      });

      const percent =
        totalInRange > 0 ? (correctInRange / totalInRange) * 100 : 0;
      progress[`${range.start}_${range.end}`] = percent;
    });

    setProgressByRange(progress);
  }, [ranges, allTasks]);

  // Общий прогресс
  useEffect(() => {
    const count = allTasks.reduce((acc, task) => {
      const saved = localStorage.getItem(getTaskKey(task.id));
      return acc + (saved === 'true' ? 1 : 0);
    }, 0);

    setTotalCorrect(count);
  }, [allTasks]);

  // Прогресс по выбранному диапазону
  useEffect(() => {
    if (selectedRange) {
      const tasksInRange = allTasks.filter(
        (t) => t.id >= selectedRange.start && t.id <= selectedRange.end
      );

      const answered = {};
      let correct = 0;

      tasksInRange.forEach((task) => {
        const saved = localStorage.getItem(getTaskKey(task.id));
        if (saved === 'true') {
          answered[task.id] = true;
          correct++;
        }
      });

      setAnsweredTasks(answered);
      setCorrectCount(correct);
    }
  }, [selectedRange, allTasks]);

  const handleCorrectAnswer = (taskId) => {
    if (!answeredTasks[taskId]) {
      const updatedTasks = { ...answeredTasks, [taskId]: true };
      const newCount = correctCount + 1;

      setAnsweredTasks(updatedTasks);
      setCorrectCount(newCount);

      localStorage.setItem(getTaskKey(taskId), 'true');
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

      <div style={{ marginBottom: '30px' }}>
        <ProgressBar correct={totalCorrect} total={allTasks.length} />
        <p style={{ textAlign: 'center', fontWeight: 'bold' }}>
          Решено {totalCorrect} задач из {allTasks.length}
        </p>
      </div>

      {ranges.map((range, index) => {
        const key = `${range.start}_${range.end}`;
        const progress = progressByRange[key] || 0;

        let buttonClass = 'range-button';
        if (progress === 100) {
          buttonClass += ' completed';
        } else if (progress > 0) {
          buttonClass += ' partial';
        }

        const label = `${range.start}–${range.end}`;
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
