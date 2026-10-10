<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const emit = defineEmits(["close"]);
const router = useRouter();

// "customer" atau "seller"
const selectedRole = ref("customer");

function closeModal() {
  emit("close");
}

function continueRegister() {
  if (selectedRole.value === "customer") {
    emit("close");
    router.push({ name: "customer-verify-phone" });
    return;
  }

  if (selectedRole.value === "seller") {
    emit("close");
    router.push({ name: "register" });
    return;
  }
}
</script>

<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="role-modal">
      <!-- TOMBOL CLOSE -->
      <button class="close-button" type="button" @click="closeModal">×</button>

      <!-- ICON ATAS -->
      <div class="modal-icon">
        <img src="/images/register-role-icon.png" alt="Pilih peran" />
      </div>

      <!-- JUDUL -->
      <div class="modal-header">
        <h2>Daftar sebagai siapa?</h2>
        <p>
          Pilih jenis akun yang sesuai dengan tujuan Anda<br />
          di platform ARUNA.
        </p>
      </div>

      <!-- PILIHAN ROLE -->
      <div class="role-options">
        <!-- CUSTOMER -->
        <button
          type="button"
          class="role-card"
          :class="{ selected: selectedRole === 'customer' }"
          @click="selectedRole = 'customer'"
        >
          <div class="role-image">
            <img src="/images/register-customer.png" alt="Customer" />
          </div>

          <h3>Customer</h3>

          <p>
            Saya ingin berbelanja<br />
            produk UMKM di ARUNA
          </p>

          <span class="radio">
            <span v-if="selectedRole === 'customer'"></span>
          </span>
        </button>

        <!-- PENJUAL -->
        <button
          type="button"
          class="role-card"
          :class="{ selected: selectedRole === 'seller' }"
          @click="selectedRole = 'seller'"
        >
          <div class="role-image">
            <img src="/images/register-seller.png" alt="Penjual" />
          </div>

          <h3>Penjual</h3>

          <p>
            Saya ingin menjual<br />
            produk saya di ARUNA
          </p>

          <span class="radio">
            <span v-if="selectedRole === 'seller'"></span>
          </span>
        </button>
      </div>

      <!-- TOMBOL LANJUT -->
      <button type="button" class="continue-button" @click="continueRegister">
        <span>Lanjutkan</span>
        <span class="arrow">→</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 3000;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(20, 45, 78, 0.42);
  backdrop-filter: blur(4px);
}

.role-modal {
  position: relative;

  width: min(520px, 94vw);
  padding: 28px 30px 30px;

  background: #ffffff;
  border: 1px solid #dce9f8;
  border-radius: 22px;

  box-shadow:
    0 25px 70px rgba(20, 65, 110, 0.22),
    0 5px 20px rgba(20, 65, 110, 0.08);

  text-align: center;

  animation: modalShow 0.22s ease-out;
}

@keyframes modalShow {
  from {
    opacity: 0;
    transform: translateY(15px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* =========================
   TOMBOL CLOSE
========================= */

.close-button {
  position: absolute;
  top: 14px;
  right: 15px;

  width: 30px;
  height: 30px;

  border: none;
  border-radius: 50%;

  background: #f3f7fc;
  color: #7890ad;

  font-size: 22px;
  line-height: 1;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  transition: 0.2s ease;
}

.close-button:hover {
  background: #e8f1fb;
  color: #0865d8;
}

/* =========================
   ICON
========================= */

.modal-icon {
  width: 82px;
  height: 82px;

  margin: 0 auto 8px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-icon img {
  width: 100%;
  height: 100%;

  object-fit: contain;
}

/* =========================
   HEADER
========================= */

.modal-header h2 {
  margin: 0;

  color: #142d4e;

  font-size: 23px;
  font-weight: 700;

  line-height: 1.3;
}

.modal-header p {
  margin: 7px 0 20px;

  color: #7186a1;

  font-size: 12px;
  line-height: 1.55;
}

/* =========================
   ROLE OPTIONS
========================= */

.role-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;

  margin-bottom: 18px;
}

.role-card {
  position: relative;

  min-height: 205px;

  padding: 13px 10px 14px;

  border: 1px solid #dce7f5;
  border-radius: 12px;

  background: #ffffff;

  color: #142d4e;

  cursor: pointer;

  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.role-card:hover {
  border-color: #9fc8fa;
  transform: translateY(-2px);
}

.role-card.selected {
  border-color: #70b0f4;
  background: #f2f8ff;
  box-shadow: 0 5px 16px rgba(8, 101, 216, 0.08);
}

/* IMAGE */
.role-image {
  width: 125px;
  height: 95px;

  margin: 0 auto 5px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.role-image img {
  width: 100%;
  height: 100%;

  object-fit: contain;
}

/* TEXT */
.role-card h3 {
  margin: 2px 0 5px;

  color: #142d4e;

  font-size: 14px;
  font-weight: 700;
}

.role-card p {
  margin: 0;

  color: #7186a1;

  font-size: 9px;
  line-height: 1.5;
}

/* RADIO */
.radio {
  width: 16px;
  height: 16px;

  margin: 10px auto 0;

  border: 1.5px solid #a8bdd5;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;
}

.role-card.selected .radio {
  border-color: #0865d8;
}

.radio span {
  width: 8px;
  height: 8px;

  border-radius: 50%;
  background: #0865d8;
}

/* =========================
   CONTINUE BUTTON
========================= */

.continue-button {
  width: 100%;
  height: 48px;

  border: none;
  border-radius: 10px;

  background: #0865d8;
  color: #ffffff;

  font-family: inherit;
  font-size: 13px;
  font-weight: 600;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 13px;

  cursor: pointer;

  box-shadow: 0 7px 18px rgba(8, 101, 216, 0.18);

  transition:
    background 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.continue-button:hover {
  background: #0754b5;
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(8, 101, 216, 0.28);
}

.arrow {
  font-size: 18px;
  line-height: 1;
  transition: transform 0.2s ease;
}

.continue-button:hover .arrow {
  transform: translateX(4px);
}

/* =========================
   MOBILE
========================= */

@media (max-width: 520px) {
  .role-modal {
    padding: 24px 18px 20px;
  }

  .modal-header h2 {
    font-size: 20px;
  }

  .role-options {
    gap: 9px;
  }

  .role-card {
    min-height: 190px;
    padding: 10px 6px;
  }

  .role-image {
    width: 105px;
    height: 82px;
  }

  .role-card h3 {
    font-size: 13px;
  }

  .role-card p {
    font-size: 8px;
  }
}
</style>
