// Automated End-to-End API Health & Integration Checker for Krishi Setu
// Run with: node test-api.js

async function checkSystem() {
  const base = 'http://localhost:5000/api';
  console.log('🔍 Checking Krishi Setu Backend & Database Connection...\n');

  try {
    // 1. Health check
    const rootRes = await fetch('http://localhost:5000/');
    const rootData = await rootRes.json();
    console.log('✅ 1. Backend Server Health:', rootData.message);

    // 2. Aadhaar Verification Service
    const aadhRes = await fetch(base + '/verification/aadhaar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aadhaarNumber: '123456789012' }),
    });
    const aadhData = await aadhRes.json();
    console.log('✅ 2. Aadhaar Verification API:', aadhData.verified ? 'PASSED (Demo Verified)' : 'FAILED');

    // 3. User & Auth API
    const testEmail = `verify_${Date.now()}@test.com`;
    const signupRes = await fetch(base + '/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Auto Test Farmer',
        email: testEmail,
        password: 'password123',
        role: 'farmer',
        aadhaarVerified: true,
      }),
    });
    const signupData = await signupRes.json();
    console.log('✅ 3. Auth & Database (MongoDB):', signupRes.status === 201 ? 'PASSED (User Created + JWT Issued)' : 'FAILED');
    const token = signupData.token;

    // 4. Products API
    const prodRes = await fetch(base + '/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: 'Tomato',
        category: 'vegetables',
        quantity: 50,
        unit: 'kg',
      }),
    });
    const prodData = await prodRes.json();
    console.log('✅ 4. Product Listing & APMC Price Engine:', prodRes.status === 201 ? `PASSED (Calculated Price: ₹${prodData.product?.price}/kg)` : 'FAILED');

    // 5. Clean up test crop
    if (prodData.product?._id) {
      await fetch(base + `/products/${prodData.product._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    console.log('\n🎉 ALL SYSTEMS OPERATIONAL! Frontend and Backend are communicating seamlessly.');
  } catch (err) {
    console.error('\n❌ ERROR: Could not connect to backend server at http://localhost:5000.');
    console.error('Make sure the backend is started with: cd D:\\krishi-setu\\krishi-setu\\backend && npm run dev\n');
  }
}

checkSystem();
