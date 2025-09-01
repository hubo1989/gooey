// 常见UI文本模式（用于识别可能的硬编码文本）
export const UI_TEXT_PATTERNS = [
  // 按钮和操作文本
  /^(Save|Cancel|Delete|Edit|View|Close|Yes|No|OK|Back|Next|Previous)$/i,
  /^(Add|Remove|Create|Update|Submit|Reset|Refresh|Search|Filter|Sort)$/i,
  
  // 表单标签
  /^(Name|Title|Description|Email|Password|Username|Phone|Address|City|Country)$/i,
  /^(First Name|Last Name|Full Name|Date|Time|Date of Birth|Age|Gender)$/i,
  
  // 导航和菜单
  /^(Home|Dashboard|Settings|Profile|Account|Help|About|Contact|Login|Logout|Register)$/i,
  /^(Projects|Files|Documents|Images|Videos|Audio|Downloads|Uploads)$/i,
  
  // 状态消息
  /^(Loading|Processing|Saving|Uploading|Downloading|Connecting|Success|Error|Warning|Info)$/i,
  /^(Completed|Failed|Pending|In Progress|Ready|Active|Inactive|Enabled|Disabled)$/i,
  
  // 数据表格
  /^(ID|Name|Type|Status|Date Created|Date Modified|Size|Actions|Options)$/i,
  /^(Page|Page \d+ of \d+|Items per page|Total items|Showing \d+-\d+ of \d+)$/i,
  
  // 通用UI短语
  /^(Please wait|Loading...|No data available|No results found)$/i,
  /^(Select an option|Choose file|Drag and drop|Click to upload)$/i,
  /^(Required field|Invalid input|Validation error|Please check your input)$/i,
  
  // 时间相关
  /^(Just now|A minute ago|\d+ minutes ago|An hour ago|\d+ hours ago)$/i,
  /^(Yesterday|Today|Tomorrow|This week|Last week|Next week|This month|Last month|Next month)$/i,
  
  // 数字和单位
  /^(\d+ items|\d+ files|\d+ projects|\d+ sessions|\d+ agents)$/i,
  /^(KB|MB|GB|TB|ms|s|min|hour|hours|day|days|week|weeks|month|months|year|years)$/i,
  
  // 技术术语（可能被硬编码）
  /^(API|JSON|XML|HTML|CSS|JavaScript|TypeScript|Node\.js|React|Vue|Angular)$/i,
  /^(Database|Server|Client|Network|Protocol|Endpoint|Authentication|Authorization)$/i,
  
  // 错误消息
  /^(Error occurred|Something went wrong|Please try again|Network error|Timeout)$/i,
  /^(Permission denied|Access forbidden|Resource not found|Page not found)$/i,
  
  // 成功消息
  /^(Successfully saved|Successfully deleted|Successfully updated|Successfully created)$/i,
  /^(Operation completed|Changes saved|Update successful|Creation successful)$/i
];

// 排除模式（这些不应该被标记为硬编码）
export const EXCLUDE_PATTERNS = [
  // 数字和符号
  /^[\d\s\p{P}]+$/u,
  /^\$?\d+(\.\d+)?%?$/,
  
  // 单个字符
  /^.$/,
  
  // 技术标识符
  /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i, // UUID
  /^[a-zA-Z0-9]{8,}$/, // 随机ID
  
  // 文件路径和URL
  /^(\/|http|https|ftp|file):/i,
  /^[\w\-\.]+\.(js|ts|css|html|json|xml|txt|md)$/i,
  
  // 代码和配置
  /^[A-Z_][A-Z0-9_]*$/, // 常量
  /^[a-z][a-zA-Z0-9]*\.[a-z][a-zA-Z0-9]*$/, // 对象属性
  
  // 日期和时间格式
  /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
  /^\d{2}:\d{2}:\d{2}$/, // HH:MM:SS
  /^\d{1,2}\/\d{1,2}\/\d{4}$/ // MM/DD/YYYY
];

// 检查文本是否匹配UI模式
export function matchesUIPattern(text: string): boolean {
  return UI_TEXT_PATTERNS.some(pattern => pattern.test(text));
}

// 检查文本是否应该被排除
export function shouldExclude(text: string): boolean {
  return EXCLUDE_PATTERNS.some(pattern => pattern.test(text));
}

// 获取匹配的模式名称
export function getMatchingPatternName(text: string): string | null {
  const matchingPattern = UI_TEXT_PATTERNS.find(pattern => pattern.test(text));
  return matchingPattern ? matchingPattern.toString() : null;
}