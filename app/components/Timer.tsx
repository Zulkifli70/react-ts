import { useEffect, useState } from "react";

type TimerProps = {
  isGameOver: boolean;
  onTimeUp: () => void;
  initialTime?: number;
  hasStarted: boolean; // ← Add this line
};

export default function Timer({
  isGameOver,
  onTimeUp,
  initialTime = 60,
  hasStarted, // ← Add this to destructuring
}: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    // Reset timer when game restarts
    setTimeLeft(initialTime);
  }, [initialTime]);

  useEffect(() => {
    // Don't run timer if game hasn't started, is over, or time is up
    if (!hasStarted || isGameOver || timeLeft <= 0) return; // ← Use hasStarted here

    // Set up interval to decrease time
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          onTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(timerId);
  }, [hasStarted, isGameOver, timeLeft, onTimeUp]); // ← Add hasStarted to dependency array

  // Format time as MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  // Determine color based on time left
  const getTimerColor = () => {
    if (timeLeft <= 10) return "#ba2a2a"; // Red
    if (timeLeft <= 30) return "#fcba29"; // Yellow
    return "#10a95b"; // Green
  };

  return (
    <div className="timer-box">
      <h2>Game Time</h2>
      <div
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          color: getTimerColor(),
          marginBottom: "20px",
          textAlign: "center",
        }}
        role="timer"
        aria-live="polite"
      >
        ⏱️ {formattedTime}
      </div>
    </div>
  );
}
