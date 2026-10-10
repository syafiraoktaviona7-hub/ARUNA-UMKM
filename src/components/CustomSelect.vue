<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from "vue";

const props = defineProps({
  modelValue: { type: [String, Number], default: "" },
  options: { type: Array, default: () => [] }, // [{ value, label }]
  placeholder: { type: String, default: "Pilih..." },
  disabled: { type: Boolean, default: false },
  searchable: { type: Boolean, default: true },
  icon: { type: String, default: "" },
});

const emit = defineEmits(["update:modelValue"]);

const open = ref(false);
const search = ref("");
const activeIndex = ref(-1);
const wrapperRef = ref(null);
const searchInputRef = ref(null);

const selectedLabel = computed(() => {
  const found = props.options.find(
    (o) => String(o.value) === String(props.modelValue),
  );
  return found ? found.label : "";
});

const filteredOptions = computed(() => {
  if (!search.value.trim()) return props.options;
  const q = search.value.toLowerCase();
  return props.options.filter((o) => o.label.toLowerCase().includes(q));
});

function toggle() {
  if (props.disabled) return;
  open.value = !open.value;
  if (open.value) {
    search.value = "";
    activeIndex.value = -1;
    nextTick(() => {
      searchInputRef.value?.focus();
    });
  }
}

function close() {
  open.value = false;
  search.value = "";
  activeIndex.value = -1;
}

function pick(option) {
  emit("update:modelValue", option.value);
  close();
}

function onKeydown(e) {
  if (!open.value) {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      toggle();
    }
    return;
  }

  if (e.key === "ArrowDown") {
    e.preventDefault();
    activeIndex.value = Math.min(
      activeIndex.value + 1,
      filteredOptions.value.length - 1,
    );
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    activeIndex.value = Math.max(activeIndex.value - 1, 0);
  } else if (e.key === "Enter") {
    e.preventDefault();
    const opt = filteredOptions.value[activeIndex.value];
    if (opt) pick(opt);
  } else if (e.key === "Escape") {
    close();
  }
}

function onClickOutside(e) {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target)) {
    close();
  }
}

onMounted(() => {
  document.addEventListener("click", onClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", onClickOutside);
});
</script>

<template>
  <div
    ref="wrapperRef"
    class="cs-wrapper"
    :class="{ 'is-open': open, 'is-disabled': disabled }"
  >
    <!-- TRIGGER -->
    <button
      type="button"
      class="cs-trigger"
      :class="{ 'has-value': !!modelValue }"
      :disabled="disabled"
      @click="toggle"
      @keydown="onKeydown"
    >
      <span v-if="icon" class="cs-trigger-icon" v-html="icon"></span>

      <span class="cs-trigger-text">
        <span v-if="selectedLabel">{{ selectedLabel }}</span>
        <span v-else class="cs-placeholder">{{ placeholder }}</span>
      </span>

      <svg
        class="cs-chevron"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="m6 9 6 6 6-6"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <!-- DROPDOWN PANEL -->
    <Transition name="cs-fade">
      <div v-if="open" class="cs-panel">
        <!-- SEARCH -->
        <div v-if="searchable && options.length > 6" class="cs-search">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle
              cx="11"
              cy="11"
              r="7"
              stroke="currentColor"
              stroke-width="1.8"
            />
            <path
              d="m20 20-3.5-3.5"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
          </svg>
          <input
            ref="searchInputRef"
            v-model="search"
            type="text"
            placeholder="Cari..."
            @keydown="onKeydown"
          />
        </div>

        <!-- OPTIONS LIST -->
        <ul class="cs-list" role="listbox">
          <li
            v-for="(opt, idx) in filteredOptions"
            :key="opt.value"
            class="cs-option"
            :class="{
              selected: String(opt.value) === String(modelValue),
              active: idx === activeIndex,
            }"
            role="option"
            @click="pick(opt)"
            @mouseenter="activeIndex = idx"
          >
            <span class="cs-option-label">{{ opt.label }}</span>
            <svg
              v-if="String(opt.value) === String(modelValue)"
              class="cs-check"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="m5 12.5 4.5 4.5L19 7.5"
                stroke="currentColor"
                stroke-width="2.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </li>

          <li v-if="filteredOptions.length === 0" class="cs-empty">
            Tidak ada hasil untuk "{{ search }}"
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.cs-wrapper {
  position: relative;
  width: 100%;
}

