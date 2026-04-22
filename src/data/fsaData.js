export const THEORY = [
    {
        id: 'apa-itu-fsa',
        title: 'Apa Itu FSA?',
        icon: '🤖',
        content: [
            {
                type: 'text',
                body: 'Finite State Automata (FSA) adalah model sederhana untuk membaca string satu per satu. Model ini dipakai untuk memahami cara sistem mengambil keputusan berdasarkan urutan input.',
            },
            {
                type: 'highlight',
                body: 'Intinya, FSA punya state yang jumlahnya terbatas. Setiap kali membaca simbol, mesin pindah state sesuai aturan transisi.',
            },
            {
                type: 'text',
                body: 'Kalau kamu pernah lihat alur menu ATM atau lampu lalu lintas, konsepnya mirip. Kondisi saat ini menentukan langkah berikutnya.',
            },
            {
                type: 'analogy',
                title: 'Contoh Gampang di Kehidupan Sehari-hari',
                items: [
                    {
                        icon: '🚦',
                        text: 'Lampu lalu lintas: state = merah/kuning/hijau, input = timer.',
                    },
                    {
                        icon: '🏧',
                        text: 'ATM: state = halaman menu, input = tombol yang kamu pilih.',
                    },
                    {
                        icon: '🎮',
                        text: 'Game: state = menu, bermain, pause; input = aksi pemain.',
                    },
                    {
                        icon: '📱',
                        text: 'Aplikasi chat: state = online/offline/typing, input = event dari user.',
                    },
                ],
            },
        ],
    },
    {
        id: 'komponen-fsa',
        title: 'Komponen FSA (5-Tupel)',
        icon: '⚙️',
        content: [
            {
                type: 'text',
                body: 'Secara formal FSA ditulis sebagai M = (Q, Σ, δ, S, F). Lima komponen ini sudah cukup untuk mendeskripsikan perilaku mesin.',
            },
            {
                type: 'components',
                items: [
                    {
                        symbol: 'Q',
                        name: 'Kumpulan State',
                        desc: 'Semua kondisi yang mungkin dimiliki mesin. Jumlahnya harus terbatas.',
                        example: 'Q = {q₀, q₁, q₂, q₃}',
                        color: '#ff7a59',
                    },
                    {
                        symbol: 'Σ',
                        name: 'Alfabet Input',
                        desc: 'Daftar simbol yang boleh dibaca mesin.',
                        example: 'Σ = {0,1} atau Σ = {a,b}',
                        color: '#ff6f91',
                    },
                    {
                        symbol: 'δ',
                        name: 'Fungsi Transisi',
                        desc: 'Aturan pindah state: dari state sekarang + simbol input ke state berikutnya.',
                        example: 'δ(q₀,1) = q₁',
                        color: '#66d9b8',
                    },
                    {
                        symbol: 'S',
                        name: 'State Awal',
                        desc: 'Tempat mesin mulai sebelum membaca input.',
                        example: 'S = q₀',
                        color: '#ffd166',
                    },
                    {
                        symbol: 'F',
                        name: 'State Akhir',
                        desc: 'State penerima. Jika input habis dan mesin ada di sini, string diterima.',
                        example: 'F = {q₂} atau F = {q₀, q₁}',
                        color: '#7ec8ff',
                    },
                ],
            },
        ],
    },
    {
        id: 'diagram-transisi',
        title: 'Diagram Transisi',
        icon: '🔵',
        content: [
            {
                type: 'text',
                body: 'Diagram transisi menampilkan FSA dalam bentuk graf. Cara ini paling cepat untuk membaca alur perpindahan antar state.',
            },
            {
                type: 'diagram-legend',
                items: [
                    {
                        visual: 'circle',
                        label: 'Lingkaran tunggal',
                        desc: 'State biasa.',
                    },
                    {
                        visual: 'double-circle',
                        label: 'Lingkaran ganda',
                        desc: 'State akhir (accepting state).',
                    },
                    {
                        visual: 'arrow-in',
                        label: 'Panah dari luar',
                        desc: 'Penanda state awal.',
                    },
                    {
                        visual: 'arrow',
                        label: 'Panah antar state',
                        desc: 'Menunjukkan perpindahan state.',
                    },
                    {
                        visual: 'self-loop',
                        label: 'Panah kembali ke diri sendiri',
                        desc: 'Setelah baca simbol tertentu, state tetap sama.',
                    },
                    {
                        visual: 'label',
                        label: 'Label di panah',
                        desc: 'Simbol input yang memicu transisi.',
                    },
                ],
            },
        ],
    },
    {
        id: 'tabel-transisi',
        title: 'Tabel Transisi',
        icon: '📊',
        content: [
            {
                type: 'text',
                body: 'Tabel transisi adalah bentuk ringkas dari fungsi δ. Baris adalah state asal, kolom adalah simbol input, dan isi sel adalah state tujuan.',
            },
            {
                type: 'table-example',
                title: 'Contoh tabel transisi DFA dengan Σ={a,b}:',
                headers: ['δ', 'a', 'b'],
                rows: [
                    ['→*q₀', 'q₀', 'q₁', 'start+final'],
                    ['q₁', 'q₁', 'q₀', 'normal'],
                ],
                legend: [
                    { symbol: '→', desc: 'State awal' },
                    { symbol: '*', desc: 'State akhir' },
                    { symbol: '→*', desc: 'State awal sekaligus akhir' },
                ],
            },
            {
                type: 'text',
                body: 'Diagram dan tabel sebenarnya setara. Kamu bisa konversi dari diagram ke tabel, atau sebaliknya.',
            },
        ],
    },
    {
        id: 'dfa-vs-nfa',
        title: 'DFA vs NFA',
        icon: '⚖️',
        content: [
            {
                type: 'text',
                body: 'DFA dan NFA sama-sama mengenali bahasa reguler. Perbedaannya ada pada cara memilih transisi saat membaca input.',
            },
            {
                type: 'comparison',
                left: {
                    title: 'DFA',
                    color: '#ff7a59',
                    points: [
                        'Setiap state punya tepat satu transisi untuk tiap simbol input.',
                        'Alur eksekusi selalu jelas dan tunggal.',
                        'Lebih mudah dipahami saat simulasi langkah demi langkah.',
                        'Sering dipakai untuk implementasi parser sederhana.',
                    ],
                },
                right: {
                    title: 'NFA',
                    color: '#ff6f91',
                    points: [
                        'Satu simbol bisa punya nol, satu, atau banyak pilihan transisi.',
                        'Bisa dianggap punya banyak jalur aktif sekaligus.',
                        'Lebih fleksibel saat merancang pola tertentu.',
                        'Tetap bisa diubah menjadi DFA yang ekuivalen.',
                    ],
                },
            },
            {
                type: 'highlight',
                body: 'Pada simulasi tugas ini, fokus utama kita adalah DFA agar alurnya lebih mudah ditelusuri.',
            },
        ],
    },
    {
        id: 'cara-kerja',
        title: 'Cara Kerja Membaca String',
        icon: '▶️',
        content: [
            {
                type: 'text',
                body: 'Mesin membaca string dari kiri ke kanan. Setelah membaca satu simbol, mesin langsung pindah state sesuai aturan δ.',
            },
            {
                type: 'steps',
                items: [
                    {
                        step: '1',
                        title: 'Mulai dari State Awal',
                        desc: 'Posisi awal mesin selalu di S.',
                    },
                    {
                        step: '2',
                        title: 'Ambil Satu Simbol',
                        desc: 'Baca simbol berikutnya dari string input.',
                    },
                    {
                        step: '3',
                        title: 'Lihat Aturan Transisi',
                        desc: 'Cari δ(state_sekarang, simbol) untuk menentukan state tujuan.',
                    },
                    {
                        step: '4',
                        title: 'Pindah State',
                        desc: 'State sekarang di-update ke hasil transisi tadi.',
                    },
                    {
                        step: '5',
                        title: 'Ulangi Sampai Input Habis',
                        desc: 'Lanjutkan proses sampai tidak ada simbol tersisa.',
                    },
                    {
                        step: '6',
                        title: 'Putuskan Diterima atau Ditolak',
                        desc: 'Jika state akhir ada di F maka diterima, jika tidak maka ditolak.',
                    },
                ],
            },
            {
                type: 'example-trace',
                title: "Contoh jejak string '011' pada DFA Soal 1",
                steps: [
                    { from: '—', input: '—', to: 'q₀', note: 'mulai dari state awal' },
                    { from: 'q₀', input: '0', to: 'q₂', note: 'baca 0 lalu pindah ke q₂' },
                    { from: 'q₂', input: '1', to: 'q₃', note: 'baca 1 lalu pindah ke q₃' },
                    { from: 'q₃', input: '1', to: 'q₂', note: 'baca 1 lalu kembali ke q₂' },
                ],
                result: 'DITOLAK',
                reason: 'state akhir q₂ tidak termasuk final state',
            },
        ],
    },
]

