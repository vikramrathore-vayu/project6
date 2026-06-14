import { useEffect, useRef } from 'react';

export function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prevXRef = useRef<number | null>(null);
  const targetTimeRef = useRef<number>(0);
  const seekingRef = useRef<boolean>(false);

  const SENSITIVITY = 0.8;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Track when metadata is loaded to set initial target time
    const handleLoadedMetadata = () => {
      targetTimeRef.current = video.currentTime;
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    const handleMouseMove = (e: MouseEvent) => {
      const currentX = e.clientX;

      if (prevXRef.current === null) {
        prevXRef.current = currentX;
        return;
      }

      const delta = currentX - prevXRef.current;
      prevXRef.current = currentX;

      const duration = video.duration;
      if (isNaN(duration) || duration <= 0) return;

      // Calculate time offset based on horizontal mouse movement relative to screen width
      const timeOffset = (delta / window.innerWidth) * SENSITIVITY * duration;
      const newTargetTime = Math.max(0, Math.min(duration, targetTimeRef.current + timeOffset));

      targetTimeRef.current = newTargetTime;

      // If not currently seeking, perform the seek immediately
      if (!seekingRef.current) {
        seekingRef.current = true;
        video.currentTime = newTargetTime;
      }
    };

    // Reset reference X coordinate when mouse leaves the window to prevent jumps on re-entry
    const handleMouseLeave = () => {
      prevXRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleSeeked = () => {
    const video = videoRef.current;
    if (!video) return;

    const duration = video.duration;
    if (isNaN(duration)) {
      seekingRef.current = false;
      return;
    }

    // Check if targetTime has moved while the previous seek was executing
    if (Math.abs(video.currentTime - targetTimeRef.current) > 0.01) {
      video.currentTime = targetTimeRef.current;
    } else {
      seekingRef.current = false;
    }
  };

  return (
    <video
      ref={videoRef}
      className="fixed inset-0 w-full h-full object-cover pointer-events-none select-none z-0"
      style={{ objectPosition: '70% center' }}
      src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4"
      muted
      playsInline
      preload="auto"
      onSeeked={handleSeeked}
    />
  );
}
