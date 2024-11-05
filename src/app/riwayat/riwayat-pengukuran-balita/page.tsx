import React from "react";
import { Metadata } from "next";
import TableRiwayatPengukuranBalita from "@/components/Tables/TableRiwayatPengukuranBalita";

export const metadata: Metadata = {
  title: "Riwayat Data Pengukuran Balita",
  description: "Riwayat Data Pengukuran Balita Page",
};

const TablesPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataWithDisplayId, setDataWithDisplayId] = useState<DataRow[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const toast = useRef<Toast>(null);
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    setLoading(true);
    try {
      const dummyData: DataRow[] = Array.from({ length: 680 }, (_, index) => ({
        id: index + 1,
        contact_ref: `Nama Lengkap ${index + 1}`, // Nama Lengkap
        nik: generateNIK(), // NIK acak 16 angka
        status: getRandomStatus(), // Status acak
      }));
      setDataWithDisplayId(dummyData);
    } catch (err) {
      setError("Error fetching data");
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to load data",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const generateNIK = (): string => {
    let nik = "";
    for (let i = 0; i < 16; i++) {
      nik += Math.floor(Math.random() * 10); // Menghasilkan angka 0-9
    }
    return nik;
  };

  const rowClassName = (data: DataRow) => {
    return data.id % 2 === 0
      ? "bg-gray-100 h-12 text-base text-black rounded-lg" // Added text-black
      : "bg-white h-12 text-base text-black rounded-lg"; // Added text-black
  };

  const getRandomStatus = () => {
    const statuses = Object.keys(statusColors);
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const handleEdit = (rowData: DataRow) => {
    console.log("Edit", rowData);
    toast.current?.show({
      severity: "info",
      summary: "Edit",
      detail: `Editing ${rowData.contact_ref}`,
      life: 3000,
    });
  };

  const actionBodyTemplate = (data: DataRow, options: ColumnBodyOptions) => {
    return (
      <ButtonLinks
        href={`/riwayat/riwayat-pengukuran-balita/view`}
        className="bg-[#486284] hover:bg-[#405672] focus-visible:ring-[#405672]"
      >
        <div className="flex items-center gap-1">
          <SvgDetailOrangTua />
          <span>Lihat Detail</span>
        </div>
      </ButtonLinks>
    );
  };

  const statusBodyTemplate = (rowData: DataRow) => {
    return (
      <span
        className={`${statusColors[rowData.status]} rounded-full px-3 py-1 text-sm font-medium`}
      >
        {rowData.status}
      </span>
    );
  };

  const header = (
    <div className="mb-1 flex flex-col md:flex-row md:items-center md:justify-between">
      <h2 className="pb-1 text-2xl font-bold text-black">
        Riwayat Pengukuran Balita
      </h2>
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
      </div>
    </div>
  );

const Page = () => {
  return (
    <>
      <div className="container mx-auto">
        <TableRiwayatPengukuranBalita />
      </div>
    </>
  );
};

export default Page;
