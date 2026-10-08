// icon = isi tag <svg> (gambar garis). color = warna ikon, bg = warna kotak ikon.
export const categoryCards = [
  {
    name: "Makanan",
    color: "#e8710a",
    bg: "#fff1e6",
    icon: '<path d="M7 3v7a2 2 0 0 0 2 2v9M11 3v7a2 2 0 0 1-2 2M9 3v6M17 3c-2 1.5-3 4-3 7 0 1.7 1 2 3 2v9"/>',
  },
  {
    name: "Minuman",
    color: "#0a8fb0",
    bg: "#e6f6fb",
    icon: '<path d="M6 8h12l-1.2 11a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8L6 8z"/><path d="M5 8h14"/><path d="M13 8l2-5h3"/>',
  },
  {
    name: "Sembako",
    color: "#b7791f",
    bg: "#fff7df",
    icon: '<path d="M8 3h8l1 4c2 2 3 5 3 8a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5c0-3 1-6 3-8l1-4z"/><path d="M8 7h8"/>',
  },
  {
    name: "Fashion & Aksesorisnya",
    color: "#7c4dcc",
    bg: "#f3ecff",
    icon: '<path d="M8 3l-5 3 2.5 4L8 9v12h8V9l2.5 1L21 6l-5-3c-.5 1.5-2 2.5-4 2.5S8.5 4.5 8 3z"/>',
  },
  {
    name: "Sayur dan Buah",
    color: "#2f9e5b",
    bg: "#e8f7ec",
    icon: '<path d="M12 7c-1.5-1.2-5-1.5-6.5 1.5-1.4 3 .3 8 2.3 10.5 1 1.2 2.4 1.5 4.2.7 1.8.8 3.2.5 4.2-.7 2-2.5 3.7-7.5 2.3-10.5C17 5.5 13.5 5.8 12 7z"/><path d="M12 7c0-2 1-3.5 3-4"/>',
  },
];

// Dipakai untuk chip filter di daftar produk
export const categories = ["Semua", ...categoryCards.map((c) => c.name)];
