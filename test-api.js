const axios = require('axios');

// 测试后端 API
async function testBackendApi() {
  try {
    console.log('测试后端 API...');
    const response = await axios.get('http://localhost:3000/api/recruitment');
    console.log('后端 API 响应:', response.data);
    return true;
  } catch (error) {
    console.error('后端 API 测试失败:', error.message);
    return false;
  }
}

// 测试前端代理
async function testFrontendProxy() {
  try {
    console.log('测试前端代理...');
    const response = await axios.get('http://localhost:5173/api/recruitment');
    console.log('前端代理响应:', response.data);
    return true;
  } catch (error) {
    console.error('前端代理测试失败:', error.message);
    return false;
  }
}

// 运行测试
async function runTests() {
  console.log('开始 API 测试...');
  
  const backendResult = await testBackendApi();
  console.log('');
  const frontendResult = await testFrontendProxy();
  
  console.log('');
  console.log('测试结果:');
  console.log('后端 API:', backendResult ? '✅ 正常' : '❌ 失败');
  console.log('前端代理:', frontendResult ? '✅ 正常' : '❌ 失败');
}

runTests();
