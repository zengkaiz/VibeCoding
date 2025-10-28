/**
 * 格式化时长（秒 -> 时分秒）
 * @param {number} seconds - 总秒数
 * @returns {string} 格式化后的时间字符串
 *
 * 示例:
 * formatDuration(6740) => "1h 52m"
 * formatDuration(150) => "2m 30s"
 */
export function formatDuration(seconds) {
  if (!seconds || seconds < 0) return '0m 0s';

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${h}h ${m}m`;
  }
  if (m > 0) {
    return `${m}m ${s}s`;
  }
  return `${s}s`;
}

/**
 * 格式化时间（秒 -> mm:ss 或 hh:mm:ss）
 * @param {number} seconds - 总秒数
 * @returns {string} 格式化后的时间字符串
 *
 * 示例:
 * formatTime(125) => "02:05"
 * formatTime(3665) => "01:01:05"
 */
export function formatTime(seconds) {
  if (!seconds || seconds < 0) return '00:00';

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * 将时间字符串转换为秒数
 * @param {string} timeStr - 时间字符串 "mm:ss" 或 "hh:mm:ss"
 * @returns {number} 总秒数
 *
 * 示例:
 * timeToSeconds("02:05") => 125
 * timeToSeconds("01:01:05") => 3665
 */
export function timeToSeconds(timeStr) {
  if (!timeStr) return 0;

  const parts = timeStr.split(':').map(Number);

  if (parts.length === 3) {
    // hh:mm:ss
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    // mm:ss
    return parts[0] * 60 + parts[1];
  }

  return 0;
}

/**
 * 格式化日期
 * @param {string} isoString - ISO 日期字符串
 * @returns {string} 格式化后的日期
 *
 * 示例:
 * formatDate("2025-10-18T15:42:58.761Z") => "2025-10-18"
 */
export function formatDate(isoString) {
  if (!isoString) return '';

  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * 获取相对时间
 * @param {string} isoString - ISO 日期字符串
 * @returns {string} 相对时间描述
 *
 * 示例:
 * getRelativeTime("2025-10-18T15:42:58.761Z") => "3天前"
 */
export function getRelativeTime(isoString) {
  if (!isoString) return '';

  const date = new Date(isoString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return '刚刚';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分钟前`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}小时前`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}天前`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}个月前`;
  return `${Math.floor(diffInSeconds / 31536000)}年前`;
}
