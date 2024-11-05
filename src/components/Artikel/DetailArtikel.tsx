"use client";
import Image from "next/image";
import dompurify from "dompurify"; // Import dompurify
import { useParams } from "next/navigation";

const DetailArtikel = () => {
  const { id } = useParams(); // useParams to get route parameters
  // Sample data (replace with actual fetched data)
  const article = {
    title: "Judul Artikel",
    content: "<p>Ini adalah konten dari artikel. Di sini Anda bisa menjelaskan berbagai hal yang relevan dengan topik artikel.</p>",
    images: [
      "/images/carousel/carousel-01.jpg", // Replace with actual image paths
    ],
  };

  // Sanitize content to prevent XSS
  const sanitizedContent = dompurify.sanitize(article.content);

  return (
    <div className="container mx-auto">
      <div className="mb-4">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="pb-1 text-2xl font-bold text-black">Detail Artikel </h2>
          <p className="text-sm font-medium text-gray-500">
            Detail Artikel Tentang {article.title}
          </p>
        </div>
      </div>
      {/* Card Wrapper */}
      <div className="overflow-hidden rounded-[10px] bg-white px-6 py-9 shadow-1">
        <h1 className="text-xl font-bold mb-4">{article.title}</h1>
        <div className="mb-4">
          {article.images.map((image, index) => (
            <Image 
              key={index} 
              src={image} 
              width={1024} 
              height={1024} 
              alt={`Image ${index + 1}`} 
              className="mb-2 w-full h-auto rounded-md shadow-sm" 
            />
          ))}
        </div>
        <div 
          className="text-gray-700" 
          dangerouslySetInnerHTML={{ __html: sanitizedContent }} // Render sanitized HTML content
        />
      </div>
    </div>
  );
};

export default DetailArtikel;
