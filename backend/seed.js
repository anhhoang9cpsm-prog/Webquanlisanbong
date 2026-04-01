const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const Field = require("./models/Field");
const Booking = require("./models/Booking");

const seed = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://127.0.0.1:27017/sanbong", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Field.deleteMany({});
    await Booking.deleteMany({});
    console.log("✅ Cleared existing data");

    // Create Owner User
    const ownerPassword = await bcrypt.hash("owner123", 10);
    const owner = await User.create({
      username: "owner1",
      name: "Nguyễn Văn Chủ",
      email: "owner@example.com",
      password: ownerPassword,
      role: "owner",
    });
    console.log("✅ Owner created:", owner.email);

    // Create Customer Users
    const customer1Password = await bcrypt.hash("customer123", 10);
    const customer1 = await User.create({
      username: "customer1",
      name: "Trần Văn A",
      email: "customer1@example.com",
      password: customer1Password,
      role: "customer",
    });

    const customer2Password = await bcrypt.hash("customer123", 10);
    const customer2 = await User.create({
      username: "customer2",
      name: "Lê Thị B",
      email: "customer2@example.com",
      password: customer2Password,
      role: "customer",
    });

    const customer3Password = await bcrypt.hash("customer123", 10);
    const customer3 = await User.create({
      username: "customer3",
      name: "Phạm Văn C",
      email: "customer3@example.com",
      password: customer3Password,
      role: "customer",
    });

    console.log("✅ 3 customers created");

    // Create Fields
    const fields = await Field.insertMany([
      {
        name: "Sân Bóng A",
        type: "5v5",
        price: 200000,
        image:
          "https://images.unsplash.com/photo-1431324155629-1a6deb6dec8d?w=400",
      },
      {
        name: "Sân Bóng B",
        type: "7v7",
        price: 250000,
        image:
          "https://images.unsplash.com/photo-1453728691401-a2f4e5100dd9?w=400",
      },
      {
        name: "Sân Futsal C",
        type: "Futsal",
        price: 150000,
        image:
          "https://images.unsplash.com/photo-1579185446028-ddc05e17e1d2?w=400",
      },
      {
        name: "Sân 11v11 D",
        type: "11v11",
        price: 350000,
        image:
          "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=400",
      },
      {
        name: "Sân Bóng E",
        type: "5v5",
        price: 180000,
        image:
          "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400",
      },
    ]);
    console.log(`✅ ${fields.length} fields created`);

    // Create Bookings (mix of statuses)
    const bookings = await Booking.insertMany([
      {
        fieldId: fields[0]._id,
        customerId: customer1._id,
        time: "07:00 - 09:00",
        totalPrice: 200000,
        status: "pending",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        fieldId: fields[1]._id,
        customerId: customer2._id,
        time: "09:00 - 11:00",
        totalPrice: 250000,
        status: "pending",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
      {
        fieldId: fields[0]._id,
        customerId: customer1._id,
        time: "15:00 - 17:00",
        totalPrice: 200000,
        status: "approved",
        createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
      },
      {
        fieldId: fields[2]._id,
        customerId: customer3._id,
        time: "17:00 - 19:00",
        totalPrice: 150000,
        status: "approved",
        createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
      },
      {
        fieldId: fields[3]._id,
        customerId: customer2._id,
        time: "19:00 - 21:00",
        totalPrice: 350000,
        status: "rejected",
        createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000),
      },
      {
        fieldId: fields[1]._id,
        customerId: customer3._id,
        time: "11:00 - 13:00",
        totalPrice: 250000,
        status: "approved",
        createdAt: new Date(Date.now() - 50 * 60 * 60 * 1000),
      },
    ]);
    console.log(`✅ ${bookings.length} bookings created`);

    console.log("\n✅ SEED DATA COMPLETED!\n");
    console.log("Owner Login (Admin):");
    console.log("  Email: owner@example.com");
    console.log("  Password: owner123\n");

    console.log("Customer Logins:");
    console.log("  Email: customer1@example.com | Password: customer123");
    console.log("  Email: customer2@example.com | Password: customer123");
    console.log("  Email: customer3@example.com | Password: customer123\n");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
};

seed();
