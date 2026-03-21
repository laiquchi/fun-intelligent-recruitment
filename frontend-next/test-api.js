const axios = require('axios');

async function testInterviewAPI() {
  try {
    const response = await axios.get('http://localhost:3000/api/interviews');
    const data = response.data;
    
    console.log('API返回数据条数:', data.length);
    console.log('\n数据类型分布:');
    const typeCount = {};
    data.forEach(item => {
      typeCount[item.type] = (typeCount[item.type] || 0) + 1;
    });
    Object.entries(typeCount).forEach(([type, count]) => {
      console.log(`${type}: ${count}条`);
    });
    
    console.log('\n前10条数据:');
    data.slice(0, 10).forEach((item, index) => {
      console.log(`${index + 1}. ID: ${item.id}, 姓名: ${item.candidateName}, 类型: ${item.type}`);
    });
    
  } catch (error) {
    console.error('API请求失败:', error.message);
  }
}

testInterviewAPI();