import React, { useEffect } from "react";
import { useStopwatch } from "react-timer-hook";
function Timer(props) {
  const { seconds, minutes, hours, days, isRunning } = useStopwatch({
    autoStart: true,
  });

  useEffect(() => {
    var callSummary;
    if (hours == 0 && minutes == 0) {
      callSummary = `${seconds} secs`;
    } else if (hours == 0) {
      callSummary = `${minutes} mins ${seconds} secs`;
    } else {
      callSummary = `${hours} hr ${minutes} mins ${seconds} secs`;
    }
    props.setDuration(callSummary);
  }, [seconds, minutes, hours]);
  return (
    <div
      style={{
        padding: "3px",
        margin: "5px",
        borderRadius: "5px",
        fontSize: "16px",
        backgroundColor: "gray",
        color: "white",
      }}
    >
      <span>{hours === 0 ? "" : `${hours}:`}</span>
      <span>{minutes === 0 ? "0:" : `${minutes}:`}</span>
      <span>{seconds}</span>
    </div>
  );
}

export default Timer;
