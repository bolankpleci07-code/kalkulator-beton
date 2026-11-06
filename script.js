"use strict";

/* =========================================
   KALKULATOR BETON V6.0
   JAVASCRIPT UTAMA
========================================= */

let volumeTerakhir = 0;
let hasilRABTerakhir = 0;


/* =========================================
   1. FUNGSI FORMAT ANGKA
========================================= */

function angka(nilai, digit = 2) {
    return Number(nilai).toLocaleString("id-ID", {
        minimumFractionDigits: digit,
        maximumFractionDigits: digit
    });
}

function rupiah(nilai) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(nilai);
}

function ambilNilai(id) {
    const elemen = document.getElementById(id);
    return elemen && elemen.value.trim() !== ""
       ? Number(elemen.value.replace(",",".")) : NaN;
}

function escapeHTML(teks) {
    return String(teks).replace(/[&<>"']/g, function(huruf) {
        const karakter = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };
        return karakter[huruf];
    });
}


/* =========================================
   2. HITUNG VOLUME BETON
========================================= */

function hitungVolume() {

    const bentuk = document.getElementById("bentuk").value;
    const panjang = ambilNilai("panjang");
    const lebar = ambilNilai("lebar");
    const tinggi = ambilNilai("tinggi");

    if (
        !Number.isFinite(panjang) ||
        !Number.isFinite(lebar) ||
        !Number.isFinite(tinggi) ||
        panjang <= 0 ||
        lebar <= 0 ||
        tinggi <= 0
    ) {
        alert("Masukkan ukuran dengan benar!");
        return;
    }

    let volume = 0;

    if (bentuk === "balok" || bentuk === "kolom") {
        volume = panjang * lebar * tinggi;
    }

    else if (bentuk === "silinder") {
        const radius = lebar / 2;
        volume = Math.PI * radius * radius * tinggi;
    }

    else {
        alert("Bentuk beton tidak dikenali.");
        return;
    }

    volumeTerakhir = volume;

    document.getElementById("hasilVolume").textContent =
        angka(volume, 3) + " m³";

    hitungMaterial(volume);

    document.getElementById("volumeBesi").value =
        volume.toFixed(3);

    document.getElementById("volumeRAB").value =
        volume.toFixed(3);

    document.getElementById("statusHitung").textContent =
        "Volume berhasil dihitung.";

}


/* =========================================
   3. HITUNG KEBUTUHAN MATERIAL
========================================= */

// Koefisien contoh per 1 m³.
// Bukan desain campuran beton laboratorium.

function hitungMaterial(volume) {

    const semen = volume * 7;
    const pasir = volume * 0.50;
    const split = volume * 0.80;
    const air = volume * 215;

    document.getElementById("hasilMaterial").innerHTML = `

        <div class="result">

            <h3>KEBUTUHAN MATERIAL BETON</h3>

            <p>
                Volume beton:
                <b>${angka(volume, 3)} m³</b>
            </p>

            <hr>

            <p>
                Semen:
                <b>${angka(semen)} zak</b>
            </p>

            <p>
                Pasir:
                <b>${angka(pasir, 3)} m³</b>
            </p>

            <p>
                Batu split:
                <b>${angka(split, 3)} m³</b>
            </p>

            <p>
                Air:
                <b>${angka(air, 1)} liter</b>
            </p>

        </div>

        <p class="small">
            Catatan: Angka material adalah perkiraan awal.
            Campuran sebenarnya harus mengikuti desain campuran
            dan pengujian mutu beton.
        </p>

    `;
}


/* =========================================
   4. HITUNG KEBUTUHAN BESI
========================================= */

function hitungBesi() {

    const volume = ambilNilai("volumeBesi");
    const beratPerM3 = ambilNilai("beratBesi");

    if (
        !Number.isFinite(volume) ||
        !Number.isFinite(beratPerM3) ||
        volume <= 0 ||
        beratPerM3 < 0
    ) {
        alert("Masukkan volume dan berat besi dengan benar.");
        return;
    }

    const totalBesi = volume * beratPerM3;

    document.getElementById("hasilBesi").innerHTML = `

        <div class="result">

            <h3>HASIL PERHITUNGAN BESI</h3>

            <p>
                Volume beton:
                <b>${angka(volume, 3)} m³</b>
            </p>

            <p>
                Perkiraan besi per m³:
                <b>${angka(beratPerM3)} kg</b>
            </p>

            <hr>

            <p>Total kebutuhan besi:</p>

            <div class="number">
                ${angka(totalBesi)} kg
            </div>

        </div>

        <p class="small">
            Perkiraan berat besi bukan perencanaan tulangan.
            Diameter, jarak, jumlah, sambungan, dan detail tulangan
            harus ditentukan berdasarkan desain struktur oleh
            tenaga ahli.
        </p>

    `;

}


/* =========================================
   5. HITUNG RAB
========================================= */

