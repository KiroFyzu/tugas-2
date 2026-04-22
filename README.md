# FSA Lab — Finite State Automata

Aplikasi web interaktif untuk mempelajari dan mensimulasikan **Finite State Automata (FSA)**, dibuat sebagai tugas mata kuliah **Teori Bahasa dan Automata**.

> **Dibuat oleh:** Zionly

## ✨ Fitur

- **Tutorial lengkap** — Penjelasan konsep FSA mulai dari definisi, komponen 5-tupel, diagram transisi, tabel transisi, DFA vs NFA, hingga cara kerja membaca string
- **3 Soal DFA interaktif** — Masing-masing dilengkapi diagram transisi, tabel transisi, dan simulator uji string
- **Simulasi animasi** — Visualisasi jejak eksekusi langkah per langkah pada canvas
- **Uji string** — Masukkan string sembarang dan lihat apakah diterima atau ditolak oleh DFA

## 🗂️ Struktur Soal

| Soal   | Jenis                    | Deskripsi                       |
| ------ | ------------------------ | ------------------------------- |
| Soal 1 | Diagram → Tabel Transisi | DFA atas `{0,1}` dengan 4 state |
| Soal 2 | Tabel → Diagram Transisi | DFA atas `{a,b}` dengan 3 state |
| Soal 3 | Tabel → Diagram Transisi | DFA atas `{a,b}` dengan 4 state |

## 🚀 Menjalankan Lokal

**Prasyarat:** Node.js ≥ 18

```bash
# Clone repo
git clone https://github.com/zhafrandzaky/tugas-2.git
cd tugas-2

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Buka browser di `http://localhost:5173`

## 🏗️ Build untuk Produksi

```bash
npm run build
```

Output akan ada di folder `dist/`.

## ☁️ Deploy ke Vercel

1. Push project ini ke GitHub
2. Buka [vercel.com](https://vercel.com) → **New Project** → Import repo
3. Vercel otomatis mendeteksi Vite — tidak perlu konfigurasi tambahan:
    - **Framework:** Vite
    - **Build Command:** `npm run build`
    - **Output Directory:** `dist`
4. Klik **Deploy**

## 🛠️ Tech Stack

- [React 18](https://react.dev/) — UI library
- [Vite 5](https://vitejs.dev/) — Build tool & dev server
- HTML5 Canvas — Rendering diagram FSA

## 📁 Struktur File

```
tugas-2/
├── fsa_tutorial_sim.jsx   # Komponen utama (App + semua subcomponent)
├── src/
│   └── main.jsx           # Entry point React
├── index.html             # HTML entry point
├── vite.config.js         # Konfigurasi Vite
├── package.json
└── .gitignore
```

## 📚 Referensi

- Sipser, M. (2012). _Introduction to the Theory of Computation_ (3rd ed.)
- Hopcroft, J. E., Motwani, R., & Ullman, J. D. (2006). _Introduction to Automata Theory, Languages, and Computation_
