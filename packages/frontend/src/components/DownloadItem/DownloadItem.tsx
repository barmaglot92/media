import { IDownload } from "../../models/IDownload";
import { downloadAPI } from "../../services/DownloadService";

import "./DownloadItem.css";

export type DownloadItemProps = {
  item: IDownload;
};

export const DownloadItem = ({ item }: DownloadItemProps) => {
  const [deleteDownload] = downloadAPI.useDeleteDownloadMutation();

  const handleDelete = () => {
    void deleteDownload(item.name);
  };

  return (
    <div className="DownloadItem">
      <div>{item.name}&nbsp;</div>

      <div className="DownloadItem__actions">
        {item.status === "ready" && (
          <button className="DownloadItem__deleteBtn" onClick={handleDelete}>
            delete
          </button>
        )}
        {item.status === "processing" &&
          item.progress &&
          `${(item.progress * 100).toFixed(0)}%`}
      </div>
    </div>
  );
};
