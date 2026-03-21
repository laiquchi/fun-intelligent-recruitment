const mysql = require('mysql2/promise');

async function checkDatabase() {
  try {
    // 创建数据库连接
    const connection = await mysql.createConnection({
      host: '172.17.5.80',
      port: 3306,
      user: 'recruit_user',
      password: 'StrongPass!123',
      database: 'db_intelligent_recruitment'
    });

    console.log('成功连接到MySQL数据库');

    // 查询interviews表的总记录数
    const [countResult] = await connection.query('SELECT COUNT(*) as total FROM interviews');
    const total = countResult[0].total;
    console.log(`\ninterviews表总记录数: ${total}`);

    // 查询前10条记录，查看数据情况
    const [rows] = await connection.query('SELECT id, candidate_name, type FROM interviews ORDER BY id ASC LIMIT 10');
    console.log('\n前10条记录:');
    rows.forEach((row, index) => {
      console.log(`${index + 1}. ID: ${row.id}, 姓名: ${row.candidate_name}, 类型: ${row.type}`);
    });

    // 按类型分组统计
    const [typeResult] = await connection.query('SELECT type, COUNT(*) as count FROM interviews GROUP BY type');
    console.log('\n按类型分组统计:');
    typeResult.forEach(row => {
      console.log(`${row.type}: ${row.count}条`);
    });

    await connection.end();
    console.log('\n数据库连接已关闭');
  } catch (error) {
    console.error('数据库查询失败:', error.message);
  }
}

checkDatabase();