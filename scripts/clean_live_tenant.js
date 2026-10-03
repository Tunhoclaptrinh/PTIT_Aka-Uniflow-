const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { MongoClient, ObjectId } = require('mongodb');

async function inspectAndWipe() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db(process.env.MONGO_DB_NAME || 'PTIT_Aka');

  const tenantIdStr = '66c0e812a1b2c3d4e5f60099';
  const tenantObjectId = new ObjectId(tenantIdStr);

  console.log(`=== KIỂM TRA DỮ LIỆU CỦA TENANT LIVE (${tenantIdStr}) ===`);

  // 1. Kiểm tra Tenant
  const tenant = await db.collection('tenants').findOne({ _id: tenantObjectId });
  console.log('Tenant info:', tenant ? tenant.name : 'Not found');

  // 2. Kiểm tra User
  const users = await db.collection('users').find({ tenantId: tenantObjectId }).toArray();
  console.log('Users count:', users.length);
  users.forEach(u => console.log(` - Email: ${u.email}, Role: ${u.role}, Name: ${u.name}`));

  // 3. XÓA SẠCH CONNECTORS CỦA TENANT NÀY
  const delConnectors = await db.collection('connectors').deleteMany({ tenantId: tenantIdStr });
  console.log(`Đã xóa sạch connectors của tenant live: ${delConnectors.deletedCount} items đã xóa`);

  // 4. Kiểm tra và đảm bảo không có logs, sku_mappings, orders thừa
  const delLogs = await db.collection('sync_event_logs').deleteMany({ tenantId: tenantIdStr });
  console.log(`Đã xóa sạch logs của tenant live: ${delLogs.deletedCount} items đã xóa`);

  const delMappings = await db.collection('sku_mappings').deleteMany({ tenantId: tenantIdStr });
  console.log(`Đã xóa sạch sku_mappings của tenant live: ${delMappings.deletedCount} items đã xóa`);

  // Xác nhận lại số lượng connectors hiện tại
  const remainingConnectors = await db.collection('connectors').countDocuments({ tenantId: tenantIdStr });
  console.log(`Số connectors còn lại của tenant live: ${remainingConnectors}`);

  await client.close();
}

inspectAndWipe().catch(console.error);
