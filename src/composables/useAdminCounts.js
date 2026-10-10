import { reactive } from "vue";
import { admin } from "@/services/api";

// Angka lencana di sidebar dan lonceng topbar (dibagi ke semua halaman admin)
const counts = reactive({ verifikasi: 0, laporan: 0 });

export function useAdminCounts() {
  async function refresh() {
    try {
      const b = await admin.badge();
      counts.verifikasi = b.verifikasi;
      counts.laporan = b.laporan;
    } catch {
      /* angka lencana tidak kritis: abaikan kalau gagal */
    }
  }

  return { counts, refresh };
}
