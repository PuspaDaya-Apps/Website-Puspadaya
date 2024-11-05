// import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import React from "react";
import { InputText } from "primereact/inputtext";

// Tipe props untuk modal
type ModalProps = {
  isOpen: boolean;
  title: string;
  children: React.ReactNode; // Untuk menerima children element
  onClose: () => void;
  onConfirm?: () => void; // Tambahkan onConfirm sebagai optional prop
};

const Modal: React.FC<ModalProps> = ({ isOpen, title, children, onClose, onConfirm }) => {
  const footerContent = (
    <div>
      <Button label="Close" icon="pi pi-times" onClick={onClose} className="p-button-secondary" />
      {onConfirm && (
        <Button label="Confirm" icon="pi pi-check" onClick={onConfirm} className="p-button-primary" />
      )}
    </div>
  );

  return (
    <Dialog
      header={title}
      visible={isOpen}
      style={{ width: "50vw" }}
      onHide={onClose}
      footer={footerContent}
    >
      {children}
    </Dialog>
  );
};

export default Modal;
