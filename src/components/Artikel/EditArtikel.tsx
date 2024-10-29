"use client"; // This directive allows the use of client-side features
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import Image from "next/image";
import { FileUpload, ItemTemplateOptions } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { Editor } from "primereact/editor";
import { ProgressBar } from "primereact/progressbar";
import { useRef, useState, useEffect } from "react";
import { Tag } from "primereact/tag";
import {  } from "next/router"; // Import useRouter to get the article ID from the URL
import { RadioButton } from "primereact/radiobutton";
import { useParams, useRouter } from "next/navigation";

const EditArtikel = () => {
  const router = useRouter(); // Initialize useRouter
  const { id } = useParams(); // useParams to get route parameters
  const [text, setText] = useState("");
  const [judulArtikel, setJudulArtikel] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const toast = useRef<Toast>(null);
  const fileUploadRef = useRef<FileUpload>(null);
  const [StatusPublish, setStatusPublish] = useState<boolean>(false);
  const [totalSize, setTotalSize] = useState<number>(0);

  // Fetch article data when the component mounts
  useEffect(() => {
    const fetchArticleData = async () => {
      const response = await fetch(`/api/artikel/${id}`);
      if (response.ok) {
        const data = await response.json();
        setJudulArtikel(data.judulArtikel);
        setText(data.text);
        if (data.files && data.files.length > 0) {
          setFiles(data.files);
          setTotalSize(
            data.files.reduce((sum: number, file: any) => sum + file.size, 0),
          );
        }
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Gagal memuat data artikel",
        });
      }
    };

    fetchArticleData();
  }, [id]);

  // Single file selection
  const onTemplateSelect = (e: { files: File[] }) => {
    const file = e.files[0]; // Only take the latest file
    setTotalSize(file.size); // Set total size with the latest file size
    setFiles([file]); // Set files array only with the latest file
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("judulArtikel", judulArtikel);
    formData.append("text", text);
    formData.append("status_publikasi", StatusPublish ? "true" : "false");
    files.forEach((file) => formData.append("files", file)); // Add each file to formData

    try {
      const response = await fetch(`/api/post_artikel/${id}`, {
        // Update the article
        method: "PUT", // Use PUT for updating existing articles
        body: formData,
      });

      if (response.ok) {
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Artikel berhasil disimpan",
        });
        router.push("/data/data-artikel"); // Redirect after saving
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Gagal menyimpan artikel",
        });
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Terjadi kesalahan saat menyimpan artikel",
      });
    }
  };

  const onTemplateRemove = (file: File, callback: Function) => {
    setTotalSize(0); // Set total size to 0 after file removal if single, not if multiple
    callback(); // Continue the removal process
  };

  const headerTemplate = (options: {
    className: string;
    chooseButton: JSX.Element;
    uploadButton: JSX.Element;
    cancelButton: JSX.Element;
  }) => {
    const { className, chooseButton, cancelButton } = options;
    const value = totalSize / 20000;
    const formattedValue =
      fileUploadRef.current?.formatSize(totalSize) || "0 B";

    return (
      <div
        className={className}
        style={{
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
        }}
      >
        {chooseButton}
        {cancelButton}
        <div className="align-items-center ml-auto flex gap-3">
          <span>{formattedValue} / 2 MB</span>
          <ProgressBar
            value={value}
            showValue={false}
            style={{ width: "10rem", height: "12px" }}
          />
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
            role="presentation"
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
        {/* <Tag
          value={fileUploadRef.current?.formatSize(fileObj.size)}
          severity="warning"
          className="px-3 py-2"
        /> */}
        <Button
          type="button"
          icon="pi pi-times"
          className="p-button-outlined p-button-rounded p-button-danger ml-auto"
          onClick={(e) => onTemplateRemove(fileObj, () => options.onRemove(e))}
        />
      </div>
    );
  };

  const onTemplateClear = () => {
    setTotalSize(0);
  };
  const emptyTemplate = () => (
    <div className="justify-center items-center flex">
      <div className="flex flex-col items-center p-3">
          <i className="pi pi-image mt-3 p-3" style={{ fontSize: "3em" }}></i>
          <span style={{ fontSize: "1em" }}>Drag and Drop Image Here</span>
        </div>
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
  };

  return (
    <div className="container mx-auto">
      <div className="mb-4">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="pb-1 text-2xl font-bold text-black">Edit Artikel</h2>
          <p className="text-sm font-medium text-gray-500">
            Ubah data artikel bermanfaat seputar kesehatan
          </p>
        </div>
      </div>
      <div className="overflow-hidden rounded-[10px] bg-white px-10 py-9 pt-6 shadow-1">
        <div>
          <Toast ref={toast}></Toast>
          <FileUpload
            ref={fileUploadRef}
            name="demo[]"
            multiple={true}
            accept="image/*"
            maxFileSize={2000000}
            onSelect={onTemplateSelect}
            headerTemplate={headerTemplate}
            itemTemplate={itemTemplate}
            emptyTemplate={emptyTemplate}
            onError={onTemplateClear} onClear={onTemplateClear}
            chooseOptions={chooseOptions}
            cancelOptions={cancelOptions}
          />
          <div className="mb-3 w-full">
            <label htmlFor="judulArtikel">Judul Artikel</label>
            <InputText
              id="judulArtikel"
              name="judulArtikel"
              value={judulArtikel}
              onChange={(e) => setJudulArtikel(e.target.value)}
              inputMode="text"
              className="mt-2 w-full"
            />
          </div>
          <div className="mb-3 flex flex-col gap-3">
            <label htmlFor="judulArtikel">Status Publikasi</label>
            <div className="items-center flex">
              <RadioButton
                inputId="statusTrue"
                name="statusPublish"
                value={true}
                onChange={(e) => setStatusPublish(e.value)}
                checked={StatusPublish === true}
              />
              <label htmlFor="statusTrue" className="ml-2">
                Iya, Publish Artikel
              </label>
            </div>
            <div className="items-center flex">
              <RadioButton
                inputId="ingredient2"
                name="statusPublish"
                value={false}
                onChange={(e) => setStatusPublish(e.value)}
                checked={StatusPublish === false}
              />
              <label htmlFor="ingredient2" className="ml-2">
                Tidak, Tidak Publish Artikel Untuk Sekarang
              </label>
            </div>
          </div>
          <div className="card">
            <Editor
              value={text}
              onTextChange={(e) => setText(e.htmlValue ?? "")}
              style={{ height: "320px" }}
            />
          </div>
          <div className="mt-14 flex items-center justify-center px-4">
            <Button
              label="Simpan"
              className="w-full max-w-[370px] bg-[#486284]"
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditArtikel;
