export interface IDownload {
  name: string;
  progress?: number;
  status: "ready" | "processing";
}

export interface IDownloadUpdateEvent {
  name: string;
  progress: number;
}
