import { useState, useEffect } from "react";
import RecordRTC, { RecordRTCPromisesHandler } from "recordrtc";
 const useRecorderPermission = () => {
  const [recorder, setRecorder] = useState();
  useEffect(() => {
    getPermissionInitializeRecorder();
  }, []);
  const getPermissionInitializeRecorder = async () => {
    let stream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });
    let recorder = new RecordRTCPromisesHandler(stream, {
      type: 'audio',
    });
    setRecorder(recorder);
  };
  return recorder;
};
export default useRecorderPermission;