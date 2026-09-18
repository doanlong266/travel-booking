const assert = require('assert');

// Mock browser localStorage
const storage = {};
global.localStorage = {
  getItem: (key) => storage[key] || null,
  setItem: (key, val) => { storage[key] = String(val); },
  removeItem: (key) => { delete storage[key]; },
  clear: () => { Object.keys(storage).forEach(k => delete storage[k]); }
};

console.log('--- Testing Guest Lookup & Persistence Core Logic ---');

// Test dataset matching
const mockOrders = [
  {
    bookingId: 'TKT-VN-2026-89412X',
    pnrCode: 'VN89412X',
    transportType: 'flight',
    carrierName: 'Vietnam Airlines',
    origin: { city: 'Hà Nội', code: 'HAN' },
    destination: { city: 'Hồ Chí Minh', code: 'SGN' },
    departureTime: '2026-10-20T08:00:00+07:00',
    arrivalTime: '2026-10-20T10:15:00+07:00',
    durationMinutes: 135,
    passengers: [
      { fullName: 'NGUYEN VAN AN', phone: '0912345678', email: 'doanle@omniticket.vn', seatNumber: '12A' },
      { fullName: 'LE THI BINH', phone: '0912345678', email: 'doanle@omniticket.vn', seatNumber: '12B' }
    ],
    contact: { fullName: 'Nguyễn Văn An', phone: '0912345678', email: 'doanle@omniticket.vn' },
    totalAmount: 3850000,
    paymentStatus: 'confirmed',
    qrData: 'OMNITICKET|TKT-VN-2026-89412X|VN89412X'
  },
  {
    bookingId: 'TKT-TRAIN-2026-44810A',
    pnrCode: 'SE1-44810',
    transportType: 'train',
    carrierName: 'Đường sắt Việt Nam',
    origin: { city: 'Hà Nội', code: 'HAN' },
    destination: { city: 'Đà Nẵng', code: 'DAD' },
    departureTime: '2026-10-25T19:30:00+07:00',
    arrivalTime: '2026-10-26T11:45:00+07:00',
    durationMinutes: 975,
    passengers: [
      { fullName: 'TRAN MINH TRI', phone: '0987654321', email: 'minhtri@gmail.com', seatNumber: 'Toa 3 - Ghế 18' }
    ],
    contact: { fullName: 'Trần Minh Trí', phone: '0987654321', email: 'minhtri@gmail.com' },
    totalAmount: 1150000,
    paymentStatus: 'confirmed'
  }
];

function normalizeText(input) {
  return (input || '').trim().toLowerCase().replace(/[\s-+()]/g, '');
}

function lookup(bookingId, phoneOrEmail) {
  const cleanId = (bookingId || '').trim().toUpperCase();
  const cleanIdent = normalizeText(phoneOrEmail);

  return mockOrders.find(b => {
    const matchId = 
      b.bookingId.toUpperCase() === cleanId ||
      b.pnrCode.toUpperCase() === cleanId ||
      cleanId.includes(b.pnrCode.toUpperCase()) ||
      b.bookingId.toUpperCase().includes(cleanId);

    if (!matchId) return false;

    const contactPhoneNorm = normalizeText(b.contact.phone);
    const contactEmailNorm = (b.contact.email || '').trim().toLowerCase();
    
    const isPhoneMatch = contactPhoneNorm.includes(cleanIdent) || cleanIdent.includes(contactPhoneNorm);
    const isEmailMatch = contactEmailNorm === cleanIdent;

    const isPassengerMatch = b.passengers.some(p => {
      const pPhone = normalizeText(p.phone || '');
      const pEmail = (p.email || '').trim().toLowerCase();
      return (pPhone && (pPhone.includes(cleanIdent) || cleanIdent.includes(pPhone))) ||
             (pEmail && pEmail === cleanIdent);
    });

    return isPhoneMatch || isEmailMatch || isPassengerMatch;
  });
}

// 1. Test Lookup by full Booking ID + Phone
const res1 = lookup('TKT-VN-2026-89412X', '0912345678');
assert(res1 !== undefined, 'Lookup by full booking ID + phone should find ticket');
assert.strictEqual(res1.pnrCode, 'VN89412X');
console.log('✓ Test 1 Passed: Lookup by Booking ID + Phone');

// 2. Test Lookup by PNR Code + Email
const res2 = lookup('VN89412X', 'doanle@omniticket.vn');
assert(res2 !== undefined, 'Lookup by PNR code + email should find ticket');
assert.strictEqual(res2.bookingId, 'TKT-VN-2026-89412X');
console.log('✓ Test 2 Passed: Lookup by PNR Code + Email');

// 3. Test Two-Factor Security (Wrong Phone/Email returns undefined)
const res3 = lookup('TKT-VN-2026-89412X', '0999999999');
assert.strictEqual(res3, undefined, 'Lookup with wrong phone should fail for security');
console.log('✓ Test 3 Passed: Two-factor verification blocks unauthorized access');

// 4. Test Train Lookup
const res4 = lookup('SE1-44810', '0987654321');
assert(res4 !== undefined, 'Train lookup by PNR should succeed');
assert.strictEqual(res4.passengers[0].seatNumber, 'Toa 3 - Ghế 18');
console.log('✓ Test 4 Passed: Train ticket lookup');

// 5. Test LocalStorage Persistence logic
const recentKey = 'omniticket_guest_recent_bookings_v1';
const draftKey = 'omniticket_guest_draft_booking_v1';

// Save draft
const sampleDraft = {
  bookingId: 'TKT-DRAFT-123',
  paymentExpiresAt: Date.now() + 600000,
  createdAt: Date.now()
};
localStorage.setItem(draftKey, JSON.stringify(sampleDraft));
const readDraft = JSON.parse(localStorage.getItem(draftKey));
assert.strictEqual(readDraft.bookingId, 'TKT-DRAFT-123');
console.log('✓ Test 5 Passed: Draft booking LocalStorage persistence');

// Save recent bookings with 5 limit
let recents = [];
for (let i = 1; i <= 7; i++) {
  recents.unshift({ bookingId: `TKT-${i}` });
  recents = recents.slice(0, 5);
}
localStorage.setItem(recentKey, JSON.stringify(recents));
const savedRecents = JSON.parse(localStorage.getItem(recentKey));
assert.strictEqual(savedRecents.length, 5);
assert.strictEqual(savedRecents[0].bookingId, 'TKT-7');
console.log('✓ Test 6 Passed: Recent bookings capped at maximum 5 items');

console.log('🎉 ALL UNIT & PERSISTENCE TESTS PASSED SUCCESSFULLY!');
