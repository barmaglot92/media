import { downloadAPI } from "../../services/DownloadService";
import { UploadButton } from "../UploadButton/UploadButton";
import "./Header.css";

export const Header = () => {
  const [createDownload] = downloadAPI.useCreateDownloadMutation();

  const uploadFile = (file: File) => {
    const formData = new FormData();
    formData.append("file", file, encodeURIComponent(file.name));

    void createDownload(formData);
  };

  return (
    <div className="Header">
      <UploadButton onSelectFile={(file) => uploadFile(file)} />
    </div>
  );
};