function hitungRAB() {

    const volume = ambilNilai("volumeRAB");

    const hargaSemen = ambilNilai("hargaSemen");
    const hargaPasir = ambilNilai("hargaPasir");
    const hargaSplit = ambilNilai("hargaSplit");
    const hargaAir = ambilNilai("hargaAir");

    const waste = ambilNilai("wasteRAB");

    const data = [
        volume,
        hargaSemen,
        hargaPasir,
        hargaSplit,
        hargaAir,
        waste
    ];

    if (
        data.some(n => !Number.isFinite(n)) ||
        volume <= 0 ||
        hargaSemen < 0 ||
        hargaPasir < 0 ||
        hargaSplit < 0 ||
        hargaAir < 0 ||
        waste < 0 ||
        waste > 100
    ) {
        alert("Periksa kembali data RAB.");
        return;
    }

    // Volume setelah tambahan waste
    const volumeTotal = volume * (1 + waste / 100);

    // Kebutuhan material
    const semen = volumeTotal * 7;
    const pasir = volumeTotal * 0.50;
    const split = volumeTotal * 0.80;
    const air = volumeTotal * 215;

    // Biaya material
    const biayaSemen = semen * hargaSemen;
    const biayaPasir = pasir * hargaPasir;
    const biayaSplit = split * hargaSplit;
    const biayaAir = air * hargaAir;

    const total =
        biayaSemen +
        biayaPasir +
        biayaSplit +
        biayaAir;

    hasilRABTerakhir = total;

    document.getElementById("hasilRAB").innerHTML = `

        <div class="result">

            <h3>RENCANA ANGGARAN BIAYA</h3>

            <p>
                Volume awal:
                <b>${angka(volume, 3)} m³</b>
            </p>

            <p>
                Tambahan waste:
                <b>${angka(waste)}%</b>
            </p>

            <p>
                Volume termasuk waste:
                <b>${angka(volumeTotal, 3)} m³</b>
            </p>

            <hr>

            <p>
                Semen (${angka(semen)} zak):
                <b>${rupiah(biayaSemen)}</b>
            </p>

            <p>
                Pasir (${angka(pasir, 3)} m³):
                <b>${rupiah(biayaPasir)}</b>
            </p>

            <p>
                Batu split (${angka(split, 3)} m³):
                <b>${rupiah(biayaSplit)}</b>
            </p>

            <p>
                Air (${angka(air, 1)} liter):
                <b>${rupiah(biayaAir)}</b>
            </p>

            <hr>

            <h3>TOTAL BIAYA MATERIAL</h3>

            <div class="number">
                ${rupiah(total)}
            </div>

        </div>

        <p class="small">
            Total ini hanya perkiraan biaya material.
            Belum termasuk upah pekerja, alat, transportasi,
            pajak, dan biaya lainnya.
        </p>

    `;

}


/* =========================================
   6. MEMBUAT TAMPILAN BESI DAN RAB
========================================= */

function buatTampilanTambahan() {

    const container = document.querySelector(".container");

    if (!container) {
        console.error("Container aplikasi tidak ditemukan.");
        return;
    }

    if (document.getElementById("fiturTambahan")) {
        return;
    }

    const fitur = document.createElement("div");

    fitur.id = "fiturTambahan";

    fitur.innerHTML = `

        <div class="card">

            <h2>Perhitungan Kebutuhan Besi</h2>

            <label>Volume Beton (m³)</label>

            <input
                type="number"
                id="volumeBesi"
                min="0"
                step="any"
                placeholder="Contoh: 2.25"
            >

            <label>Perkiraan Berat Besi per m³ (kg)</label>

            <input
                type="number"
                id="beratBesi"
                min="0"
                step="any"
                value="100"
            >

            <button
                class="btn-primary"
                onclick="hitungBesi()"
            >
                HITUNG BESI
            </button>

            <div id="hasilBesi">
                Belum ada perhitungan besi.
            </div>

        </div>


        <div class="card">

            <h2>Rencana Anggaran Biaya (RAB)</h2>

            <label>Volume Beton (m³)</label>

            <input
                type="number"
                id="volumeRAB"
                min="0"
                step="any"
                placeholder="Masukkan volume beton"
            >

            <label>Harga Semen per Zak (Rp)</label>

            <input
                type="number"
                id="hargaSemen"
                min="0"
                value="70000"
            >

            <label>Harga Pasir per m³ (Rp)</label>

            <input
                type="number"
                id="hargaPasir"
                min="0"
                value="250000"
            >

            <label>Harga Batu Split per m³ (Rp)</label>

            <input
                type="number"
                id="hargaSplit"
                min="0"
                value="300000"
            >

            <label>Harga Air per Liter (Rp)</label>

            <input
                type="number"
                id="hargaAir"
                min="0"
                value="10"
            >

            <label>Tambahan Waste (%)</label>

            <input
                type="number"
                id="wasteRAB"
                min="0"
                max="100"
                step="any"
                value="5"
            >

            <button
                class="btn-success"
                onclick="hitungRAB()"
            >
                HITUNG RAB
            </button>

            <div id="hasilRAB">
                Belum ada perhitungan RAB.
            </div>

        </div>


        <div class="card">

            <h2>Penyimpanan Proyek</h2>

            <p class="small">
                Data proyek disimpan di browser perangkat ini.
            </p>

            <button
                class="btn-success"
                onclick="simpanProyek()"
            >
                SIMPAN PROYEK
            </button>

            <button
                class="btn-primary"
                onclick="eksporCSV()"
            >
                EKSPOR CSV
            </button>

            <button
                class="btn-primary"
                onclick="cetakLaporan()"
            >
                CETAK / PDF
            </button>

            <h3 style="margin-top:20px">
                Daftar Proyek Tersimpan
            </h3>

            <div id="daftarProyek">
                Belum ada proyek tersimpan.
            </div>

        </div>

    `;

    container.appendChild(fitur);

}


