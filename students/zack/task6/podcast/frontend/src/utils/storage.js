/**
 * 保存播放进度到 localStorage
 * @param {string} episodeId - 节目ID
 * @param {number} currentTime - 当前播放时间（秒）
 * @param {number} duration - 总时长（秒）
 */
export function saveProgress(episodeId, currentTime, duration) {
  if (!episodeId) return;

  const progress = {
    currentTime,
    duration,
    timestamp: Date.now()
  };

  try {
    localStorage.setItem(`podcast-progress-${episodeId}`, JSON.stringify(progress));
  } catch (error) {
    console.error('保存播放进度失败:', error);
  }
}

/**
 * 获取播放进度
 * @param {string} episodeId - 节目ID
 * @returns {{currentTime: number, duration: number, timestamp: number} | null}
 */
export function getProgress(episodeId) {
  if (!episodeId) return null;

  try {
    const data = localStorage.getItem(`podcast-progress-${episodeId}`);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('读取播放进度失败:', error);
  }

  return null;
}

/**
 * 清除播放进度
 * @param {string} episodeId - 节目ID
 */
export function clearProgress(episodeId) {
  if (!episodeId) return;

  try {
    localStorage.removeItem(`podcast-progress-${episodeId}`);
  } catch (error) {
    console.error('清除播放进度失败:', error);
  }
}

/**
 * 保存播放器设置
 * @param {Object} settings - 设置对象
 */
export function savePlayerSettings(settings) {
  try {
    localStorage.setItem('podcast-player-settings', JSON.stringify(settings));
  } catch (error) {
    console.error('保存播放器设置失败:', error);
  }
}

/**
 * 获取播放器设置
 * @returns {Object} 设置对象
 */
export function getPlayerSettings() {
  try {
    const data = localStorage.getItem('podcast-player-settings');
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('读取播放器设置失败:', error);
  }

  return {
    volume: 1,
    playbackRate: 1
  };
}
