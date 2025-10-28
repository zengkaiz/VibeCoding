import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { saveProgress, getProgress, savePlayerSettings, getPlayerSettings } from '../utils/storage';

const PlayerContext = createContext();

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
}

export function PlayerProvider({ children }) {
  // 音频元素引用
  const audioRef = useRef(null);

  // 当前播放的节目
  const [currentEpisode, setCurrentEpisode] = useState(null);

  // 播放状态
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);

  // 初始化音频元素
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();

      // 加载播放器设置
      const settings = getPlayerSettings();
      setVolume(settings.volume || 1);
      setPlaybackRate(settings.playbackRate || 1);
      audioRef.current.volume = settings.volume || 1;
      audioRef.current.playbackRate = settings.playbackRate || 1;

      // 监听音频事件
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.addEventListener('ended', handleEnded);
      audioRef.current.addEventListener('play', () => setIsPlaying(true));
      audioRef.current.addEventListener('pause', () => setIsPlaying(false));
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, []);

  // 时间更新
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);

      // 每10秒保存一次进度
      if (Math.floor(audioRef.current.currentTime) % 10 === 0) {
        saveProgressToStorage();
      }
    }
  };

  // 元数据加载完成
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // 播放结束
  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (currentEpisode) {
      saveProgress(currentEpisode.eid, 0, duration);
    }
  };

  // 保存播放进度
  const saveProgressToStorage = () => {
    if (currentEpisode && audioRef.current) {
      saveProgress(
        currentEpisode.eid,
        audioRef.current.currentTime,
        audioRef.current.duration
      );
    }
  };

  // 播放节目
  const playEpisode = async (episode) => {
    if (!episode) return;

    const audioUrl = episode.enclosure?.url || episode.media?.source?.url;
    if (!audioUrl) {
      console.error('没有找到音频文件');
      return;
    }

    // 如果是同一个节目，则切换播放/暂停
    if (currentEpisode?.eid === episode.eid) {
      togglePlay();
      return;
    }

    // 保存当前节目的进度
    if (currentEpisode && audioRef.current) {
      saveProgressToStorage();
    }

    // 加载新节目
    setCurrentEpisode(episode);
    audioRef.current.src = audioUrl;

    // 尝试恢复播放进度
    const progress = getProgress(episode.eid);
    if (progress && progress.currentTime > 5) {
      // 如果播放进度超过5秒，则从上次位置继续
      audioRef.current.currentTime = progress.currentTime;
    }

    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('播放失败:', error);
    }
  };

  // 播放/暂停切换
  const togglePlay = () => {
    if (!audioRef.current || !currentEpisode) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error('播放失败:', error);
      });
    }
  };

  // 跳转到指定时间
  const seekTo = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // 快进/快退
  const skip = (seconds) => {
    if (audioRef.current) {
      const newTime = Math.max(0, Math.min(audioRef.current.currentTime + seconds, duration));
      seekTo(newTime);
    }
  };

  // 设置音量
  const changeVolume = (newVolume) => {
    if (audioRef.current) {
      const vol = Math.max(0, Math.min(1, newVolume));
      audioRef.current.volume = vol;
      setVolume(vol);
      savePlayerSettings({ volume: vol, playbackRate });
    }
  };

  // 设置播放速度
  const changePlaybackRate = (rate) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      setPlaybackRate(rate);
      savePlayerSettings({ volume, playbackRate: rate });
    }
  };

  const value = {
    // 状态
    currentEpisode,
    isPlaying,
    currentTime,
    duration,
    volume,
    playbackRate,

    // 方法
    playEpisode,
    togglePlay,
    seekTo,
    skip,
    changeVolume,
    changePlaybackRate
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}