/* =========================================
   7. SIMPAN PROYEK
========================================= */

function simpanProyek() {

    const nama = document.getElementById("namaProyek").value.trim();

    if (!nama) {
        alert("Masukkan nama proyek terlebih dahulu.");
        return;
    }

    if (volumeTerakhir <= 0) {
        alert("Hitung volume beton terlebih dahulu.");
        return;
    }

    const proyek = {

        id: Date.now(),

        nama: nama,

        tanggal: new Date().toLocaleDateString("id-ID"),

        volume: volumeTerakhir,

        rab: hasilRABTerakhir

    };

    try {

        const daftar = JSON.parse(
            localStorage.getItem("dataProyekBeton") || "[]"
        );

        daftar.push(proyek);

        localStorage.setItem(
            "dataProyekBeton",
            JSON.stringify(daftar)
        );

        tampilkanProyek();

        alert("Proyek berhasil disimpan.");

    } catch (error) {

        alert("Gagal menyimpan data proyek.");

        console.error(error);

    }

}


/* =========================================
   8. TAMPILKAN PROYEK
========================================= */

function tampilkanProyek() {

    const tempat = document.getElementById("daftarProyek");

    if (!tempat) return;

    let daftar = [];

    try {

        daftar = JSON.parse(
            localStorage.getItem("dataProyekBeton") || "[]"
        );

    } catch (error) {

        daftar = [];

    }

    if (daftar.length === 0) {

        tempat.innerHTML = "Belum ada proyek tersimpan.";

        return;

    }

    tempat.innerHTML = daftar.map((p, i) => `

        <div class="result">

            <h3>${i + 1}. ${escapeHTML(p.nama)}</h3>

            <p>
                Tanggal:
                ${escapeHTML(p.tanggal)}
            </p>

            <p>
                Volume:
                ${angka(p.volume, 3)} m³
            </p>

            <p>
                RAB:
                ${rupiah(p.rab || 0)}
            </p>

            <button
                class="btn-danger"
                onclick="hapusProyek(${Number(p.id)})"
            >
                HAPUS PROYEK
            </button>

        </div>

    `).join("");

}


/* =========================================
   9. HAPUS PROYEK
========================================= */

function hapusProyek(id) {

    if (!confirm("Apakah proyek ini ingin dihapus?")) {
        return;
    }

    try {

        let daftar = JSON.parse(
            localStorage.getItem("dataProyekBeton") || "[]"
        );

        daftar = daftar.filter(p => p.id !== id);

        localStorage.setItem(
            "dataProyekBeton",
            JSON.stringify(daftar)
        );

        tampilkanProyek();

    } catch (error) {

        alert("Gagal menghapus proyek.");

    }

}


/* =========================================
   10. EKSPOR DATA CSV
========================================= */

function eksporCSV() {

    let daftar = [];

    try {

        daftar = JSON.parse(
            localStorage.getItem("dataProyekBeton") || "[]"
        );

    } catch (error) {

        alert("Data proyek tidak dapat dibaca.");
        return;

    }

    if (daftar.length === 0) {

        alert("Belum ada proyek untuk diekspor.");

        return;

    }

    let csv = "Nama Proyek,Tanggal,Volume (m3),RAB (Rp)\n";

    daftar.forEach(p => {

        const nama =
            '"' + String(p.nama).replace(/"/g, '""') + '"';

        const tanggal =
            '"' + String(p.tanggal).replace(/"/g, '""') + '"';

        csv +=
            `${nama},${tanggal},${p.volume},${p.rab || 0}\n`;

    });

    const blob = new Blob(
        ["\uFEFF" + csv],
        { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "laporan-proyek-beton.csv";

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);

}


/* =========================================
   11. CETAK / SIMPAN PDF
========================================= */

function cetakLaporan() {

    window.print();

}


/* =========================================
   12. SAAT APLIKASI DIBUKA
========================================= */

function mulaiAplikasi() {

    buatTampilanTambahan();

    tampilkanProyek();

    const status = document.createElement("p");

    status.id = "statusHitung";

    status.className = "small";

    status.textContent = "Aplikasi siap digunakan.";

    const tombol = document.querySelector(
        'button[onclick="hitungVolume()"]'
    );

    if (tombol && tombol.parentElement) {
        tombol.parentElement.appendChild(status);
    }

    console.log("Kalkulator Beton V6.0 berhasil dimuat.");

}


if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        mulaiAplikasi
    );

} else {

    mulaiAplikasi();

}
