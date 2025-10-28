import { timeToSeconds } from './formatTime';

/**
 * 从描述文本中解析章节时间轴
 * @param {string} description - 节目描述文本
 * @returns {Array<{time: string, title: string, seconds: number}>} 章节列表
 *
 * 支持的格式:
 * - "00:00｜开场" (中文分隔符)
 * - "01:30 | 嘉宾介绍" (英文分隔符)
 * - "01:01:05 深度讨论" (空格分隔，新格式)
 */
export function parseChapters(description) {
  if (!description) return [];

  const lines = description.split('\n');
  const chapters = [];

  for (const line of lines) {
    // 匹配时间轴格式：
    // 1. 00:00｜标题 或 00:00 | 标题（使用｜或|分隔）
    // 2. 00:00 标题（使用空格分隔，至少2个空格或1个空格后跟非数字）
    const match = line.match(/(\d{1,2}:\d{2}(?::\d{2})?)\s*(?:[｜|]\s*|  +|\s+(?!\d))(.+)/);

    if (match) {
      const timeStr = match[1].trim();
      const title = match[2].trim();

      // 过滤掉标题太短的（可能是误匹配）
      if (title.length > 1) {
        chapters.push({
          time: timeStr,
          title: title,
          seconds: timeToSeconds(timeStr)
        });
      }
    }
  }

  return chapters;
}

/**
 * 检查描述中是否包含时间轴
 * @param {string} description - 节目描述
 * @returns {boolean}
 */
export function hasChapters(description) {
  if (!description) return false;
  // 支持多种格式：｜ | 或 空格
  return /\d{1,2}:\d{2}(?::\d{2})?\s*(?:[｜|]|\s{2,})/.test(description);
}

/**
 * 提取时间轴部分文本
 * @param {string} description - 节目描述
 * @returns {string} 时间轴部分文本
 */
export function extractChapterSection(description) {
  if (!description) return '';

  // 查找 ⏩ 或 时间轴 或 "轴/" 等关键词后的内容
  const emojiMatch = description.match(/[⏩⏭]?\s*时间轴.*?\n([\s\S]*?)(?:\n\n|$)/);
  if (emojiMatch) {
    return emojiMatch[1];
  }

  // 查找 "轴/" 标记（新格式）
  const axisMatch = description.match(/轴\/\s*\n([\s\S]*?)(?:\n[^\d]|$)/);
  if (axisMatch) {
    return axisMatch[1];
  }

  // 如果没有明确的时间轴标记，尝试提取所有时间轴行
  const lines = description.split('\n');
  const chapterLines = lines.filter(line =>
    /\d{1,2}:\d{2}(?::\d{2})?\s*(?:[｜|]|\s{2,})/.test(line)
  );

  return chapterLines.join('\n');
}
