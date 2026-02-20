import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const karyawanData = [
    {
        nama: "Budi Santoso",
        email: "budi@mail.com",
        password: "password123",
        role: "ADMIN",
    },
    {
        nama: "Siti Nurhaliza",
        email: "siti@mail.com",
        password: "password123",
        role: "KARYAWAN",
    },
    {
        nama: "Ahmad Rizky",
        email: "ahmad@mail.com",
        password: "password123",
        role: "KARYAWAN",
    },
    {
        nama: "Dewi Lestari",
        email: "dewi@mail.com",
        password: "password123",
        role: "KARYAWAN",
    },
    {
        nama: "Rudi Hartono",
        email: "rudi@mail.com",
        password: "password123",
        role: "KARYAWAN",
    },
];

async function main() {
    for (const data of karyawanData) {
        const karyawan = await prisma.karyawan.upsert({
            where: { email: data.email },
            update: {},
            create: data,
        });
        console.log(`✅ Created: ${karyawan.nama} (${karyawan.role})`);
    }

    // Seed Transactions
    const transactionData = [
        {
            title: "Iuran Kas Bulanan Januari",
            amount: 50000,
            type: "PEMASUKAN",
            date: new Date("2026-01-05"),
            note: "Iuran bulan Januari",
            createdBy: 1,
        },
        {
            title: "Iuran Kas Bulanan Januari",
            amount: 50000,
            type: "PEMASUKAN",
            date: new Date("2026-01-05"),
            createdBy: 2,
        },
        {
            title: "Iuran Kas Bulanan Januari",
            amount: 50000,
            type: "PEMASUKAN",
            date: new Date("2026-01-06"),
            createdBy: 3,
        },
        {
            title: "Beli Air Galon",
            amount: 20000,
            type: "PENGELUARAN",
            date: new Date("2026-01-10"),
            note: "2 galon untuk kantor",
            createdBy: 1,
        },
        {
            title: "Beli Snack Rapat",
            amount: 75000,
            type: "PENGELUARAN",
            date: new Date("2026-01-15"),
            note: "Snack rapat mingguan",
            createdBy: 1,
        },
        {
            title: "Iuran Kas Bulanan Februari",
            amount: 50000,
            type: "PEMASUKAN",
            date: new Date("2026-02-03"),
            createdBy: 4,
        },
        {
            title: "Iuran Kas Bulanan Februari",
            amount: 50000,
            type: "PEMASUKAN",
            date: new Date("2026-02-03"),
            createdBy: 5,
        },
        {
            title: "Bayar Listrik",
            amount: 150000,
            type: "PENGELUARAN",
            date: new Date("2026-02-05"),
            note: "Tagihan listrik Februari",
            createdBy: 1,
        },
        {
            title: "Denda Telat Bayar Kas",
            amount: 10000,
            type: "PEMASUKAN",
            date: new Date("2026-02-10"),
            note: "Denda keterlambatan",
            createdBy: 3,
        },
        {
            title: "Beli ATK",
            amount: 35000,
            type: "PENGELUARAN",
            date: new Date("2026-02-15"),
            note: "Pulpen, kertas, dll",
            createdBy: 1,
        },
    ];

    for (const data of transactionData) {
        const transaction = await prisma.transaction.create({
            data,
        });
        console.log(`💰 Transaction: ${transaction.title} (${transaction.type} - Rp${transaction.amount})`);
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
