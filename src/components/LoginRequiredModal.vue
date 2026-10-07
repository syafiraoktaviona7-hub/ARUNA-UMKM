<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import RegisterRoleModal from "@/components/RegisterRoleModal.vue";

const emit = defineEmits(["close"]);

const router = useRouter();

const showRegisterModal = ref(false);

function closeModal() {
  emit("close");
}

function goToLogin() {
  emit("close");
  router.push("/login");
}

function goToRegister() {
  emit("close");
  showRegisterModal.value = true;
}

function closeRegisterModal() {
  showRegisterModal.value = false;
}
</script>

<template>
  <Teleport to="body">
    <!-- POPUP LOGIN / DAFTAR -->
    <div
      v-if="!showRegisterModal"
      class="auth-overlay"
      @click.self="closeModal"
    >
      <div class="auth-modal">

        <!-- CLOSE -->
        <button
          type="button"
          class="close-button"
          aria-label="Tutup"
          @click="closeModal"
        >
          ×
        </button>

        <!-- GAMBAR -->
        <div class="auth-image">
          <img
            src="/images/cart-warning.png"
            alt="Masuk atau daftar terlebih dahulu"
          />
        </div>

        <!-- CONTENT -->
        <div class="auth-content">
          <h2>Masuk atau Daftar Terlebih Dahulu</h2>

          <p>
            Anda perlu masuk atau mendaftar akun terlebih dahulu
            untuk dapat memasukkan produk ke keranjang.
          </p>
        </div>

        <!-- BUTTON -->
        <div class="auth-actions">

          <button
            type="button"
            class="login-action"
            @click="goToLogin"
          >
            Masuk
          </button>

          <button
            type="button"
            class="register-action"
            @click="goToRegister"
          >
            Daftar
          </button>

        </div>

      </div>
    </div>

    <!-- PILIH CUSTOMER / PENJUAL -->
    <RegisterRoleModal
      v-if="showRegisterModal"
      @close="closeRegisterModal"
    />
  </Teleport>
</template>

<style scoped>
.auth-overlay {
  position: fixed;
  inset: 0;
  z-index: 5000;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(20, 45, 78, 0.58);
  backdrop-filter: blur(5px);
}

.auth-modal {
  position: relative;

  width: min(740px, 94vw);

  padding: 42px 46px 40px;

  background: #ffffff;
  border-radius: 28px;

  box-shadow:
    0 30px 80px rgba(20, 45, 78, 0.28),
    0 8px 30px rgba(20, 45, 78, 0.12);

  text-align: center;

  animation: modalShow 0.22s ease-out;
}

@keyframes modalShow {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.97);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* CLOSE */

.close-button {
  position: absolute;
  top: 22px;
  right: 25px;

  width: 38px;
  height: 38px;

  border: none;
  background: transparent;

  color: #8293aa;

  font-size: 36px;
  font-weight: 300;
  line-height: 1;

  cursor: pointer;

  transition: 0.2s ease;
}

.close-button:hover {
  color: #0865d8;
}

/* IMAGE */

.auth-image {
  width: 100%;
  height: 285px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 5px;
}

.auth-image img {
  width: 100%;
  height: 100%;

  object-fit: contain;
}

/* CONTENT */

.auth-content h2 {
  margin: 0 0 12px;

  color: #142d4e;

  font-size: 30px;
  font-weight: 700;
  line-height: 1.25;
}

.auth-content p {
  max-width: 570px;

  margin: 0 auto;

  color: #7186a1;

  font-size: 17px;
  line-height: 1.55;
}

/* BUTTON */

.auth-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;

  gap: 18px;

  margin-top: 32px;
}

.login-action,
.register-action {
  height: 64px;

  border-radius: 14px;

  font-size: 20px;
  font-weight: 600;

  cursor: pointer;

  transition: 0.2s ease;
}

.login-action {
  color: #0865d8;

  background: #ffffff;

  border: 2px solid #0865d8;
}

.login-action:hover {
  background: #f1f7ff;
}

.register-action {
  color: #ffffff;

  background: #0865d8;

  border: 2px solid #0865d8;

  box-shadow: 0 8px 20px rgba(8, 101, 216, 0.18);
}

.register-action:hover {
  background: #0754b5;
}

/* MOBILE */

@media (max-width: 600px) {
  .auth-modal {
    padding: 35px 22px 25px;
    border-radius: 22px;
  }

  .auth-image {
    height: 210px;
  }

  .auth-content h2 {
    font-size: 23px;
  }

  .auth-content p {
    font-size: 14px;
  }

  .auth-actions {
    gap: 10px;
  }

  .login-action,
  .register-action {
    height: 52px;
    font-size: 16px;
  }
}
</style>