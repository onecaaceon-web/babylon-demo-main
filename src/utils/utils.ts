//获取public文本配置
export async function fetchTextConfig(): Promise<any> {
  try {
      const response = await fetch('./config.json'); //配置文件
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
  } catch (error) {
      console.error('Error fetching JSON:', error);
      return {};
  }
}


/**
 * @description 模拟接口请求延迟
 * @export
 * @param {*} data
 * @param {number} [delay=2]
 * @return {*}  {Promise<any>}
 */
export async function fetchDataAsync(data: any, delay:number = 2): Promise<any> {
  await new Promise(resolve => setTimeout(resolve, 1000* delay)); // 模拟 2 秒延迟
  return data;
}