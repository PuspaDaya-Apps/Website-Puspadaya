import { IconCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";
import Modal from "./Modal";

const factors = [
  {
    title: "Ketersediaan Air Bersih",
    description: (
      <p className="text-justify">
        <img
          src="/images/dropdown/airbersih.svg"
          alt="Air Bersih"
          width={400}
          height={400}
          className="mb-3 mx-auto"
        />
        Berdasarkan hasil Studi Kualitas Air Minum Rumah Tangga (SKAMRT) dari
        Kementerian Kesehatan pada tahun 2020 menyatakan bahwa 7 dari 10 rumah
        tangga Indonesia mengonsumsi air minum yang terkontaminasi bakteri
        Escherichia coli (E-coli).
        Mengingat air juga merupakan komponen utama penyusun tubuh manusia,
        ancaman krisis air bersih dan layak minum sudah seharusnya menjadi
        perhatian. Namun di Indonesia, menurut Kementerian Perencanaan
        Pembangunan Nasional menjelaskan bahwa capaian sanitasi aman Indonesia
        masih sangat rendah. Angka sanitasi aman Indonesia yaitu baru mencapai
        7% di tahun 2020.
      </p>
    ),
    icon: (
      <img
        src="/images/menus/water.svg"
        alt="Water"
        width={30}
        height={30}
        className="fill-current"
      />
    ),
    image: "/images/dropdown/airbersih.svg",
  },
  {
    title: "Penyakit Penyerta Balita",
    description: (
      <p className="text-justify">
        <img
          src="/images/dropdown/bayi.svg"
          alt="Air Bersih"
          width={400}
          height={400}
          className="mb-3 mx-auto"
        />
        Penyakit penyerta pada balita merujuk pada kondisi medis yang sering
        muncul bersamaan dengan penyakit utama, mempengaruhi kesehatan dan
        perkembangan anak. Beberapa penyakit penyerta umum meliputi: Infeksi
        Saluran Pernapasan, Alergi dan Asma, Gangguan Pencernaan, Penyakit
        Kulit, Gangguan Tumbuh Kembang Penting bagi orang tua untuk memantau kesehatan balita secara menyeluruh
        dan berkonsultasi dengan tenaga medis untuk penanganan yang tepat.
        Pengawasan rutin dan vaksinasi juga sangat penting untuk mencegah
        penyakit dan komplikasi yang lebih serius.
      </p>
    ),
    icon: (
      <img
        src="/images/menus/Daze.svg"
        alt="Daze"
        width={30}
        height={30}
        className="fill-current"
      />
    ),
  },
  {
    title: "Jamban Sehat",
    description: (
      <p className="text-justify">
        <img
          src="/images/dropdown/wc.svg"
          alt="Air Bersih"
          width={400}
          height={400}
          className="mb-3 mx-auto"
        />
        Pentingnya penggunaan jamban sehat adalah untuk mencegah penyebaran
        penyakit melalui air dan menjaga kebersihan lingkungan. Jamban sehat
        harus memenuhi standar dan persyaratan kesehatan, serta mudah dijangkau
        oleh penghuni rumah.
        Berdasarkan Permenkes No. 3 Tahun 2014 tentang STBM bahwa kondisi jamban
        yang saniter merupakan kondisi fasilitas sanitasi yang memenuhi standar
        dan persyaratan kesehatan yaitu: a. Tidak mengakibatkan terjadinya
        penyebaran langsung bahan-bahan yang berbahaya bagi manusia akibat
        pembuangan kotoran manusia; dan b. Dapat mencegah vektor pembawa
        penyakit untuk menyebarkan penyakit pada pemakai dan lingkungan
        sekitarnya.
      </p>
    ),
    icon: (
      <img
        src="/images/menus/jamban.svg"
        alt=""
        width={30}
        height={30}
        className="fill-current"
      />
    ),
  },
  {
    title: "Penyakit Infeksi",
    description: (
      <p className="text-justify">
        <img
          src="/images/dropdown/infeksi.svg"
          alt="Air Bersih"
          width={400}
          height={400}
          className="mb-3 mx-auto"
        />
        Penyakit infeksi adalah kondisi yang disebabkan oleh mikroorganisme
        patogen, seperti bakteri, virus, jamur, atau parasit, yang masuk ke
        dalam tubuh dan menyebabkan gangguan kesehatan. Gejala penyakit infeksi
        sangat bervariasi tergantung pada jenis infeksi dan bagian tubuh yang
        terpengaruh. Beberapa gejala umum meliputi: demam, nyeri, kelelahan,
        batuk, dan mual.
        Penyakit infeksi dapat memiliki dampak signifikan pada kesehatan
        individu, terutama pada anak-anak dan orang dengan sistem imun yang
        lemah. Oleh karena itu, penting untuk mengenali gejala, mendapatkan
        diagnosis yang tepat, dan mengikuti penanganan medis yang dianjurkan.
      </p>
    ),
    icon: (
      <img
        src="/images/menus/infeksi.svg"
        alt=""
        width={30}
        height={30}
        className="fill-current"
      />
    ),
  },
  {
    title: "Imunisasi",
    description: (
      <p className="text-justify">
        <img
          src="/images/dropdown/imunisasi.svg"
          alt="Air Bersih"
          width={400}
          height={400}
          className="mb-3 mx-auto"
        />
        Pelaksanaan imunisasi kejar atau catch-up immunization perlu dipahami
        oleh klinisi dengan baik agar perlindungan optimal terhadap penyakit
        menular dapat tercapai, termasuk pada anak yang belum atau terlambat
        mendapatkan imunisasi. Pada dasarnya, imunisasi perlu diberikan sesuai
        dengan jadwal yang telah ditentukan. Namun, banyak kondisi yang
        menyebabkan anak tidak mendapatkan imunisasi sesuai dengan jadwal yang
        ditentukan.
        Berdasarkan data Riset Kesehatan Dasar (Riskesdas), terjadi peningkatan
        prevalensi pneumonia pada populasi balita di Indonesia, yaitu dari 1,6%
        pada tahun 2013 menjadi 2% pada tahun 2018. Indonesia juga masih
        termasuk dalam 10 negara dengan kasus difteri tertinggi di dunia pada
        tahun 2000–2015, dengan angka yang meningkat tiap tahunnya.
      </p>
    ),
    icon: (
      <img
        src="/images/menus/imunisasi.svg"
        alt=""
        width={30}
        height={30}
        className="fill-current"
      />
    ),
  },
  {
    title: "BBLR",
    description: (
      <p className="text-justify">
        <img
          src="/images/dropdown/bblr.svg"
          alt="Air Bersih"
          width={400}
          height={400}
          className="mb-3 mx-auto"
        />
        Berat Badan Lahir Rendah (BBLR) adalah kondisi di mana bayi lahir dengan
        berat badan kurang dari 2.500 gram (2,5 kg) saat dilahirkan, terlepas
        dari usia kehamilan. BBLR dapat disebabkan oleh berbagai faktor yang
        berinteraksi secara kompleks. Misalnya, ibu yang mengalami malnutrisi
        atau memiliki penyakit tertentu, seperti diabetes atau hipertensi,
        berisiko lebih tinggi melahirkan bayi dengan BBLR.
        BBLR adalah kondisi yang dapat memiliki dampak serius pada kesehatan
        bayi, baik jangka pendek maupun jangka panjang. Penting bagi ibu hamil
        untuk mendapatkan perawatan prenatal yang baik, menjalani gaya hidup
        sehat, dan memantau kesehatan janin untuk meminimalkan risiko BBLR.
      </p>
    ),
    icon: (
      <img
        src="/images/menus/bblr.svg"
        alt=""
        width={30}
        height={30}
        className="fill-current"
      />
    ),
  },
  {
    title: "Merokok (Keluarga)",
    description: "No Description",
    icon: (
      <img
        src="/images/menus/rokok.svg"
        alt=""
        width={30}
        height={30}
        className="fill-current"
      />
    ),
  },
  {
    title: "Gangguan Tumbuh Kembang",
    description: (
      <p className="text-justify">
        <img
          src="/images/dropdown/gangguan.svg"
          alt="Air Bersih"
          width={400}
          height={400}
          className="mb-3 mx-auto"
        />
        Gangguan tumbuh kembang adalah kondisi yang memengaruhi kemampuan anak
        untuk tumbuh dan berkembang secara fisik, kognitif, atau emosional.
        Gangguan ini dapat memengaruhi berbagai aspek perkembangan anak,
        termasuk kemampuan motorik, dan bahasa, sosial. Ketika salah satu atau
        beberapa aspek ini terhambat, dapat muncul gangguan tumbuh kembang yang
        memerlukan perhatian dan intervensi khusus.
        Upaya pencegahan, deteksi dini, dan dukungan yang berkelanjutan sangat
        penting untuk membantu anak mencapai potensi maksimal mereka. Dengan
        dukungan yang tepat, anak-anak dengan gangguan tumbuh kembang dapat
        berkembang dan berfungsi dengan baik.
      </p>
    ),
    icon: (
      <img
        src="/images/menus/gangguan.svg"
        alt=""
        width={30}
        height={30}
        className="fill-current"
      />
    ),
  },
  {
    title: "Kecacingan",
    description: "No Description",
    icon: (
      <img
        src="/images/menus/cacing.svg"
        alt=""
        width={30}
        height={30}
        className="fill-current"
      />
    ),
  },
  {
    title: "Kemiskinan",
    description: "No Description",
    icon: (
      <img
        src="/images/menus/miskin.svg"
        alt=""
        width={30}
        height={30}
        className="fill-current"
      />
    ),
  },
  {
    title: "Riwayat Kehamilan Ibu",
    description: (
      <p className="text-justify">
        <img
          src="/images/dropdown/hamil.svg"
          alt="Air Bersih"
          width={400}
          height={400}
          className="mb-3 mx-auto"
        />
        Riwayat kehamilan ibu dapat dikaji pada Pengukuran obstetri pertama
        kali. Anamnesis pada ibu hamil meliputi: Identitas dan biodata ibu dan
        suami, Keluhan ibu, Penerimaan ibu terhadap kehamilannya,
        Ketidaknyamanan ibu akibat kehamilan. Selain itu, anamnesa juga dapat
        mencakup riwayat keluarga, seperti: Adakah penyakit keturunan dalam
        keluarga, Adakah riwayat anak kembar.
        Riwayat kehamilan yang bermasalah sebelumnya dapat berdampak negatif
        pada kehamilan berikutnya. Misalnya, riwayat kelahiran prematur dapat
        memicu gangguan pernapasan pada bayi dan berat badan lahir rendah
        (BBLR).
      </p>
    ),
    icon: (
      <img
        src="/images/menus/hamil.svg"
        alt=""
        width={30}
        height={30}
        className="fill-current"
      />
    ),
  },
  {
    title: "MPASI",
    description: "No Description",
    icon: (
      <img
        src="/images/menus/mpasi.svg"
        alt=""
        width={20}
        height={20}
        className="fill-current"
      />
    ),
  },
  {
    title: "Resiko 4T",
    description: "No Description",
    icon: (
      <img
        src="/images/menus/4t.svg"
        alt=""
        width={30}
        height={30}
        className="fill-current"
      />
    ),
  },
  {
    title: "Kurangnya Pengetahuan Gizi",
    description: "No Description",
    icon: (
      <img
        src="/images/menus/book.svg"
        alt=""
        width={30}
        height={30}
        className="fill-current"
      />
    ),
  },
  {
    title: "Kepesertaan KB (Setelah Melahirkan)",
    description: "No Description",
    icon: (
      <img
        src="/images/menus/kb.svg"
        alt=""
        width={30}
        height={30}
        className="fill-current"
      />
    ),
  },
  {
    title: "PHBS Kurang Optimal",
    description: "No Description",
    icon: (
      <img
        src="/images/menus/phbs.svg"
        alt=""
        width={30}
        height={30}
        className="fill-current"
      />
    ),
  },
  {
    title: "Pola Asuh yang Kurang Tepat",
    description: "No Description",
    icon: (
      <img
        src="/images/menus/asuh.svg"
        alt=""
        width={30}
        height={30}
        className="fill-current"
      />
    ),
  },
];

const FaktorStunting = () => {
  const [selectedFactor, setSelectedFactor] = useState<number | null>(null);
  const [status, setStatus] = useState<{ [key: number]: string }>({});

  const handleOpenModal = (index: number) => {
    setSelectedFactor(index);
  };

  const handleCloseModal = () => {
    setSelectedFactor(null);
  };

  const handleStatusChange = (index: number, value: string) => {
    setStatus((prev) => ({ ...prev, [index]: value }));
    handleCloseModal(); // Tutup modal setelah tombol dipilih
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {factors.map((factor, index) => (
        <div key={index} className="relative mt-2 p-2">
          <div className="flex flex-col rounded-lg bg-white p-4 shadow-md">
            <div className="flex items-start">
              <div className="mr-4 text-4xl text-blue-500">{factor.icon}</div>
              <div className="flex flex-grow items-center justify-between">
                <button
                  onClick={() => handleOpenModal(index)}
                  className="text-gray-600 focus:outline-none"
                >
                  <h3 className="text-base font-semibold text-gray-800">
                    {factor.title}
                  </h3>
                </button>
              </div>
            </div>
          </div>

          {/* Modal */}
          {selectedFactor === index && (
            <Modal onClose={handleCloseModal} size="large" height="500px" className="custom-modal">
              <div className="p-4">
                <div className="mb-4 flex items-center">
                  <div className="mr-2">{factor.icon}</div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {factor.title}
                  </h2>
                </div>
                <div className="mb-3 text-m text-gray-700">
                  {factor.description}
                </div>
                <div className="mt-5 flex items-center justify-center space-x-4">
                  <button
                    className={`flex h-10 w-30 items-center justify-center rounded text-sm ${
                      status[index] === "Ada"
                        ? "bg-green-500 text-white"
                        : "bg-gray-600 text-white"
                    }`}
                    onClick={() => handleStatusChange(index, "Ada")}
                  >
                    <IconCheck className="mr-2" size={20} /> Ada
                  </button>
                  <button
                    className={`flex h-10 w-30 items-center justify-center rounded text-sm ${
                      status[index] === "Tidak Ada"
                        ? "bg-red-500 text-white"
                        : "bg-gray-600 text-white"
                    }`}
                    onClick={() => handleStatusChange(index, "Tidak Ada")}
                  >
                    <IconX className="mr-2" size={20} /> Tidak Ada
                  </button>
                </div>
              </div>
            </Modal>
          )}
        </div>
      ))}
    </div>
  );
};

export default FaktorStunting;