/* TRIGGER */
.cs-trigger {
  width: 100%;
  height: 54px;
  padding: 0 45px 0 15px;
  border: 1px solid #d8e2ee;
  border-radius: 11px;
  background: #fff;
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: inherit;
  font-size: 14px;
  color: #243d63;
  cursor: pointer;
  text-align: left;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.cs-trigger:hover:not(:disabled) {
  border-color: #b8d0ea;
}

.cs-trigger:focus {
  outline: none;
  border-color: #0865d8;
  box-shadow: 0 0 0 3px rgba(8, 101, 216, 0.08);
}

.cs-wrapper.is-open .cs-trigger {
  border-color: #0865d8;
  box-shadow: 0 0 0 3px rgba(8, 101, 216, 0.08);
}

.cs-wrapper.is-disabled .cs-trigger {
  background: #f8fafc;
  color: #b1c0d4;
  cursor: not-allowed;
  border-color: #e2e8f0;
}

.cs-trigger-icon {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8095b3;
}

.cs-trigger-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.cs-trigger-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cs-placeholder {
  color: #9aabc0;
}

.cs-chevron {
  position: absolute;
  right: 15px;
  top: 50%;
  width: 20px;
  height: 20px;
  transform: translateY(-50%);
  color: #6f89ad;
  pointer-events: none;
  transition: transform 0.2s ease;
}

.cs-wrapper.is-open .cs-chevron {
  transform: translateY(-50%) rotate(180deg);
}

/* PANEL */
.cs-panel {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 50;
  background: #ffffff;
  border: 1px solid #dce7f5;
  border-radius: 14px;
  box-shadow:
    0 18px 40px rgba(20, 65, 110, 0.15),
    0 4px 12px rgba(20, 65, 110, 0.08);
  overflow: hidden;
  max-height: 320px;
  display: flex;
  flex-direction: column;
}

/* SEARCH */
.cs-search {
  position: relative;
  padding: 10px 12px;
  border-bottom: 1px solid #eef3fa;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fbff;
}

.cs-search svg {
  width: 16px;
  height: 16px;
  color: #8095b3;
  flex-shrink: 0;
}

.cs-search input {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  outline: none;
  font-family: inherit;
  font-size: 13px;
  color: #243d63;
  padding: 6px 0;
}

.cs-search input::placeholder {
  color: #9aabc0;
}

/* LIST */
.cs-list {
  list-style: none;
  margin: 0;
  padding: 6px;
  overflow-y: auto;
  max-height: 260px;
}

.cs-list::-webkit-scrollbar {
  width: 8px;
}

.cs-list::-webkit-scrollbar-thumb {
  background: #d6e2ee;
  border-radius: 8px;
}

.cs-list::-webkit-scrollbar-thumb:hover {
  background: #b8cee3;
}

.cs-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 9px;
  font-size: 14px;
  color: #243d63;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease;
  user-select: none;
}

.cs-option:hover,
.cs-option.active {
  background: #eaf4ff;
  color: #0865d8;
}

.cs-option.selected {
  background: #0865d8;
  color: #ffffff;
  font-weight: 600;
}

.cs-option.selected:hover,
.cs-option.selected.active {
  background: #0754b5;
}

.cs-option-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cs-check {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: currentColor;
}

.cs-empty {
  padding: 18px 12px;
  text-align: center;
  color: #91a2ba;
  font-size: 13px;
}

/* TRANSISI */
.cs-fade-enter-active,
.cs-fade-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
  transform-origin: top center;
}

.cs-fade-enter-from,
.cs-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
</style>
