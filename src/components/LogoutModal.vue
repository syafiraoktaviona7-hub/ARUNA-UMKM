<script setup>
import { ref } from "vue";

const props = defineProps({
  loading: { type: Boolean, default: false },
  success: { type: Boolean, default: false },
});

const emit = defineEmits(["confirm", "cancel", "done"]);

function onConfirm() {
  if (props.loading || props.success) return;
  emit("confirm");
}

function onCancel() {
  if (props.loading || props.success) return;
  emit("cancel");
}

function onDone() {
  emit("done");
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div class="logout-overlay" @click.self="onCancel">
        <div class="logout-card" :class="{ 'is-success': success }">
          <!-- STATE 1: KONFIRMASI -->
          <template v-if="!success">
            <div class="logout-icon">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M10 17l5-5-5-5M15 12H3"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>

            <h2>Yakin ingin keluar?</h2>
            <p>
              Keranjang belanja, data checkout, dan favorit Anda akan
              dikosongkan saat keluar.
            </p>

            <div class="logout-actions">
              <button
                type="button"
                class="logout-btn cancel"
                :disabled="loading"
                @click="onCancel"
              >
                Batal
              </button>
              <button
                type="button"
                class="logout-btn confirm"
                :disabled="loading"
                @click="onConfirm"
              >
                <span v-if="loading" class="spinner"></span>
                <template v-if="!loading">Ya, Keluar</template>
                <template v-else>Keluar...</template>
              </button>
            </div>
          </template>

          <!-- STATE 2: SUKSES -->
          <template v-else>
            <div class="logout-check">
              <svg viewBox="0 0 52 52" fill="none" aria-hidden="true">
                <circle class="ring" cx="26" cy="26" r="23" />
                <path class="tick" d="M15 27.5l8 8L38 19" />
              </svg>
            </div>

            <span class="logout-badge">Logout Berhasil</span>

            <h2>Anda telah keluar</h2>
            <p>Terima kasih telah menggunakan ARUNA. Sampai jumpa lagi! 💙</p>

            <button type="button" class="logout-btn done" @click="onDone">
              Kembali ke Beranda
            </button>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.logout-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(12, 35, 80, 0.5);
  backdrop-filter: blur(6px);
  font-family:
    "Poppins",
    "Figtree",
    -apple-system,
    BlinkMacSystemFont,
    Arial,
    sans-serif;
}

.logout-card {
  position: relative;
  width: min(420px, 100%);
  padding: 36px 32px 28px;
  background: #ffffff;
  border-radius: 24px;
  text-align: center;
  box-shadow:
    0 30px 70px rgba(12, 35, 80, 0.28),
    0 8px 22px rgba(12, 35, 80, 0.12);
  animation: cardIn 0.28s cubic-bezier(0.34, 1.4, 0.64, 1) both;
}

@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.94);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ICON LOGOUT */
.logout-icon {
  width: 76px;
  height: 76px;
  margin: 0 auto 18px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #fff4f4;
  color: #dc2626;
}

.logout-icon svg {
  width: 38px;
  height: 38px;
}

/* JUDUL */
.logout-card h2 {
  margin: 0 0 10px;
  color: #102b50;
  font-size: 21px;
  font-weight: 750;
  letter-spacing: -0.3px;
}

.logout-card p {
  margin: 0 auto 22px;
  max-width: 320px;
  color: #6d86ad;
  font-size: 13.5px;
  line-height: 1.65;
}

/* TOMBOL */
.logout-actions {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 10px;
}

.logout-btn {
  height: 48px;
  border-radius: 12px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 650;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.logout-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.logout-btn.cancel {
  border: 1.5px solid #dbe6f2;
  background: #ffffff;
  color: #0865d8;
}

.logout-btn.cancel:hover:not(:disabled) {
  border-color: #0865d8;
  background: #f4f9ff;
  transform: translateY(-1px);
}

.logout-btn.confirm {
  border: none;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: #ffffff;
  box-shadow: 0 8px 18px rgba(220, 38, 38, 0.25);
}

.logout-btn.confirm:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(220, 38, 38, 0.35);
}

.logout-btn.done {
  width: 100%;
  border: none;
  background: linear-gradient(135deg, #1a7bf0 0%, #0865d8 100%);
  color: #ffffff;
  box-shadow: 0 8px 18px rgba(8, 101, 216, 0.25);
}

.logout-btn.done:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(8, 101, 216, 0.35);
}

.spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  margin-right: 8px;
  border: 3px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  vertical-align: middle;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* STATE SUKSES */
.logout-check {
  width: 88px;
  height: 88px;
  margin: 0 auto 16px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #e8f8ee;
  animation: bump 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.logout-check svg {
  width: 62px;
  height: 62px;
}

.logout-check .ring {
  stroke: #1faa52;
  stroke-width: 3;
  stroke-dasharray: 145;
  stroke-dashoffset: 145;
  animation: draw 0.7s 0.15s ease forwards;
}

.logout-check .tick {
  stroke: #1faa52;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 40;
  stroke-dashoffset: 40;
  animation: draw 0.45s 0.7s ease forwards;
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes bump {
  from {
    transform: scale(0.4);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.logout-badge {
  display: inline-block;
  padding: 5px 14px;
  border-radius: 999px;
  background: #e8f8ee;
  color: #188a43;
  font-size: 12.5px;
  font-weight: 650;
}

/* TRANSISI */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .logout-card,
  .logout-check,
  .logout-check .ring,
  .logout-check .tick,
  .spinner {
    animation-duration: 0.01ms;
    animation-delay: 0s;
  }
}

@media (max-width: 480px) {
  .logout-card {
    padding: 30px 22px 24px;
    border-radius: 20px;
  }

  .logout-icon {
    width: 64px;
    height: 64px;
  }

  .logout-icon svg {
    width: 32px;
    height: 32px;
  }

  .logout-card h2 {
    font-size: 19px;
  }

  .logout-actions {
    grid-template-columns: 1fr;
  }
}
</style>
