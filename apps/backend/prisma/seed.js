import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

//Password sama semua jar bedanya udah di hash
const karyawanData = [
  {
    nama: "Budi Santoso",
    email: "admin@mail.com",
    password: "$2b$10$9664qtcVEIGVC7jsy6Ros.owj24.F0AMw4j/bWTutKm3oAICC4DsG",
    role: "ADMIN",
  },
  {
    nama: "Siti Nurhaliza",
    email: "karyawan@mail.com",
    password: "$2b$10$9664qtcVEIGVC7jsy6Ros.owj24.F0AMw4j/bWTutKm3oAICC4DsG",
    role: "KARYAWAN",
  },
  {
    nama: "Ahmad Rizky",
    email: "ahmad@mail.com",
    password: "$2b$10$9664qtcVEIGVC7jsy6Ros.owj24.F0AMw4j/bWTutKm3oAICC4DsG",
    role: "KARYAWAN",
  },
  {
    nama: "Dewi Lestari",
    email: "dewi@mail.com",
    password: "$2b$10$9664qtcVEIGVC7jsy6Ros.owj24.F0AMw4j/bWTutKm3oAICC4DsG",
    role: "KARYAWAN",
  },
  {
    nama: "Rudi Hartono",
    email: "rudi@mail.com",
    password: "$2b$10$9664qtcVEIGVC7jsy6Ros.owj24.F0AMw4j/bWTutKm3oAICC4DsG",
    role: "KARYAWAN",
  },
];

async function main() {
  // Array untuk menyimpan data user yang berhasil dimasukkan
  const createdUsers = [];

  for (const data of karyawanData) {
    const karyawan = await prisma.karyawan.upsert({
      where: { email: data.email },
      update: {},
      create: data,
    });
    createdUsers.push(karyawan);
    console.log(
      ` Created: ${karyawan.nama} (${karyawan.role}) - ID: ${karyawan.id}`
    );
  }

  // Pastikan minimal ada 5 user sebelum lanjut
  if (createdUsers.length < 5) {
    console.error("Gagal membuat cukup user untuk transaksi!");
    return;
  }

  // Ambil ID dari hasil yang terbuat
  const user1_id = createdUsers[0].id;
  const user2_id = createdUsers[1].id;
  const user3_id = createdUsers[2].id;
  const user4_id = createdUsers[3].id;
  const user5_id = createdUsers[4].id;

  // Menghapus data transaksi lama agar tidak double saat dijalankan ulang
  await prisma.transaction.deleteMany({});
  console.log("🧹 Transaksi lama dibersihkan!");

  // Seed Transactions
  const transactionData = [
    {
      title: "Iuran Kas Bulanan Januari",
      amount: 500000,
      type: "PEMASUKAN",
      date: new Date("2026-01-05"),
      note: "Iuran bulan Januari",
      createdBy: user1_id,
    },
    {
      title: "Iuran Kas Bulanan Januari",
      amount: 50000,
      type: "PEMASUKAN",
      date: new Date("2026-01-05"),
      createdBy: user2_id,
    },
    {
      title: "Iuran Kas Bulanan Januari",
      amount: 50000,
      type: "PEMASUKAN",
      date: new Date("2026-01-06"),
      createdBy: user3_id,
    },
    {
      title: "Beli Air Galon",
      amount: 20000,
      type: "PENGELUARAN",
      date: new Date("2026-01-10"),
      note: "2 galon untuk kantor",
      createdBy: user1_id,
    },
    {
      title: "Beli Snack Rapat",
      amount: 75000,
      type: "PENGELUARAN",
      date: new Date("2026-01-15"),
      note: "Snack rapat mingguan",
      createdBy: user1_id,
    },
    {
      title: "Iuran Kas Bulanan Februari",
      amount: 50000,
      type: "PEMASUKAN",
      date: new Date("2026-02-03"),
      createdBy: user4_id,
    },
    {
      title: "Iuran Kas Bulanan Februari",
      amount: 50000,
      type: "PEMASUKAN",
      date: new Date("2026-02-03"),
      createdBy: user5_id,
    },
    {
      title: "Bayar Listrik",
      amount: 150000,
      type: "PENGELUARAN",
      date: new Date("2026-02-05"),
      note: "Tagihan listrik Februari",
      createdBy: user1_id,
    },
    {
      title: "Denda Telat Bayar Kas",
      amount: 10000,
      type: "PEMASUKAN",
      date: new Date("2026-02-10"),
      note: "Denda keterlambatan",
      createdBy: user3_id,
    },
    {
      title: "Beli ATK",
      amount: 35000,
      type: "PENGELUARAN",
      date: new Date("2026-02-15"),
      note: "Pulpen, kertas, dll",
      createdBy: user1_id,
    },
  ];

  for (const data of transactionData) {
    const transaction = await prisma.transaction.create({
      data,
    });
    console.log(
      `💰 Transaction: ${transaction.title} (${transaction.type} - Rp${transaction.amount})`
    );
  }

  console.log("\n🎉 Seeding selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
