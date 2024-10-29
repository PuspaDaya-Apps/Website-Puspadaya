"use client";
import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox"; // Import Checkbox
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { IconSearch } from "@tabler/icons-react";
import { SvgAdd, SvgEdit, SvgDelete } from "../ui/Svg";
import Modal from "../modal/modal";
import ModalDelete from "../modal/modalDelete";
import Role, { AccessRight } from "@/types/managementRole";

const TableManagementRole: React.FC = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null); // Define selectedRole
  const [formData, setFormData] = useState<Role>({
    id: 0,
    namaRole: "",
    accessRights: [],
    usersWithAccess: [],
  });

  const [dataRole, setDataRole] = useState<Role[]>([
    {
      id: 1,
      namaRole: "Admin",
      accessRights: [
        AccessRight.DASHBOARD_KETUA_KADER,
        AccessRight.CREATE_ORANG_TUA,
      ],
      usersWithAccess: [{ id: "1", name: "John Doe" }],
    },
  ]);

  const usersList = [
    { label: "John Doe", value: "1" },
    { label: "Jane Smith", value: "2" },
  ];

  const accessOptions = [
    {
      label: "Dashboard Ketua Kader",
      value: AccessRight.DASHBOARD_KETUA_KADER,
    },
    { label: "Create Data Orang Tua", value: AccessRight.CREATE_ORANG_TUA },
    { label: "Update Data Orang Tua", value: AccessRight.UPDATE_ORANG_TUA },
    { label: "Delete Data Orang Tua", value: AccessRight.DELETE_ORANG_TUA },
    { label: "Dashboard Anggota", value: AccessRight.DASHBOARD_ANGGOTA },
    { label: "Create Data Anggota", value: AccessRight.CREATE_ANGGOTA },
    { label: "Update Data Anggota", value: AccessRight.UPDATE_ANGGOTA },
    { label: "Delete Data Anggota", value: AccessRight.DELETE_ANGGOTA },
    { label: "Dashboard Bidan", value: AccessRight.DASHBOARD_BIDAN },
    { label: "Create Data Bidan", value: AccessRight.CREATE_BIDAN },
    { label: "Update Data Bidan", value: AccessRight.UPDATE_BIDAN },
    { label: "Delete Data Bidan", value: AccessRight.DELETE_BIDAN },
  ];

  const resetForm = () => {
    setFormData({
      id: 0,
      namaRole: "",
      accessRights: [],
      usersWithAccess: [],
    });
    setIsEditMode(false);
    setSelectedRole(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddOrUpdateData = () => {
    if (isEditMode && selectedRole) {
      const updatedData = dataRole.map((item) =>
        item.id === selectedRole.id ? { ...formData, id: item.id } : item,
      );
      setDataRole(updatedData);
    } else {
      const newRole = {
        ...formData,
        id: dataRole.length + 1,
      };
      setDataRole([...dataRole, newRole]);
    }

    setIsModalVisible(false);
    resetForm();
  };

  const handleEdit = (data: Role) => {
    setIsEditMode(true);
    setSelectedRole(data);
    setFormData(data);
    setIsModalVisible(true);
  };

  const handleDelete = (data: Role) => {
    setSelectedRole(data);
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (selectedRole) {
      setDataRole(dataRole.filter((item) => item.id !== selectedRole.id));
      setSelectedRole(null);
    }
  };

  const handleAccessRightChange = (value: AccessRight) => {
    setFormData((prevData) => {
      const accessRights = prevData.accessRights.includes(value)
        ? prevData.accessRights.filter((right) => right !== value) // Remove if already exists
        : [...prevData.accessRights, value]; // Add if not exists
      return { ...prevData, accessRights };
    });
  };

  const handleUserChange = (e: { value: string }) => {
    setFormData((prevData) => ({
      ...prevData,
      usersWithAccess: [
        {
          id: e.value,
          name: usersList.find((u) => u.value === e.value)?.label || "",
        },
      ],
    }));
  };

  const header = (
    <div className="mb-1 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="pb-1 text-2xl font-bold text-black">Management Role</h2>
        <p className="text-normal font-normal text-gray-500">
          Mengelola hak akses pengguna sesuai dengan peran dalam sistem
        </p>
      </div>
      <div className="mt-2 flex items-center justify-end space-x-4 md:mt-0">
        <span className="relative flex items-center">
          <IconSearch className="absolute left-3 text-gray-500" />
          <InputText
            type="search"
            onInput={(e) =>
              setGlobalFilter((e.target as HTMLInputElement).value)
            }
            placeholder="Search..."
            className="rounded-lg border border-gray-300 py-2 pl-10 pr-4"
          />
        </span>
        <div
          className="flex cursor-pointer items-center justify-center rounded-md border p-[10px]"
          onClick={() => {
            resetForm();
            setIsModalVisible(true);
          }}
        >
          <SvgAdd />
        </div>
      </div>
    </div>
  );

  const actionTemplate = (data: Role) => (
    <div className="flex items-center gap-2">
      <div className="cursor-pointer" onClick={() => handleEdit(data)}>
        <SvgEdit />
      </div>
      <div className="cursor-pointer" onClick={() => handleDelete(data)}>
        <SvgDelete />
      </div>
    </div>
  );

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <div className="max-w-full overflow-x-auto">
        <DataTable
          value={dataRole}
          dataKey="id"
          paginator
          rows={5}
          className="datatable-responsive"
          header={header}
          globalFilter={globalFilter}
          globalFilterFields={["namaRole"]}
        >
          <Column field="id" header="No" />
          <Column field="namaRole" header="Nama Role" />
          <Column header="Aksi" body={actionTemplate} />
        </DataTable>
      </div>

      <Modal
        isOpen={isModalVisible}
        title={isEditMode ? "Edit Role" : "Tambah Role"}
        onClose={() => {
          setIsModalVisible(false);
          resetForm();
        }}
        onConfirm={handleAddOrUpdateData}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="namaRole">Nama Role</label>
            <InputText
              id="namaRole"
              name="namaRole"
              value={formData.namaRole}
              onChange={handleInputChange}
              className="w-full mt-1"
            />
          </div>
          <div>
            <label>Hak Akses</label>
            <div className="grid grid-cols-3 gap-3">
              {accessOptions.map((option) => (
                <div key={option.value} className="flex mt-1 items-center gap-2">
                  <Checkbox
                    inputId={option.value}
                    value={option.value}
                    onChange={() => handleAccessRightChange(option.value)}
                    checked={formData.accessRights.includes(option.value)}
                  />
                  <label htmlFor={option.value}>{option.label}</label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label>Pengguna yang Diberikan Hak Akses</label>
            <Dropdown
              value={formData.usersWithAccess[0]?.id || ""}
              options={usersList}
              onChange={handleUserChange}
              placeholder="Pilih Pengguna"
              className="w-full mt-1"
            />
          </div>
        </div>
      </Modal>

      <ModalDelete
        visible={isDeleteModalVisible}
        onHide={() => setIsDeleteModalVisible(false)}
        onConfirm={confirmDelete}
        headerTitle="Konfirmasi Hapus"
      >
        <p>
          Apakah Anda yakin ingin menghapus role{" "}
          <strong>{selectedRole?.namaRole}</strong>?
        </p>
      </ModalDelete>
    </div>
  );
};

export default TableManagementRole;
