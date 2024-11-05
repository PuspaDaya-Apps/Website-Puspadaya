// import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import React from "react";
import 'primeicons/primeicons.css';

// Tipe props untuk ModalSearch
type ModalSearchProps = {
  isOpen: boolean;
  title: string;
  children: React.ReactNode; // Untuk menerima children element
  onClose: () => void;
  onSearch?: () => void; // Tambahkan onSearch sebagai optional prop
};

const ModalSearch: React.FC<ModalSearchProps> = ({ isOpen, title, children, onClose, onSearch }) => {
  const footerContent = (
    <div>
      <Button label="Tutup" icon="pi pi-times" onClick={onClose} className="p-button-secondary" />
      {onSearch && (
        <Button label="Cari" icon="pi pi-search" onClick={onSearch} className="p-button-primary" />
      )}
      <Button label="Konfirmasi" icon="pi pi-check" onClick={onClose} className="p-button-secondary" />
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

export default ModalSearch;
