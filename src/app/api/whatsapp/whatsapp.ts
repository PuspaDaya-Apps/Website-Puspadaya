import {
  WhatsAppMessage,
  SendMessageResult,
  WhatsAppLog,
  WhatsAppStats,
  formatPhoneNumber,
} from "@/types/whatsapp";

interface FetchResult {
  successCode: number;
  data: any | null;
  message?: string;
}

// Helper untuk debug
const DEBUG_MODE = false;
const debugLog = (...args: any[]) => {
  if (DEBUG_MODE) console.log("[WhatsApp API]", ...args);
};

/**
 * Send WhatsApp Message
 * Menggunakan WhatsApp Business API atau service pihak ketiga
 */
export const sendWhatsAppMessage = async (
  message: WhatsAppMessage
): Promise<FetchResult> => {
  if (typeof window === "undefined") {
    return { successCode: 500, data: null };
  }

  try {
    const accessToken = sessionStorage.getItem("access_token");
    if (!accessToken) {
      return { successCode: 401, data: null };
    }

    // Validate phone number
    const formattedPhone = formatPhoneNumber(message.recipient);
    if (!formattedPhone) {
      return {
        successCode: 400,
        data: null,
        message: "Nomor telepon tidak valid",
      };
    }

    debugLog("Sending message to:", formattedPhone);
    debugLog("Message content:", message.message);

    // NOTE: Ini adalah implementasi mockup
    // Untuk production, ganti dengan API call ke WhatsApp Business API
    // Contoh: Fonnte, Wablas, Twilio, atau Meta WhatsApp Cloud API

    // Simulasi API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulasi sukses
    const result: SendMessageResult = {
      success: true,
      message_id: `WA_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      recipient: formattedPhone,
    };

    // Simpan ke log (optional)
    saveToLog({
      id: result.message_id!,
      recipient: formattedPhone,
      message: message.message,
      status: "sent",
      sent_at: new Date().toISOString(),
    });

    debugLog("Message sent successfully:", result);

    return {
      successCode: 200,
      data: result,
      message: "Pesan berhasil dikirim",
    };
  } catch (err: any) {
    debugLog("Error sending message:", err);
    return {
      successCode: 500,
      data: null,
      message: err.message || "Gagal mengirim pesan",
    };
  }
};

/**
 * Send Bulk WhatsApp Messages
 * Mengirim pesan ke multiple recipients
 */
export const sendBulkWhatsAppMessages = async (
  messages: WhatsAppMessage[]
): Promise<FetchResult> => {
  if (typeof window === "undefined") {
    return { successCode: 500, data: null };
  }

  try {
    const accessToken = sessionStorage.getItem("access_token");
    if (!accessToken) {
      return { successCode: 401, data: null };
    }

    debugLog("Sending bulk messages:", messages.length);

    const results: SendMessageResult[] = [];
    const errors: any[] = [];

    // Send messages sequentially to avoid rate limiting
    for (const message of messages) {
      try {
        const result = await sendWhatsAppMessage(message);
        if (result.successCode === 200 && result.data) {
          results.push(result.data);
        } else {
          errors.push({
            recipient: message.recipient,
            error: result.message,
          });
        }

        // Delay between messages to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (err: any) {
        errors.push({
          recipient: message.recipient,
          error: err.message,
        });
      }
    }

    debugLog("Bulk send complete:", {
      success: results.length,
      failed: errors.length,
    });

    return {
      successCode: 200,
      data: {
        total: messages.length,
        success: results.length,
        failed: errors.length,
        results,
        errors,
      },
      message: `Berhasil mengirim ${results.length}/${messages.length} pesan`,
    };
  } catch (err: any) {
    debugLog("Error sending bulk messages:", err);
    return {
      successCode: 500,
      data: null,
      message: err.message || "Gagal mengirim pesan massal",
    };
  }
};

/**
 * Get WhatsApp Logs
 * Mengambil riwayat pengiriman pesan
 */
export const getWhatsAppLogs = async (
  limit: number = 50
): Promise<FetchResult> => {
  if (typeof window === "undefined") {
    return { successCode: 500, data: null };
  }

  try {
    // Get logs from session storage
    const logsJson = sessionStorage.getItem("whatsapp_logs");
    const logs: WhatsAppLog[] = logsJson ? JSON.parse(logsJson) : [];

    // Return latest logs
    const latestLogs = logs.slice(-limit);

    return {
      successCode: 200,
      data: latestLogs.reverse(), // Newest first
    };
  } catch (err: any) {
    debugLog("Error getting logs:", err);
    return {
      successCode: 500,
      data: null,
      message: err.message || "Gagal mengambil log",
    };
  }
};

/**
 * Get WhatsApp Statistics
 * Mengambil statistik pengiriman pesan
 */
export const getWhatsAppStats = async (): Promise<FetchResult> => {
  if (typeof window === "undefined") {
    return { successCode: 500, data: null };
  }

  try {
    const logsJson = sessionStorage.getItem("whatsapp_logs");
    const logs: WhatsAppLog[] = logsJson ? JSON.parse(logsJson) : [];

    // Calculate stats
    const totalSent = logs.length;
    const totalDelivered = logs.filter((l) => l.status === "delivered").length;
    const totalRead = logs.filter((l) => l.status === "read").length;
    const totalFailed = logs.filter((l) => l.status === "failed").length;

    const deliveryRate = totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0;
    const readRate = totalDelivered > 0 ? (totalRead / totalDelivered) * 100 : 0;

    // Last 7 days stats
    const last7Days: { date: string; sent: number; delivered: number; failed: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const dayLogs = logs.filter((log) => log.sent_at.startsWith(dateStr));
      last7Days.push({
        date: dateStr,
        sent: dayLogs.length,
        delivered: dayLogs.filter((l) => l.status === "delivered" || l.status === "read").length,
        failed: dayLogs.filter((l) => l.status === "failed").length,
      });
    }

    const stats: WhatsAppStats = {
      total_sent: totalSent,
      total_delivered: totalDelivered,
      total_read: totalRead,
      total_failed: totalFailed,
      delivery_rate: Math.round(deliveryRate),
      read_rate: Math.round(readRate),
      last_7_days: last7Days,
    };

    return {
      successCode: 200,
      data: stats,
    };
  } catch (err: any) {
    debugLog("Error getting stats:", err);
    return {
      successCode: 500,
      data: null,
      message: err.message || "Gagal mengambil statistik",
    };
  }
};

/**
 * Send via WhatsApp Web (Click to Chat)
 * Alternative jika API tidak tersedia
 * 
 * Cara kerja:
 * 1. Buka WhatsApp Web di tab baru
 * 2. Message sudah terketik otomatis
 * 3. User tinggal tekan Enter untuk kirim
 */
export const sendViaWhatsAppWeb = (phone: string, message: string): void => {
  const formattedPhone = formatPhoneNumber(phone);
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
  
  // Open in new tab
  window.open(url, "_blank");
  
  debugLog("Opened WhatsApp Web:", url);
  
  // Save to log
  saveToLog({
    id: `WEB_${Date.now()}`,
    recipient: formattedPhone,
    message: message,
    status: "sent",
    sent_at: new Date().toISOString(),
  });
};

/**
 * Send Bulk via WhatsApp Web
 * Buka multiple tabs (gunakan dengan hati-hati)
 */
export const sendBulkViaWhatsAppWeb = (
  messages: WhatsAppMessage[]
): void => {
  messages.forEach((message, index) => {
    setTimeout(() => {
      sendViaWhatsAppWeb(message.recipient, message.message);
    }, index * 1000); // 1 second delay between each
  });
};

// Helper function to save to log
const saveToLog = (log: WhatsAppLog): void => {
  try {
    const logsJson = sessionStorage.getItem("whatsapp_logs");
    const logs: WhatsAppLog[] = logsJson ? JSON.parse(logsJson) : [];
    logs.push(log);
    
    // Keep only last 1000 logs
    const trimmedLogs = logs.slice(-1000);
    sessionStorage.setItem("whatsapp_logs", JSON.stringify(trimmedLogs));
  } catch (err) {
    debugLog("Error saving to log:", err);
  }
};

/**
 * Clear WhatsApp Logs
 */
export const clearWhatsAppLogs = (): void => {
  sessionStorage.removeItem("whatsapp_logs");
  debugLog("Logs cleared");
};

/**
 * Update Log Status
 */
export const updateLogStatus = (
  messageId: string,
  status: WhatsAppLog["status"]
): void => {
  try {
    const logsJson = sessionStorage.getItem("whatsapp_logs");
    if (!logsJson) return;

    const logs: WhatsAppLog[] = JSON.parse(logsJson);
    const logIndex = logs.findIndex((log) => log.id === messageId);

    if (logIndex !== -1) {
      logs[logIndex].status = status;

      if (status === "delivered") {
        logs[logIndex].delivered_at = new Date().toISOString();
      } else if (status === "read") {
        logs[logIndex].read_at = new Date().toISOString();
      }

      sessionStorage.setItem("whatsapp_logs", JSON.stringify(logs));
    }
  } catch (err) {
    debugLog("Error updating log status:", err);
  }
};
