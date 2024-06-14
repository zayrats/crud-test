'use client'

export function tanggalBesok() {
    var besok = new Date();
    besok.setDate(besok.getDate() + 1);

    var tahun = besok.getFullYear();
    var bulan = (besok.getMonth() + 1).toString().padStart(2, '0'); // Bulan dimulai dari 0
    var tanggal = besok.getDate().toString().padStart(2, '0');

    return tahun + '-' + bulan + '-' + tanggal;
}

export function formatDate(dateString: string) {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" } as const;
    const formattedDate = date.toLocaleDateString("en-US", options);
    return formattedDate;
}
