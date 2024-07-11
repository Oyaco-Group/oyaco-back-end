const prisma = require("../lib/prisma");

async function main() {
  try {
    // Data seeding untuk tabel user
    const users = [
      {
        name: "John Doe",
        email: "john.doe@example.com",
        address: "123 Main St",
        password: "password123",
        user_role: "admin",
        image_url: "http://example.com/images/john.jpg",
        isdelete: false,
      },
      {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        address: "456 Elm St",
        password: "password456",
        user_role: "user",
        image_url: "http://example.com/images/jane.jpg",
        isdelete: false,
      },
      // Tambahkan pengguna lain sesuai kebutuhan
    ];

    await prisma.user.createMany({
      data: users,
      skipDuplicates: true, // Menghindari duplikasi jika email sudah ada
    });

    console.log("Seeding completed for users");

    // Data seeding untuk tabel category
    const categories = [
      { name: "Technology" },
      { name: "Science" },
      { name: "Arts" },
      { name: "Sports" },
      // Tambahkan kategori lain sesuai kebutuhan
    ];

    await prisma.category.createMany({
      data: categories,
      skipDuplicates: true, // Menghindari duplikasi jika name sudah ada
    });

    console.log("Seeding completed for categories");

    // Data seeding untuk tabel master_product
    const masterProducts = [
      {
        name: "VGA",
        image_url: "https://example.com/product1.jpg",
        sku: "SKU-001",
        price: "100",
        category_id: 1, // Pastikan category_id sesuai dengan id kategori yang telah di-seed
        isdelete: false,
      },
      // Tambahkan produk lain sesuai kebutuhan
    ];

    await prisma.masterProduct.createMany({
      data: masterProducts,
      skipDuplicates: true, // Menghindari duplikasi jika sku sudah ada
    });

    console.log("Seeding completed for master_products");
  } catch (e) {
    console.error("Error during seeding:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
