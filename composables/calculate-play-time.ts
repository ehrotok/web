const startTime = ref(0);
const totalTime = ref(0);

const usePlayTimer = (video: HTMLVideoElement) => {
  video.addEventListener("play", onPlay);
  video.addEventListener("pause", updatePlayedTime);
  video.addEventListener("ended", updatePlayedTime);
};

const useEndTimer = (video: HTMLVideoElement) => {
  updatePlayedTime();
  video?.removeEventListener("play", onPlay);
  video?.removeEventListener("pause", updatePlayedTime);
  video?.removeEventListener("ended", updatePlayedTime);
  return totalTime.value;
};

const onPlay = () => {
  startTime.value = Date.now();
  totalTime.value = 0;
};

const updatePlayedTime = () => {
  if (startTime.value > 0) {
    const playedTime = (Date.now() - startTime.value) / 1000;
    totalTime.value += playedTime;
    startTime.value = 0;
  }
};

export { usePlayTimer, useEndTimer };
