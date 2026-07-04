import { useCallback, useEffect, useRef, useState } from "react";

export interface MediaDevice {
  deviceId: string;
  label: string;
  kind: MediaDeviceKind;
}

export interface UseMediaPreviewReturn {
  /** Bind this to a <video> element's ref */
  videoRef: React.RefObject<HTMLVideoElement | null>;
  /** Raw MediaStream – null until permissions granted */
  stream: MediaStream | null;
  /** Available devices grouped by kind */
  devices: MediaDevice[];
  /** Currently selected device IDs */
  selectedCamera: string | null;
  selectedMic: string | null;
  /** Mic / camera on/off */
  micOn: boolean;
  cameraOn: boolean;
  /** 0-1 audio input level for visualiser */
  audioLevel: number;
  /** Permission / device errors */
  error: string | null;
  /** Whether we're still acquiring the stream */
  loading: boolean;

  toggleMic: () => void;
  toggleCamera: () => void;
  switchDevice: (kind: "videoinput" | "audioinput", deviceId: string) => void;
  /** Call to fully stop the stream (also called on unmount) */
  stop: () => void;
}

export function useMediaPreview(): UseMediaPreviewReturn {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number>(0);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [devices, setDevices] = useState<MediaDevice[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [selectedMic, setSelectedMic] = useState<string | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* ── enumerate devices ── */
  const enumerate = useCallback(async () => {
    try {
      const raw = await navigator.mediaDevices.enumerateDevices();
      setDevices(
        raw
          .filter((d) => d.kind === "videoinput" || d.kind === "audioinput" || d.kind === "audiooutput")
          .map((d) => ({
            deviceId: d.deviceId,
            label: d.label || `${d.kind} (${d.deviceId.slice(0, 6)})`,
            kind: d.kind,
          }))
      );
    } catch {
      /* silent — devices list is nice-to-have */
    }
  }, []);

  /* ── audio level meter ── */
  const startAudioMeter = useCallback((s: MediaStream) => {
    try {
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(s);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.5;
      source.connect(analyser);
      analyserRef.current = analyser;

      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        setAudioLevel(Math.min(avg / 128, 1));
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch {
      /* AudioContext not supported — skip meter */
    }
  }, []);

  /* ── acquire stream ── */
  const acquire = useCallback(
    async (cameraId?: string | null, micId?: string | null) => {
      setLoading(true);
      setError(null);

      // Stop previous stream
      streamRef.current?.getTracks().forEach((t) => t.stop());
      cancelAnimationFrame(rafRef.current);
      audioCtxRef.current?.close().catch(() => {});

      try {
        const constraints: MediaStreamConstraints = {
          video: cameraId ? { deviceId: { exact: cameraId } } : true,
          audio: micId ? { deviceId: { exact: micId } } : true,
        };
        const s = await navigator.mediaDevices.getUserMedia(constraints);

        streamRef.current = s;
        setStream(s);

        // Bind to video element
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }

        // Set selected devices from the actual tracks
        const vTrack = s.getVideoTracks()[0];
        const aTrack = s.getAudioTracks()[0];
        if (vTrack) setSelectedCamera(vTrack.getSettings().deviceId ?? null);
        if (aTrack) setSelectedMic(aTrack.getSettings().deviceId ?? null);

        // Start audio meter
        startAudioMeter(s);

        // Re-enumerate (labels become available after permission grant)
        await enumerate();
      } catch (err: any) {
        if (err.name === "NotAllowedError") {
          setError("Camera and microphone permissions are required for the preview.");
        } else if (err.name === "NotFoundError") {
          setError("No camera or microphone found on this device.");
        } else if (err.name === "NotReadableError") {
          setError("Your camera or microphone is in use by another app.");
        } else {
          setError(err.message || "Could not access media devices.");
        }
      } finally {
        setLoading(false);
      }
    },
    [enumerate, startAudioMeter]
  );

  /* ── initial acquisition ── */
  useEffect(() => {
    acquire();
    return () => {
      // Cleanup on unmount
      streamRef.current?.getTracks().forEach((t) => t.stop());
      cancelAnimationFrame(rafRef.current);
      audioCtxRef.current?.close().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── toggles ── */
  const toggleMic = useCallback(() => {
    const track = streamRef.current?.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setMicOn(track.enabled);
      if (!track.enabled) setAudioLevel(0);
    }
  }, []);

  const toggleCamera = useCallback(() => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setCameraOn(track.enabled);
    }
  }, []);

  /* ── switch device ── */
  const switchDevice = useCallback(
    (kind: "videoinput" | "audioinput", deviceId: string) => {
      if (kind === "videoinput") {
        acquire(deviceId, selectedMic);
      } else {
        acquire(selectedCamera, deviceId);
      }
    },
    [acquire, selectedCamera, selectedMic]
  );

  /* ── stop ── */
  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setStream(null);
    cancelAnimationFrame(rafRef.current);
    audioCtxRef.current?.close().catch(() => {});
  }, []);

  return {
    videoRef,
    stream,
    devices,
    selectedCamera,
    selectedMic,
    micOn,
    cameraOn,
    audioLevel,
    error,
    loading,
    toggleMic,
    toggleCamera,
    switchDevice,
    stop,
  };
}
