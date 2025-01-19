export type VideoItemWithDisplayParams = VideoItem & {
  is_fullscreen?: boolean
  unmuted?: boolean
}

export type ExtendedVideo = Videos & { result: VideoItemWithDisplayParams[] }
