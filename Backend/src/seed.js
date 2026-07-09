const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('./config/env');
const User = require('./modules/auth/user.model');
const DeliveryPartner = require('./modules/deliveryPartner/delivery.model');
const Technician = require('./modules/technician/technician.model');
const Executive = require('./modules/executive/executive.model');
const Wallet = require('./modules/wallet/wallet.model');
const Order = require('./modules/orders/order.model');
const Booking = require('./modules/bookings/booking.model');
const ExecutiveTrip = require('./modules/executive/trip.model');

const seedData = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await mongoose.connect(config.mongoUri);
    console.log('Connected.');

    // Clear existing test entries
    await User.deleteMany({ email: { $in: ['rider@test.com', 'tech@test.com', 'exec@test.com', 'client@test.com', 'vendor@test.com'] } });
    await Order.deleteMany({});
    await Booking.deleteMany({});
    await ExecutiveTrip.deleteMany({});

    console.log('Hashing passwords...');
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    // Create Base Users
    console.log('Creating seed users...');
    const riderUser = await User.create({
      name: 'Ramesh Kumar',
      email: 'rider@test.com',
      password,
      mobileNumber: '9876543210',
      role: 'delivery_partner',
      isVerified: true
    });

    const techUser = await User.create({
      name: 'Suresh Raina',
      email: 'tech@test.com',
      password,
      mobileNumber: '8765432109',
      role: 'technician',
      isVerified: true
    });

    const execUser = await User.create({
      name: 'Vikram Singh',
      email: 'exec@test.com',
      password,
      mobileNumber: '7654321098',
      role: 'executive',
      isVerified: true
    });

    const clientUser = await User.create({
      name: 'Arun Kumar',
      email: 'client@test.com',
      password,
      mobileNumber: '9998887776',
      role: 'customer',
      isVerified: true
    });

    const vendorUser = await User.create({
      name: 'Fresh Bites Restaurant',
      email: 'vendor@test.com',
      password,
      mobileNumber: '8887776665',
      role: 'vendor',
      isVerified: true
    });

    // Create Profiles
    console.log('Creating profiles...');
    const partner = await DeliveryPartner.create({
      userId: riderUser._id,
      aadhaarNumber: '123456789012',
      panNumber: 'ABCDE1234F',
      vehicle: {
        name: 'Hero Splendor',
        number: 'KA-01-AB-1234',
        licenseNumber: 'DL1234567890',
        rcBookUrl: 'http://res.cloudinary.com/rc_book.jpg'
      },
      bankDetails: {
        bankName: 'State Bank of India',
        accountHolderName: 'Ramesh Kumar',
        ifscCode: 'SBIN0001234',
        accountNumber: '100020003000',
        branch: 'Indiranagar'
      },
      status: 'online',
      isApproved: true
    });

    const technician = await Technician.create({
      userId: techUser._id,
      aadhaarNumber: '234567890123',
      panNumber: 'BCDEF2345G',
      technicianType: 'AC Technician',
      bankDetails: {
        bankName: 'HDFC Bank',
        accountHolderName: 'Suresh Raina',
        ifscCode: 'HDFC0000123',
        accountNumber: '200030004000',
        branch: 'HSR Layout'
      },
      status: 'online',
      isApproved: true
    });

    const executive = await Executive.create({
      userId: execUser._id,
      employeeId: 'EXE-987654',
      status: 'online',
      isApproved: true
    });

    // Create Wallets
    await Wallet.create({ userId: riderUser._id, balance: 1680, transactions: [] });
    await Wallet.create({ userId: techUser._id, balance: 450, transactions: [] });
    await Wallet.create({ userId: execUser._id, balance: 0, transactions: [] });

    // Seed Active Order for Rider
    console.log('Seeding active order...');
    await Order.create({
      customerId: clientUser._id,
      vendorId: vendorUser._id,
      deliveryPartnerId: partner._id,
      status: 'accepted',
      pickupOtp: '1234',
      deliveryOtp: '5678',
      earnings: {
        tripPay: 150,
        tips: 30,
        incentives: 20
      }
    });

    // Seed Active Booking for Technician
    console.log('Seeding active booking...');
    await Booking.create({
      customerId: clientUser._id,
      technicianId: technician._id,
      status: 'accepted',
      otp: '4321',
      earnings: 450
    });

    // Seed Active Trip for Executive
    console.log('Seeding active trip...');
    await ExecutiveTrip.create({
      vendorId: vendorUser._id,
      executiveId: executive._id,
      title: 'HSR Layout Hub Inspection',
      description: 'Review operating procedures and inventory counts',
      status: 'accepted'
    });

    console.log('Database seeding finished successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
