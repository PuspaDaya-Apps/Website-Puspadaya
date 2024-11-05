"use client";
import { FileUpload } from "primereact/fileupload";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";
import { useRef, useState, useEffect } from "react";
import { ItemTemplateOptions } from "primereact/fileupload";
import Image from "next/image";

interface ImageUploadMultipleProps {
  initialFiles?: File[]; // Optional initial files
  onFileSelect: (files: File[]) => void; // Callback when files are selected or removed
}

const ImageUploadMultiple: React.FC<ImageUploadMultipleProps> = ({ initialFiles = [], onFileSelect }) => {
  const [files, setFiles] = useState<File[]>(initialFiles);
  const fileUploadRef = useRef<FileUpload>(null);
  const [totalSize, setTotalSize] = useState<number>(0);

  useEffect(() => {
    // Update totalSize whenever files change
    const newTotalSize = files.reduce((sum, file) => sum + file.size, 0);
    setTotalSize(newTotalSize);
    onFileSelect(files); // Trigger callback when files change
  }, [files, onFileSelect]);

  const onTemplateSelect = (e: { files: File[] }) => {
    setFiles((prevFiles) => [...prevFiles, ...e.files]); // Add new files to the files state
  };

  const onTemplateRemove = (file: File, callback: Function) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f !== file)); // Remove file from state
    callback();
  };

  const onTemplateClear = () => {
    setTotalSize(0);
  };

  const headerTemplate = (options: {
    className: string;
    chooseButton: JSX.Element;
    cancelButton: JSX.Element;
  }) => {
    const { className, chooseButton, cancelButton } = options;
    const value = totalSize / 20000;
    const formattedValue = fileUploadRef.current?.formatSize(totalSize) || "0 B";

    return (
      <div className={className} style={{ display: "flex", alignItems: "center" }}>
        {chooseButton}
        {cancelButton}
        <div className="align-items-center ml-auto flex gap-3">
          <span>{formattedValue} / 2 MB</span>
          <ProgressBar value={value} showValue={false} style={{ width: "10rem", height: "12px" }} />
        </div>
      </div>
    );
  };

  const itemTemplate = (file: object, options: ItemTemplateOptions) => {
    const fileObj = file as File;
    const imageUrl = URL.createObjectURL(fileObj);

    return (
      <div className="align-items-center flex flex-wrap">
        <div className="align-items-center flex" style={{ width: "40%" }}>
          <Image
            alt={fileObj.name}
            src={imageUrl}
            width={100}
            height={100}
            onLoad={() => URL.revokeObjectURL(imageUrl)}
          />
          <span className="flex-column ml-3 flex text-left">
            {fileObj.name}
            <small>{new Date().toLocaleDateString()}</small>
          </span>
        </div>
        <Button
          type="button"
          icon="pi pi-times"
          className="p-button-outlined p-button-rounded p-button-danger ml-auto"
          onClick={(e) => onTemplateRemove(fileObj, () => options.onRemove(e))}
        />
      </div>
    );
  };

  const emptyTemplate = () => (
    <div className="flex flex-col items-center p-3">
      <i className="pi pi-image mt-3 p-3" style={{ fontSize: "3em" }}></i>
      <span style={{ fontSize: "1em" }} className="my-5">
        Drag and Drop Image Here
      </span>
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
    className: "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined",
  };

  return (
    <FileUpload
      ref={fileUploadRef}
      name="demo[]"
      multiple={true}
      accept="image/*"
      maxFileSize={2000000}
      onSelect={onTemplateSelect}
      onError={onTemplateClear} onClear={onTemplateClear}
      headerTemplate={headerTemplate}
      itemTemplate={itemTemplate}
      emptyTemplate={emptyTemplate}
      chooseOptions={chooseOptions}
      cancelOptions={cancelOptions}
    />
  );
};

export default ImageUploadMultiple;
