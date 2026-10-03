export const categoryCards = [
  {
    name: "Makanan",
    count: "120+ produk",
    image: "/images/kategori-makanan.jpg",
  },
  {
    name: "Minuman",
    count: "85+ produk",
    image: "/images/kategori-minuman.jpg",
  },
  {
    name: "Kerajinan",
    count: "200+ produk",
    image: "/images/kategori-kerajinan.jpg",
  },
  {
    name: "Fashion",
    count: "150+ produk",
    image: "/images/kategori-fashion.jpg",
  },
  {
    name: "Home Decor",
    count: "95+ produk",
    image: "/images/kategori-home-decor.jpg",
  },
];

// Dipakai untuk chip filter di daftar UMKM
export const categories = ["Semua", ...categoryCards.map((c) => c.name)];
