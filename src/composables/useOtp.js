import { ref, computed } from "vue";
import { useAuth } from "./useAuth";

const COOLDOWN_SECONDS = 60;
const RESEND_MAX       = 5;

export function useOtp() {
  const { requestOtp, verifyOtp } = useAuth();

  const loading      = ref(false);
  const error        = ref("");
  const step         = ref("phone"); // "phone" | "otp"
  const phone        = ref("");
  const purpose      = ref("login"); // "login" | "register"

  const cooldown     = ref(0);
  const resendCount  = ref(0);
  let   cooldownTimer = null;

  const canResend = computed(() => cooldown.value <= 0);

  function startCooldown() {
    cooldown.value = COOLDOWN_SECONDS;
    if (cooldownTimer) clearInterval(cooldownTimer);
    cooldownTimer = setInterval(() => {
      cooldown.value--;
      if (cooldown.value <= 0) {
        clearInterval(cooldownTimer);
        cooldownTimer = null;
      }
    }, 1000);
  }

  async function kirimOtp(nomor) {
    loading.value = true;
    error.value = "";
    try {
      const res = await requestOtp(nomor, purpose.value);
      phone.value = res.phone || nomor;   // simpan versi kanonik (+62...)
      step.value  = "otp";
      resendCount.value++;
      startCooldown();
      return res;
    } catch (e) {
      error.value = e.message || "Gagal mengirim OTP.";
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function kirimUlang() {
    if (!canResend.value) return;
    if (resendCount.value >= RESEND_MAX) {
      error.value = "Terlalu sering minta OTP. Coba lagi nanti.";
      return;
    }
    return kirimOtp(phone.value);
  }

  async function verifikasi(kode) {
    loading.value = true;
    error.value = "";
    try {
      return await verifyOtp(phone.value, kode, purpose.value);
    } catch (e) {
      error.value = e.message || "Kode OTP salah.";
      throw e;
    } finally {
      loading.value = false;
    }
  }

  function reset() {
    step.value = "phone";
    phone.value = "";
    error.value = "";
    resendCount.value = 0;
    cooldown.value = 0;
    if (cooldownTimer) clearInterval(cooldownTimer);
  }

  function setPurpose(p) {
    purpose.value = p;
  }

  return {
    loading,
    error,
    step,
    phone,
    purpose,
    cooldown,
    canResend,
    kirimOtp,
    kirimUlang,
    verifikasi,
    reset,
    setPurpose,
  };
}