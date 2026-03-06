"use client";
import React, { useState } from "react";
import { useSeniorMode } from "@/contexts/SeniorModeContext";

interface AccessibilityControlsProps {
  onPrint: () => void;
  onSpeak: () => void;
  isSpeaking: boolean;
}

const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({
  onPrint,
  onSpeak,
  isSpeaking,
}) => {
  const { isSeniorMode, toggleSeniorMode, fontSize, setFontSize, highContrast, toggleHighContrast } = useSeniorMode();
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStartY(clientY);
    setDragOffset(position.top);
  };

  // Handle drag move
  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaY = clientY - dragStartY;
    const newPosition = Math.max(80, Math.min(window.innerHeight - 200, dragOffset + deltaY));
    setPosition({ top: newPosition });
  };

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Add global event listeners for drag
  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove);
      window.addEventListener('touchend', handleDragEnd);
    } else {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, dragStartY, dragOffset]);

  return (
    <>
      {/* Burger Button - Bisa ditarik */}
      <button
        onClick={() => !isDragging && setIsOpen(!isOpen)}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        className={`fixed right-0 z-50 flex h-16 w-16 items-center justify-center rounded-l-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transition ${
          isDragging ? "cursor-grabbing" : "cursor-grab hover:from-blue-700 hover:to-indigo-700"
        }`}
        style={{ top: `${position.top}px` }}
      >
        {isOpen ? (
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="flex flex-col gap-1.5">
            <div className="h-1.5 w-8 rounded-full bg-white"></div>
            <div className="h-1.5 w-8 rounded-full bg-white"></div>
            <div className="h-1.5 w-8 rounded-full bg-white"></div>
          </div>
        )}
      </button>

      {/* Panel - Muncul saat isOpen */}
      {isOpen && (
        <div
          className="fixed right-0 z-40 mr-14 w-80 rounded-lg bg-white p-4 shadow-2xl transition-all duration-300 ease-in-out border-2 border-gray-300"
          style={{ top: `${position.top}px` }}
        >
          <div className="mb-3 flex items-center justify-between border-b pb-2">
            <h3 className="text-lg font-bold text-gray-800">⚙️ Pengaturan</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded p-1 text-gray-500 hover:bg-gray-100"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Senior Mode Toggle */}
          <button
            onClick={toggleSeniorMode}
            className={`w-full mb-2 rounded-lg px-4 py-3 text-base font-bold transition ${
              isSeniorMode
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {isSeniorMode ? "✓ Mode Senior AKTIF" : "Mode Senior"}
          </button>

          {/* High Contrast Toggle */}
          <button
            onClick={toggleHighContrast}
            className={`w-full mb-3 rounded-lg px-4 py-3 text-base font-bold transition ${
              highContrast
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {highContrast ? "✓ Kontras Tinggi" : "Kontras Tinggi"}
          </button>

          {/* Font Size Selector */}
          <div className="mb-4 rounded-lg bg-gray-50 p-3">
            <p className="mb-2 text-sm font-bold text-gray-700">Ukuran Font:</p>
            <div className="flex gap-2">
              <button
                onClick={() => setFontSize("normal")}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold ${
                  fontSize === "normal"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Normal
              </button>
              <button
                onClick={() => setFontSize("large")}
                className={`flex-1 rounded-lg px-3 py-2 text-base font-bold ${
                  fontSize === "large"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Besar
              </button>
              <button
                onClick={() => setFontSize("xlarge")}
                className={`flex-1 rounded-lg px-3 py-2 text-base font-bold ${
                  fontSize === "xlarge"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                XL
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 border-t pt-3">
            <button
              onClick={onPrint}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-base font-bold text-white hover:bg-blue-700 transition"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              📄 Cetak Laporan
            </button>
            <button
              onClick={onSpeak}
              className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-base font-bold text-white transition ${
                isSpeaking
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isSpeaking ? (
                <>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  </svg>
                  ⏹️ Stop Baca
                </>
              ) : (
                <>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                  🔊 Baca Dashboard
                </>
              )}
            </button>
          </div>

          {/* Info Footer */}
          <div className="mt-3 rounded-lg bg-blue-50 p-2 text-center">
            <p className="text-xs text-gray-600">
              💡 Tips: Klik tombol burger untuk tutup panel
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AccessibilityControls;
