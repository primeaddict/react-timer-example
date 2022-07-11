import { useState } from "react";
import "./App.css";

const defaultValue = { minute: 0, second: 0 };

String.prototype.toDoubleCase = function () {
  return this.length === 1 ? `0${this}` : this;
};

export default function App() {
  const [time, setTime] = useState(defaultValue);
  const [intervalId, setIntervalId] = useState(false);
  const { minute, second } = time;

  function updateTime() {
    setTime((oldTime) => {
      let { minute, second } = oldTime;
      minute = +minute;
      second = +second;

      if (second > 0) {
        return { minute, second: second - 1 };
      } else {
        if (minute > 0) {
          return { minute: minute - 1, second: 59 };
        } else {
          setIntervalId((id) => {
            clearInterval(id);
            return false;
          });
          return defaultValue;
        }
      }
    });
  }

  const updateValue = (e) => {
    const id = e.target.id;
    const value = +e.target.value;
    const newValue = {};

    if (id === "second") {
      if (value > 60) {
        const exactMinute = Math.floor(value / 60);
        const remainingSeconds = value - exactMinute * 60;
        setTime((oldTime) => {
          const { minute } = oldTime;
          return { minute: +minute + exactMinute, second: remainingSeconds };
        });
      } else {
        setTime((time) => {
          return { minute: time.minute, second: value };
        });
      }
    } else {
      setTime((time) => {
        return { second: time.second, minute: value };
      });
    }
  };

  const startTimer = () => {
    if (!intervalId) {
      const localId = setInterval(() => {
        clearInterval(intervalId);
        updateTime();
      }, 1000);

      setIntervalId((id) => {
        clearInterval(id);
        return localId;
      });
    }
  };

  const pauseOrResumeTimer = () => {
    if (!intervalId) {
      clearInterval(intervalId);

      const localId = setInterval(() => {
        clearInterval(intervalId);
        updateTime();
      }, 1000);

      setIntervalId((id) => {
        clearInterval(id);
        return localId;
      });
    } else {
      setIntervalId((id) => {
        clearInterval(id);
        return false;
      });
    }
  };

  const resetClick = () => {
    setIntervalId((id) => {
      clearInterval(id);
      return false;
    });
    setTime(defaultValue);
  };

  return (
    <div className="App">
      <h1>Timer</h1>
      <h2>
        {String(minute).toDoubleCase()}:{String(second).toDoubleCase()}
      </h2>
      <input
        id="minute"
        type="number"
        placeholder="Minutes"
        onChange={updateValue}
      />{" "}
      <input
        id="second"
        type="number"
        placeholder="Seconds"
        onChange={updateValue}
      />
      <br />
      <br />
      <div>
        <button onClick={startTimer}>Start</button>
        <button onClick={pauseOrResumeTimer}>Pause/Resume</button>
        <button onClick={resetClick}>Reset</button>
      </div>
    </div>
  );
}
