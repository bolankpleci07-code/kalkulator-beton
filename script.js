function hitung() {

    const nama = document.getElementById(
        "namaProyek"
    ).value;

    const panjang = Number(
        document.getElementById("panjang").value
    );

    const lebar = Number(
        document.getElementById("lebar").value
    );

    const existing = Number(
        document.getElementById("existing").value
    );

    const design = Number(
        document.getElementById("design").value
    );

    if (!nama || panjang <= 0 || lebar <= 0) {
        alert("Periksa nama proyek dan ukuran grid!");
        return;
    }

    const luas = panjang * lebar;

    const beda = existing - design;

    let cut = 0;
    let fill = 0;

    if (beda > 0) {
        cut = luas * beda;
    } else if (beda < 0) {
        fill = luas * Math.abs(beda);
    }

    const net = cut - fill;

    document.getElementById("hasil").innerHTML = `
        <h3>Hasil Perhitungan</h3>
        <p>Proyek: ${nama}</p>
        <p>Luas Grid: ${luas.toFixed(2)} m²</p>
        <p>Volume Cut: ${cut.toFixed(3)} m³</p>
        <p>Volume Fill: ${fill.toFixed(3)} m³</p>
        <p>Volume Bersih: ${net.toFixed(3)} m³</p>
    `;
}