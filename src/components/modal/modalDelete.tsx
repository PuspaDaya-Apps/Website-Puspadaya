import React, { ReactNode } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

interface ModalDeleteProps {
  visible: boolean;
  onHide: () => void;
  onConfirm: () => void;
  headerTitle: string;
  children: ReactNode;
}

const ModalDelete: React.FC<ModalDeleteProps> = ({
  visible,
  onHide,
  onConfirm,
  headerTitle,
  children
}) => {
  const footerContent = (
    <div>
      <Button
        label="Batal"
        icon="pi pi-times"
        onClick={onHide}
        className="p-button-text"
      />
      <Button
        label="Hapus"
        icon="pi pi-trash"
        onClick={() => {
          onConfirm();
          onHide();
        }}
        className="p-button-danger"
        autoFocus
      />
    </div>
  );

  return (
    <Dialog
      header={headerTitle}
      visible={visible}
      style={{ width: "400px" }}
      onHide={onHide}
      footer={footerContent}
      modal
    >
      {children}
    </Dialog>
  );
};

export default ModalDelete;