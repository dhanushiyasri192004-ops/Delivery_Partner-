import { createSlice } from '@reduxjs/toolkit';

const initialRooms = [
  { number: '101', type: 'Deluxe Room', price: '₹3,200', status: 'Occupied',  guest: 'Amit Sharma',  checkout: '17 Jul' },
  { number: '102', type: 'Deluxe Room', price: '₹3,200', status: 'Available', guest: null,            checkout: null },
  { number: '103', type: 'Deluxe Room', price: '₹3,200', status: 'Cleaning',  guest: null,            checkout: null },
  { number: '104', type: 'Superior Room', price: '₹2,800', status: 'Maintenance', guest: null,        checkout: null },
  { number: '105', type: 'Deluxe Room', price: '₹3,200', status: 'Reserved',  guest: 'Priya Patel',  checkout: '19 Jul' },
  { number: '106', type: 'Superior Room', price: '₹2,800', status: 'Occupied', guest: 'Rahul Verma', checkout: '17 Jul' },
  { number: '107', type: 'Suite Room',  price: '₹4,500', status: 'Occupied',  guest: 'Sneha Iyer',   checkout: '19 Jul' },
  { number: '108', type: 'Deluxe Room', price: '₹3,200', status: 'Cleaning',  guest: null,            checkout: null },
  { number: '109', type: 'Superior Room', price: '₹2,800', status: 'Available', guest: null,          checkout: null },
  { number: '110', type: 'Deluxe Room', price: '₹3,200', status: 'Available', guest: null,            checkout: null },
  { number: '111', type: 'Suite Room',  price: '₹4,500', status: 'Available', guest: null,            checkout: null },
  { number: '112', type: 'Deluxe Room', price: '₹3,200', status: 'Available', guest: null,            checkout: null },
];

const initialBookings = [
  { id: 'BK1001', guest: 'Amit Sharma',  initials: 'AS', roomType: 'Deluxe Room',   dates: '15 Jul – 17 Jul', nights: 2, source: 'Direct',      payment: 'Paid',    status: 'pending',  assignedRoom: null },
  { id: 'BK1002', guest: 'Priya Patel',  initials: 'PP', roomType: 'Superior Room', dates: '18 Jul – 19 Jul', nights: 1, source: 'MMT',          payment: 'Paid',    status: 'pending',  assignedRoom: null },
  { id: 'BK1003', guest: 'Rahul Verma',  initials: 'RV', roomType: 'Deluxe Room',   dates: '16 Jul – 17 Jul', nights: 1, source: 'Direct',      payment: 'Pending', status: 'pending',  assignedRoom: null },
  { id: 'BK1004', guest: 'Sneha Iyer',   initials: 'SI', roomType: 'Suite Room',    dates: '17 Jul – 19 Jul', nights: 2, source: 'Booking.com', payment: 'Paid',    status: 'accepted', assignedRoom: '107' },
  { id: 'BK1005', guest: 'Vikram Singh', initials: 'VS', roomType: 'Deluxe Room',   dates: '20 Jul – 22 Jul', nights: 2, source: 'Direct',      payment: 'Paid',    status: 'checkedIn', assignedRoom: '101' },
];

const initialHousekeeping = [
  { room: '103', task: 'Post Checkout Cleaning', staff: 'Ravi Kumar',  status: 'In Progress' },
  { room: '108', task: 'Post Checkout Cleaning', staff: 'Meena Devi',  status: 'Pending' },
];

const staySlice = createSlice({
  name: 'stay',
  initialState: {
    bookings: initialBookings,
    rooms: initialRooms,
    housekeeping: initialHousekeeping,
  },
  reducers: {
    // STEP 3 – Accept or Reject a booking
    acceptBooking: (state, action) => {
      const booking = state.bookings.find(b => b.id === action.payload);
      if (booking) booking.status = 'accepted';
    },
    rejectBooking: (state, action) => {
      const booking = state.bookings.find(b => b.id === action.payload);
      if (booking) booking.status = 'rejected';
    },

    // STEP 4 – Assign a room (Available → Reserved)
    assignRoom: (state, action) => {
      const { bookingId, roomNumber } = action.payload;
      const booking = state.bookings.find(b => b.id === bookingId);
      const room = state.rooms.find(r => r.number === roomNumber);
      if (booking && room) {
        booking.assignedRoom = roomNumber;
        booking.status = 'roomAssigned';
        room.status = 'Reserved';
        room.guest = booking.guest;
        room.checkout = booking.dates.split('–')[1]?.trim() || null;
      }
    },

    // STEP 5 – Guest Check-in (Reserved → Occupied)
    checkInGuest: (state, action) => {
      const bookingId = action.payload;
      const booking = state.bookings.find(b => b.id === bookingId);
      if (booking) {
        booking.status = 'checkedIn';
        const room = state.rooms.find(r => r.number === booking.assignedRoom);
        if (room) {
          room.status = 'Occupied';
          room.guest = booking.guest;
        }
      }
    },

    // STEP 7 – Guest Check-out (Occupied → Cleaning)
    checkOutGuest: (state, action) => {
      const bookingId = action.payload;
      const booking = state.bookings.find(b => b.id === bookingId);
      if (booking) {
        booking.status = 'checkedOut';
        const room = state.rooms.find(r => r.number === booking.assignedRoom);
        if (room) {
          room.status = 'Cleaning';
          room.guest = null;
          // Auto-add housekeeping task
          const alreadyExists = state.housekeeping.find(h => h.room === room.number);
          if (!alreadyExists) {
            state.housekeeping.unshift({
              room: room.number,
              task: 'Post Checkout Cleaning',
              staff: 'Unassigned',
              status: 'Pending',
            });
          }
        }
      }
    },

    // STEP 8 – Room Cleaning done (Cleaning → Available)
    markRoomCleaned: (state, action) => {
      const roomNumber = action.payload;
      const room = state.rooms.find(r => r.number === roomNumber);
      if (room) {
        room.status = 'Available';
        room.guest = null;
        room.checkout = null;
      }
      state.housekeeping = state.housekeeping.filter(h => h.room !== roomNumber);
    },

    // Add a new booking (Walk-in or manual)
    addBooking: (state, action) => {
      state.bookings.unshift(action.payload);
    },

    // Update housekeeping staff assignment
    assignHousekeepingStaff: (state, action) => {
      const { room, staff } = action.payload;
      const task = state.housekeeping.find(h => h.room === room);
      if (task) task.staff = staff;
    },
    // Add a new room
    addRoom: (state, action) => {
      state.rooms.push(action.payload);
    },
    // Update a room
    updateRoom: (state, action) => {
      const { number, type, price, status, guest, checkout } = action.payload;
      const index = state.rooms.findIndex(r => r.number === number);
      if (index !== -1) {
        state.rooms[index] = {
          ...state.rooms[index],
          type,
          price,
          status,
          guest: (status === 'Available' || status === 'Cleaning' || status === 'Maintenance') ? null : guest,
          checkout: (status === 'Available' || status === 'Cleaning' || status === 'Maintenance') ? null : checkout
        };
      }
    },
    // Delete a room
    deleteRoom: (state, action) => {
      state.rooms = state.rooms.filter(r => r.number !== action.payload);
    },
  }
});

export const {
  acceptBooking,
  rejectBooking,
  assignRoom,
  checkInGuest,
  checkOutGuest,
  markRoomCleaned,
  addBooking,
  assignHousekeepingStaff,
  addRoom,
  updateRoom,
  deleteRoom,
} = staySlice.actions;

export default staySlice.reducer;
