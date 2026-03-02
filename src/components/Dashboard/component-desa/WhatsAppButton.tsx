"use client";
import React, { useState } from "react";
import { sendViaWhatsAppWeb, sendWhatsAppMessage } from "@/app/api/whatsapp/whatsapp";
import { WhatsAppTemplate, formatWhatsAppMessage } from "@/types/whatsapp";

interface WhatsAppButtonProps {
  phoneNumber: string;
  recipientName?: string;
  template?: WhatsAppTemplate;
  templateData?: Record<string, string>;
  customMessage?: string;
  buttonVariant?: "primary" | "secondary" | "outline" | "icon";
  buttonText?: string;
  iconOnly?: boolean;
  onSent?: () => void;
  className?: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber,
  recipientName,
  template,
  templateData = {},
  customMessage,
  buttonVariant = "primary",
  buttonText,
  iconOnly = false,
  onSent,
  className = "",
}) => {
  const [isSending, setIsSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Generate message
  const message = customMessage || (template ? formatWhatsAppMessage(template, templateData) : "");

  // Button variants
  const variantClasses = {
    primary: "bg-green-600 hover:bg-green-700 text-white",
    secondary: "bg-green-100 hover:bg-green-200 text-green-800",
    outline: "border-2 border-green-600 text-green-600 hover:bg-green-50",
    icon: "bg-green-600 hover:bg-green-700 text-white p-2 rounded-full",
  };

  // Handle send
  const handleSend = async () => {
    if (!message || !phoneNumber) return;

    setIsSending(true);

    try {
      // OPTION 1: Direct to WhatsApp Web (Recommended for now)
      // Ini akan buka WhatsApp Web dengan message yang sudah terketik
      // User tinggal tekan Enter untuk kirim
      sendViaWhatsAppWeb(phoneNumber, message);
      
      // Log the action
      onSent?.();
      setShowPreview(false);
      
      // Show success notification
      alert("✅ WhatsApp Web terbuka!\n\nMessage sudah terketik otomatis.\nSilakan tekan Enter untuk kirim.");
      
    } catch (error) {
      console.error("Error sending WhatsApp:", error);
      alert("❌ Gagal membuka WhatsApp Web.\n\nPastikan Anda sudah login WhatsApp Web di browser.");
    } finally {
      setIsSending(false);
    }
  };

  // Icon SVG
  const WhatsAppIcon = () => (
    <svg
      className="h-5 w-5"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );

  const PreviewIcon = () => (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );

  const SendIcon = () => (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
      />
    </svg>
  );

  return (
    <>
      {/* Button */}
      <div className={`inline-flex items-center ${className}`}>
        {iconOnly ? (
          <button
            onClick={() => setShowPreview(true)}
            disabled={isSending}
            className={`flex items-center justify-center transition ${variantClasses.icon} ${
              isSending ? "opacity-50 cursor-not-allowed" : ""
            }`}
            title="Kirim WhatsApp"
          >
            <WhatsAppIcon />
          </button>
        ) : (
          <button
            onClick={() => setShowPreview(true)}
            disabled={isSending}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${variantClasses[buttonVariant]} ${
              isSending ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <WhatsAppIcon />
            {buttonText || "Kirim WhatsApp"}
          </button>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl dark:bg-gray-dark">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-dark dark:text-white">
                Preview Pesan WhatsApp
              </h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Recipient Info */}
            <div className="mb-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Kepada:{" "}
                <span className="font-medium text-dark dark:text-white">
                  {recipientName || phoneNumber}
                </span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Nomor:{" "}
                <span className="font-medium text-dark dark:text-white">
                  {phoneNumber}
                </span>
              </p>
            </div>

            {/* Message Preview */}
            <div className="mb-4 max-h-96 overflow-y-auto rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
              <div className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
                {message}
              </div>
            </div>

            {/* Character Count */}
            <div className="mb-4 text-right text-xs text-gray-500 dark:text-gray-400">
              {message.length} karakter
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowPreview(false)}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Batal
              </button>
              <button
                onClick={handleSend}
                disabled={isSending}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <SendIcon />
                    Kirim Sekarang
                  </>
                )}
              </button>
            </div>

            {/* Info */}
            <p className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
              Pesan akan dikirim melalui WhatsApp Web atau API
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default WhatsAppButton;
