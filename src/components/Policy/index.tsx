"use client";
import { Card } from 'primereact/card';

const Policy = () => {

  return (
    <div className="mt-0 py-0">
      <Card>
        <div className='mb-5'>
          <h2 className="text-[26px] font-bold leading-[30px] text-dark dark:text-white mb-3">Puspadaya</h2>
          <p className="text-m font-medium text-gray-400">Kami di PUSPADAYA berkomitmen untuk menjaga privasi dan keamanan data Anda. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda saat menggunakan aplikasi kami.</p>
        </div>
        <div className='mb-5'>
          <h2 className="text-[22px] font-bold leading-[30px] text-dark dark:text-white mb-3">1. Pengumpulan Data</h2>
          <p className="text-m font-medium text-gray-400">Kami hanya mengumpulkan informasi yang diperlukan untuk menjalankan aplikasi, seperti data pribadi (misalnya, nama dan alamat email). Semua informasi yang kami kumpulkan digunakan untuk memberikan layanan terbaik bagi Anda.</p>
        </div>
        <div className='mb-5'>
          <h2 className="text-[22px] font-bold leading-[30px] text-dark dark:text-white mb-3">2. Penggunaan Data</h2>
          <p className="text-m font-medium text-gray-400">Data yang kami kumpulkan digunakan untuk meningkatkan pengalaman pengguna dan memberikan layanan yang lebih baik. Kami tidak akan menjual atau membagikan data pribadi Anda kepada pihak ketiga tanpa izin Anda, kecuali jika diwajibkan oleh hukum.</p>
        </div>
        <div className='mb-8'>
          <h2 className="text-[22px] font-bold leading-[30px] text-dark dark:text-white mb-3">3. Keamanan Data</h2>
          <p className="text-m font-medium text-gray-400">Kami menggunakan langkah-langkah keamanan yang sesuai untuk melindungi data Anda dari akses yang tidak sah, perubahan, atau pengungkapan.</p>
        </div>
        <div>
          <p className="text-l font-medium text-gray-500">Jika Anda memiliki pertanyaan tentang Kebijakan Aplikasi ini, silakan hubungi kami di <br /><b>[ puspadaya.id@gmail.com || 0813348765434 ]</b></p>
        </div>

      </Card>
    </div>
  );
};

export default Policy;
