import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const karyawanData = [
        {
            nama: "Budi Santoso",
            email: "budi@mail.com",
            password: "password123",
            role: "ADMIN" as const,
        },
        {
            nama: "Siti Nurhaliza",
            email: "siti@mail.com",
            password: "password123",
            role: "KARYAWAN" as const,
        },
        {
            nama: "Ahmad Rizky",
            email: "ahmad@mail.com",
            password: "password123",
            role: "KARYAWAN" as const,
        },
        {
            nama: "Dewi Lestari",
            email: "dewi@mail.com",
            password: "password123",
            role: "KARYAWAN" as const,
        },
        {
            nama: "Rudi Hartono",
            email: "rudi@mail.com",
            password: "password123",
            role: "KARYAWAN" as const,
        },
    ];

    for (const data of karyawanData) {
        const karyawan = await prisma.karyawan.upsert({
            where: { email: data.email },
            update: {},
            create: data,
        });
        console.log(`✅ Created: ${karyawan.nama} (${karyawan.role})`);
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
    });
