import { FileUpload } from "primereact/fileupload";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";
import { useRef, useState } from "react";
import { ItemTemplateOptions } from "primereact/fileupload";
import Image from "next/image";

interface ImageUploadSingleProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  accept?: string;
  name?: string;
  type?: string;
}

const ImageUploadSingle: React.FC<ImageUploadSingleProps> = ({
  file,
  onFileSelect,
  accept = "image/*",
  type = "image",
  name,
}) => {
  const fileUploadRef = useRef<FileUpload>(null);
  const [totalSize, setTotalSize] = useState(file ? file.size : 0);

  const onTemplateSelect = (e: { files: File[] }) => {
    const selectedFile = e.files[0];

    if (!selectedFile) {
      return;
    }

    onFileSelect(selectedFile); // Kirim file ke komponen Page
    setTotalSize(selectedFile.size); // Update totalSize saat file dipilih
  };

  const onTemplateRemove = (callback: Function) => {
    onFileSelect(null as any);
    setTotalSize(0);
    callback();
  };

  const headerTemplate = (options: {
    className: string;
    chooseButton: JSX.Element;
    cancelButton: JSX.Element;
  }) => {
    const { className, chooseButton, cancelButton } = options;
    const value = totalSize / 20000;
    const formattedValue =
      fileUploadRef.current?.formatSize(totalSize) || "0 B";

    return (
      <div
        className={`${className} flex items-center justify-between`}
        style={{ padding: "8px 10px" }}
      >
        <div className="flex items-center gap-2">
          {chooseButton}
          {cancelButton}
        </div>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: "0.9em" }}>{formattedValue} / 2 MB</span>
          <ProgressBar
            value={value}
            showValue={false}
            style={{ width: "8rem", height: "8px" }}
          />
        </div>
      </div>
    );
  };

  const onTemplateClear = () => {
    onFileSelect(null as any);
    setTotalSize(0);
  };

  const itemTemplate = (file: object, options: ItemTemplateOptions) => {
    const fileObj = file as File;
    const fileType = fileObj.type;

    const isExcelFile =
      fileType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      fileType === "text/csv";

    return (
      <div className="flex items-center p-2" style={{ maxWidth: "100%" }}>
        <div className="flex items-center" style={{ width: "30%" }}>
          {isExcelFile ? (
            <div className="me-2">
              <svg
                width="31"
                height="30"
                viewBox="0 0 31 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_1704_35107)">
                  <path
                    d="M18.2363 3.8125V8.78466C18.2363 9.11434 18.3673 9.43051 18.6004 9.66362C18.8335 9.89674 19.1497 10.0277 19.4794 10.0277H24.4515"
                    stroke="#08B839"
                    stroke-width="1.86456"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M21.9653 26.1872H9.53491C8.87556 26.1872 8.24322 25.9253 7.77698 25.4591C7.31075 24.9928 7.04883 24.3605 7.04883 23.7011V6.29858C7.04883 5.63923 7.31075 5.00689 7.77698 4.54066C8.24322 4.07443 8.87556 3.8125 9.53491 3.8125H18.2362L24.4514 10.0277V23.7011C24.4514 24.3605 24.1895 24.9928 23.7232 25.4591C23.257 25.9253 22.6247 26.1872 21.9653 26.1872Z"
                    stroke="#08B839"
                    stroke-width="1.86456"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M10.7773 13.7568H20.7217V22.4581H10.7773V13.7568Z"
                    stroke="#08B839"
                    stroke-width="1.86456"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M10.7773 18.729H20.7217"
                    stroke="#08B839"
                    stroke-width="1.86456"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M14.5059 13.7568V22.4581"
                    stroke="#08B839"
                    stroke-width="1.86456"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1704_35107">
                    <rect
                      width="29.833"
                      height="29.833"
                      fill="white"
                      transform="translate(0.832031 0.0834961)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
          ) : (
            <Image
              alt={fileObj.name}
              src={URL.createObjectURL(fileObj)}
              width={70}
              height={70}
              onLoad={() => URL.revokeObjectURL(URL.createObjectURL(fileObj))}
              style={{ borderRadius: "8px", marginRight: "10px" }}
            />
          )}
          <div className="flex flex-col text-left">
            <span style={{ fontSize: "0.9em" }}>{fileObj.name}</span>
            <small>{new Date().toLocaleDateString()}</small>
          </div>
        </div>
        <Button
          type="button"
          icon="pi pi-times"
          className="p-button-outlined p-button-rounded p-button-danger ml-auto"
          style={{ fontSize: "0.8em", padding: "0.4rem" }}
          onClick={(e) => onTemplateRemove(() => options.onRemove(e))}
        />
      </div>
    );
  };

  const emptyTemplate = () => (
    <div>
      {type == "image" ? (
        <div className="flex flex-col items-center p-3">
          <i className="pi pi-image mt-3 p-3" style={{ fontSize: "3em" }}></i>
          <span style={{ fontSize: "1em" }}>Drag and Drop Image Here</span>
        </div>
      ) : (
        <div className="flex flex-col items-center p-3">
          <div className="mt-3 p-3" style={{ fontSize: "3em" }}>
            <svg
              width="31"
              height="31"
              viewBox="0 0 31 31"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_1704_35099)">
                <path
                  d="M9.28349 23.2837C7.73252 23.2837 6.24507 22.6944 5.14837 21.6453C4.05167 20.5963 3.43555 19.1735 3.43555 17.69C3.43555 16.2065 4.05167 14.7837 5.14837 13.7347C6.24507 12.6857 7.73252 12.0963 9.28349 12.0963C9.64979 10.4644 10.7214 9.03035 12.2625 8.10954C13.0256 7.6536 13.8811 7.3374 14.7799 7.179C15.6788 7.02059 16.6036 7.02308 17.5014 7.18632C18.3992 7.34955 19.2525 7.67035 20.0125 8.13038C20.7726 8.59041 21.4245 9.18067 21.9311 9.86747C22.4377 10.5543 22.7891 11.3241 22.9651 12.1331C23.1411 12.9421 23.1383 13.7744 22.9569 14.5824H24.2C25.3538 14.5824 26.4604 15.0408 27.2763 15.8567C28.0923 16.6726 28.5506 17.7792 28.5506 18.933C28.5506 20.0869 28.0923 21.1935 27.2763 22.0094C26.4604 22.8253 25.3538 23.2837 24.2 23.2837H22.9569"
                  stroke="#484848"
                  stroke-width="2.48608"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M11.7695 19.5548L15.4987 15.8257L19.2278 19.5548"
                  stroke="#484848"
                  stroke-width="2.48608"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M15.5 15.8257V27.013"
                  stroke="#484848"
                  stroke-width="2.48608"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_1704_35099">
                  <rect
                    width="29.833"
                    height="29.833"
                    fill="white"
                    transform="translate(0.583984 0.90918)"
                  />
                </clipPath>
              </defs>
            </svg>
          </div>
          <span style={{ fontSize: "1em" }}>Drag and Drop File Here</span>
        </div>
      )}
    </div>
  );

  const chooseOptions = {
    icon: "pi pi-fw pi-images",
    iconOnly: true,
    className: "custom-choose-btn p-button-rounded p-button-outlined",
  };

  const cancelOptions = {
    icon: "pi pi-fw pi-times",
    iconOnly: true,
    className:
      "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined",
    onClick: () => {
      setTotalSize(0); // Reset totalSize menjadi 0
    },
  };

  return (
    <FileUpload
      ref={fileUploadRef}
      name={name}
      multiple={false}
      accept={accept}
      maxFileSize={2000000}
      onSelect={onTemplateSelect}
      headerTemplate={headerTemplate}
      itemTemplate={itemTemplate}
      onError={onTemplateClear} // onError menangani file error (size)
      onClear={onTemplateClear}
      emptyTemplate={emptyTemplate}
      chooseOptions={chooseOptions}
      cancelOptions={cancelOptions}
      className="h-auto w-full"
    />
  );
};

export default ImageUploadSingle;
