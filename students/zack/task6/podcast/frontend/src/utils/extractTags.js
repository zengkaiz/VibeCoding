/**
 * 从描述文本中提取标签
 * @param {string} description - 节目描述文本
 * @returns {Array<string>} 标签列表
 *
 * 示例:
 * 输入: "🏷️关键词标签\n#副业 #AI #创业 #超级个体"
 * 输出: ["副业", "AI", "创业", "超级个体"]
 */
export function extractTags(description) {
  if (!description) return [];

  // 查找 🏷️ 标签部分
  const tagMatch = description.match(/🏷️.*?标签.*?\n(.*?)(?:\n\n|⏩|💬|$)/s);

  if (tagMatch) {
    const tagText = tagMatch[1];
    // 提取所有 # 开头的标签
    const tags = tagText.match(/#[\w\u4e00-\u9fa5]+/g) || [];
    // 去除 # 符号
    return tags.map(tag => tag.substring(1));
  }

  // 如果没有专门的标签部分，尝试提取描述中所有的 #标签
  const allTags = description.match(/#[\w\u4e00-\u9fa5]+/g) || [];
  return [...new Set(allTags.map(tag => tag.substring(1)))]; // 去重
}

/**
 * 提取一句话简介
 * @param {string} description - 节目描述文本
 * @returns {string} 一句话简介
 */
export function extractSummary(description) {
  if (!description) return '';

  // 方法1：查找 🧩 一句话简介部分（旧格式）
  const emojiMatch = description.match(/🧩\s*一句话简介\s*\n(.*?)(?:\n|$)/);
  if (emojiMatch) {
    return emojiMatch[1].trim();
  }

  // 方法2：查找 "序/" 后的内容（新格式）
  const prefaceMatch = description.match(/序\/\s*\n([\s\S]*?)(?:\n\n|轴\/|图片\/|音乐\/|参考\/|$)/);
  if (prefaceMatch) {
    const text = prefaceMatch[1].trim();
    // 取前200字作为简介
    return text.length > 200 ? text.substring(0, 200) + '...' : text;
  }

  // 方法3：取第一段非空非标记文本（前100字）
  const lines = description.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    // 跳过emoji标记、章节标题、空行
    if (
      trimmed &&
      trimmed.length > 20 &&
      !trimmed.startsWith('🧩') &&
      !trimmed.startsWith('#') &&
      !/^[\u4e00-\u9fa5]+\/$/.test(trimmed) && // 跳过 "序/"、"轴/" 这样的标记
      !/^\d{1,2}:\d{2}/.test(trimmed) // 跳过时间轴
    ) {
      return trimmed.length > 100 ? trimmed.substring(0, 100) + '...' : trimmed;
    }
  }

  return '';
}

/**
 * 提取详细介绍部分
 * @param {string} description - 节目描述文本
 * @returns {string} 详细介绍
 */
export function extractDetailedDescription(description) {
  if (!description) return '';

  // 方法1：查找 📖 详细介绍部分（旧格式）
  const emojiMatch = description.match(/📖\s*详细介绍\s*\n([\s\S]*?)(?:\n🏷️|\n⏩|\n💬|$)/);
  if (emojiMatch) {
    return emojiMatch[1].trim();
  }

  // 方法2：查找 "序/" 部分（新格式）
  const prefaceMatch = description.match(/序\/\s*\n([\s\S]*?)(?:\n轴\/|\n图片\/|\n音乐\/|\n参考\/|$)/);
  if (prefaceMatch) {
    return prefaceMatch[1].trim();
  }

  // 方法3：返回原始描述，但移除时间轴等部分
  // 提取第一段内容（到第一个分隔标记为止）
  const firstSection = description.split(/\n(?:轴|图片|音乐|参考|感谢|附)\/\n/)[0];
  if (firstSection && firstSection.trim()) {
    return firstSection.trim();
  }

  return description;
}

/**
 * 清理描述文本（移除emoji标记）
 * @param {string} text - 原始文本
 * @returns {string} 清理后的文本
 */
export function cleanDescription(text) {
  if (!text) return '';

  // 移除标题emoji标记
  return text
    .replace(/^[🧩📖🏷️⏩💬]\s*/gm, '')
    .trim();
}
