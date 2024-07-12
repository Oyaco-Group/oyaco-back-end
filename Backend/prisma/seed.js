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
      { name: "Child Care" },
      { name: "Baby Food" },
      { name: "Clothing" },
      { name: "Personal Care" },
      { name: "Baby Care" },
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
        name: "Baby Monitor",
        image: "https://example.com/product_babymonitor.jpg",
        sku: "SKU-CHILDCARE-001",
        price: "150",
        category_id: 1, // Pastikan category_id sesuai dengan id kategori yang telah di-seed
        isdelete: false,
      },
      {
        name: "Baby Stroller",
        image: "https://example.com/product_babystroller.jpg",
        sku: "SKU-CHILDCARE-002",
        price: "200",
        category_id: 1,
        isdelete: false,
      },
      {
        name: "Baby Formula",
        image: "https://example.com/product_babyformula.jpg",
        sku: "SKU-BABYFOOD-002",
        price: "25",
        category_id: 2,
        isdelete: false,
      },
      {
        name: "Baby Snacks",
        image: "https://example.com/product_babysnacks.jpg",
        sku: "SKU-BABYFOOD-006",
        price: "10",
        category_id: 2,
        isdelete: false,
      },
      {
        name: "Baby Jacket",
        image: "https://example.com/product_babyjacket.jpg",
        sku: "SKU-CLOTHING-002",
        price: "25",
        category_id: 3,
        isdelete: false,
      },
      {
        name: "Baby Mittens",
        image: "https://example.com/product_babymittens.jpg",
        sku: "SKU-CLOTHING-005",
        price: "4",
        category_id: 3,
        isdelete: false,
      },
      {
        name: "Baby Shampoo",
        image: "https://example.com/product_babyshampoo.jpg",
        sku: "SKU-PERSONALCARE-001",
        price: "10",
        category_id: 4,
        isdelete: false,
      },
      {
        name: "Baby Oil",
        image: "https://example.com/product_babyoil.jpg",
        sku: "SKU-PERSONALCARE-005",
        price: "9",
        category_id: 4,
        isdelete: false,
      },
      {
        name: "Diaper Bag",
        image: "https://example.com/product_diaperbag.jpg",
        sku: "SKU-BABYCARE-001",
        price: "50",
        category_id: 5,
        isdelete: false,
      },
      {
        name: "Diapers",
        image: "https://example.com/product_diapers.jpg",
        sku: "SKU-BABYCARE-003",
        price: "25",
        category_id: 5,
        isdelete: false,
      },

      // Tambahkan produk lain sesuai kebutuhan
    ];

    await prisma.masterProduct.createMany({
      data: masterProducts,
      skipDuplicates: true, // Menghindari duplikasi jika sku sudah ada
    });

    console.log("Seeding completed for master_products");

    // Data seeding untuk tabel warehouse
    const warehouse = [
      { name: "Warehouse 1", location: "Location 1", isdelete: false },
      { name: "Warehouse 2", location: "Location 2", isdelete: false },
      { name: "Warehouse 3", location: "Location 3", isdelete: false },
    ];

    await prisma.warehouse.createMany({
      data: warehouse,
      skipDuplicates: true,
    });
    console.log("Seeding completed for warehouses");

    // Data seeding untuk tabel inventory
    const inventories = [
      {
        master_product_id: 1,
        warehouse_id: 2, // Tolong lihat destination di productMovement
        quantity: 10,
        expiration_status: false,
        isdelete: false,
      },
      {
        master_product_id: 2,
        warehouse_id: 2, // Tolong lihat destination di productMovement
        quantity: 50,
        expiration_status: false,
        isdelete: false,
      },
    ];
    await prisma.inventory.createMany({
      data: inventories,
      skipDuplicates: true,
    });

    console.log("Seeding completed for inventory");
    // Data seeding untuk product_movement
    const productMovements = [
      {
        user_id: 1,
        master_product_id: 1,
        inventory_id: 1,
        movement_type: "in",
        origin: "Warehouse 1",
        destination: "Warehouse 2",
        quantity: 10,
        iscondition_good: true,
        arrival_date: new Date("2023-01-01"),
        expiration_date: new Date("2024-01-01"),
      },
      {
        user_id: 1,
        master_product_id: 2,
        inventory_id: 1,
        movement_type: "in",
        origin: "Warehouse 1",
        destination: "Warehouse 2",
        quantity: 50,
        iscondition_good: true,
        arrival_date: new Date("2023-01-01"),
        expiration_date: new Date("2024-01-01"),
      },
    ];
    await prisma.productMovement.createMany({
      data: productMovements,
      skipDuplicates: true,
    });
    console.log("Seeding completed for product movement");
    // Data seeding untuk tabel order
    const orders = [
      {
        user_id: 2,
        payment_type: "Cash",
        order_status: "Delivered",
        buyer_status: "Offline",
      },
    ];
    await prisma.order.createMany({
      data: orders,
      skipDuplicates: true,
    });
    console.log("Seeding completed for order");
    // Data seeding untuk tabel complaint
    const complaints = [
      {
        order_id: 1,
        iscomplaint: true,
        text: "Product is not in good condition",
      },
    ];
    await prisma.complaint.createMany({
      data: complaints,
      skipDuplicates: true,
    });
    console.log("Seeding completed for complaint");
    // Data seeding tabel order_item
    const orderItems = [
      {
        order_id: 1,
        master_product_id: 1,
        inventory_id: 1,
        quantity: 4,
      },
      // {
      //   order_id: 1,
      //   master_product_id: 2, // Tolong lihat inventory
      //   inventory_id: 2,
      //   quantity: 7,
      // },
    ];
    await prisma.order_item.createMany({
      data: orderItems,
      skipDuplicates: true,
    });
    console.log("Seeding completed for order items");
  } catch (e) {
    console.error("Error during seeding:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
