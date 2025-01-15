export type VideoItemWithDisplayParams = VideoItem & {
  is_fullscreen?: boolean;
  is_recommend?: boolean;
  unmuted?: boolean;
};

export type ExtendedVideo = Videos & { result: VideoItemWithDisplayParams[] };