export const DFAS = [
    {
        id: 0,
        soal: 'Soal 1',
        title: 'Diagram → Tabel Transisi',
        task: 'Buatlah tabel transisi dari diagram DFA berikut.',
        states: ['q₀', 'q₁', 'q₂', 'q₃'],
        alphabet: ['0', '1'],
        start: 0,
        finals: [0],
        delta: {
            0: { 0: 2, 1: 1 },
            1: { 0: 3, 1: 0 },
            2: { 0: 0, 1: 3 },
            3: { 0: 1, 1: 2 },
        },
        nodePos: [
            { x: 150, y: 130 },
            { x: 310, y: 130 },
            { x: 150, y: 250 },
            { x: 310, y: 250 },
        ],
        explanation:
            "DFA ini menerima string biner yang mengandung jumlah '1' genap. State q₀ = genap (final), q₁ = ganjil, q₂/q₃ = state intermediate.",
    },
    {
        id: 1,
        soal: 'Soal 2',
        title: 'Tabel → Diagram Transisi',
        task: 'Gambarkan diagram transisi dari DFA berikut.',
        states: ['q₀', 'q₁', 'q₂'],
        alphabet: ['a', 'b'],
        start: 0,
        finals: [0],
        delta: { 0: { a: 1, b: 2 }, 1: { a: 2, b: 0 }, 2: { a: 2, b: 2 } },
        nodePos: [
            { x: 120, y: 160 },
            { x: 270, y: 90 },
            { x: 270, y: 230 },
        ],
        explanation:
            "DFA ini menerima string atas {a,b} yang jumlah 'ab'-nya genap. State q₂ adalah dead state — sekali masuk tidak bisa diterima.",
    },
    {
        id: 2,
        soal: 'Soal 3',
        title: 'Tabel → Diagram Transisi',
        task: 'Gambarkan diagram transisi dari DFA berikut.',
        states: ['q₀', 'q₁', 'q₂', 'q₃'],
        alphabet: ['a', 'b'],
        start: 0,
        finals: [0, 1, 2],
        delta: {
            0: { a: 0, b: 1 },
            1: { a: 0, b: 2 },
            2: { a: 0, b: 3 },
            3: { a: 3, b: 2 },
        },
        nodePos: [
            { x: 80, y: 160 },
            { x: 210, y: 160 },
            { x: 340, y: 160 },
            { x: 420, y: 160 },
        ],
        explanation:
            "DFA ini menerima string atas {a,b} yang tidak mengandung 'bbb' (tiga b berturut-turut). q₃ adalah trap state untuk pola bbb.",
    },
]
