import { IconUpload } from "../../icons/IconUpload";
import "./UploadButton.css";

export type UploadButtonProps = {
  onSelectFile?: (file: File) => void;
};

export const UploadButton = ({ onSelectFile }: UploadButtonProps) => {
  const handleClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.click();

    input.addEventListener(
      "change",
      (evt) => {
        const file = (evt.target as HTMLInputElement).files?.[0];
        file && onSelectFile && onSelectFile(file);
      },
      true
    );
  };

  return (
    <button onClick={handleClick} className="UploadButton">
      <IconUpload />
    </button>
  );
};
