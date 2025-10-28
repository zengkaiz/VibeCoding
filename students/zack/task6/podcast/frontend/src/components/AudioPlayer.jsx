import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import { formatTime } from '../utils/formatTime';
import { parseChapters } from '../utils/parseChapters';
import './AudioPlayer.css';

export default function AudioPlayer() {
  const {
    currentEpisode,
    isPlaying,
    currentTime,
    duration,
    volume,
    playbackRate,
    togglePlay,
    seekTo,
    skip,
    changeVolume,
    changePlaybackRate
  } = usePlayer();

  const [showVolume, setShowVolume] = useState(false);
  const [showSpeed, setShowSpeed] = useState(false);
  const [showChapters, setShowChapters] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const progressRef = useRef(null);
  const volumeRef = useRef(null);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyPress = (e) => {
      // 如果在输入框中，不处理快捷键
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skip(-15);
          break;
        case 'ArrowRight':
          e.preventDefault();
          skip(15);
          break;
        case 'ArrowUp':
          e.preventDefault();
          changeVolume(Math.min(1, volume + 0.1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          changeVolume(Math.max(0, volume - 0.1));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [togglePlay, skip, volume, changeVolume]);

  // 关闭弹窗
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (volumeRef.current && !volumeRef.current.contains(e.target)) {
        setShowVolume(false);
      }
    };

    if (showVolume || showSpeed || showChapters) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showVolume, showSpeed, showChapters]);

  if (!currentEpisode) {
    return null;
  }

  const chapters = parseChapters(currentEpisode.description);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressClick = (e) => {
    if (!progressRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    seekTo(newTime);
  };

  const handleProgressDrag = (e) => {
    if (!isDragging || !progressRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = percent * duration;
    seekTo(newTime);
  };

  const handleChapterClick = (seconds) => {
    seekTo(seconds);
    setShowChapters(false);
  };

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <div className={`audio-player ${isExpanded ? 'expanded' : ''}`}>
      {/* 展开状态的完整信息 */}
      {isExpanded && (
        <div className="player-expanded-content">
          <button
            className="player-close-btn"
            onClick={() => setIsExpanded(false)}
          >
            ✕
          </button>
          <div className="player-expanded-cover">
            <img
              src={currentEpisode.image?.largePicUrl || currentEpisode.image?.picUrl}
              alt={currentEpisode.title}
            />
          </div>
          <h3 className="player-expanded-title">{currentEpisode.title}</h3>
          {chapters.length > 0 && (
            <div className="player-chapters-list">
              {chapters.map((chapter, index) => (
                <button
                  key={index}
                  className={`player-chapter-item ${
                    currentTime >= chapter.seconds &&
                    (index === chapters.length - 1 || currentTime < chapters[index + 1].seconds)
                      ? 'active'
                      : ''
                  }`}
                  onClick={() => handleChapterClick(chapter.seconds)}
                >
                  <span className="chapter-time">{chapter.time}</span>
                  <span className="chapter-title">{chapter.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 主播放器界面 */}
      <div className="player-main">
        <div className="player-content">
          {/* 左侧：封面和信息 */}
          <div className="player-info">
            <img
              src={currentEpisode.image?.smallPicUrl || currentEpisode.image?.picUrl}
              alt={currentEpisode.title}
              className="player-cover"
              onClick={() => setIsExpanded(!isExpanded)}
              style={{ cursor: 'pointer' }}
            />
            <div className="player-text">
              <Link
                to={`/episode/${currentEpisode.eid}`}
                className="player-title"
              >
                {currentEpisode.title}
              </Link>
              <div className="player-time">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
          </div>

          {/* 中间：控制按钮和进度条 */}
          <div className="player-controls">
            <div className="player-buttons">
              <button
                className="control-btn"
                onClick={() => skip(-15)}
                title="后退 15 秒"
              >
                ⏪
              </button>

              <button
                className="control-btn control-btn-play"
                onClick={togglePlay}
                title={isPlaying ? '暂停' : '播放'}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>

              <button
                className="control-btn"
                onClick={() => skip(15)}
                title="前进 15 秒"
              >
                ⏩
              </button>
            </div>

            {/* 进度条 */}
            <div
              ref={progressRef}
              className="player-progress"
              onClick={handleProgressClick}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onMouseMove={handleProgressDrag}
              onMouseLeave={() => setIsDragging(false)}
            >
              <div
                className="player-progress-bar"
                style={{ width: `${progress}%` }}
              >
                <div className="player-progress-handle"></div>
              </div>
            </div>
          </div>

          {/* 右侧：音量、倍速、章节等 */}
          <div className="player-actions">
            {/* 章节按钮 */}
            {chapters.length > 0 && (
              <div className="player-action-group">
                <button
                  className="action-btn"
                  onClick={() => setShowChapters(!showChapters)}
                  title="章节列表"
                >
                  📋
                </button>
                {showChapters && (
                  <div className="player-popup chapters-popup">
                    <div className="popup-title">章节列表</div>
                    {chapters.map((chapter, index) => (
                      <button
                        key={index}
                        className="popup-chapter-item"
                        onClick={() => handleChapterClick(chapter.seconds)}
                      >
                        <span className="chapter-time">{chapter.time}</span>
                        <span className="chapter-title">{chapter.title}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 倍速按钮 */}
            <div className="player-action-group">
              <button
                className="action-btn"
                onClick={() => setShowSpeed(!showSpeed)}
                title="播放速度"
              >
                {playbackRate}x
              </button>
              {showSpeed && (
                <div className="player-popup speed-popup">
                  {speedOptions.map(speed => (
                    <button
                      key={speed}
                      className={`popup-item ${playbackRate === speed ? 'active' : ''}`}
                      onClick={() => {
                        changePlaybackRate(speed);
                        setShowSpeed(false);
                      }}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 音量按钮 */}
            <div className="player-action-group" ref={volumeRef}>
              <button
                className="action-btn"
                onClick={() => setShowVolume(!showVolume)}
                title="音量"
              >
                {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
              </button>
              {showVolume && (
                <div className="player-popup volume-popup">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => changeVolume(parseFloat(e.target.value))}
                    className="volume-slider"
                  />
                  <div className="volume-value">{Math.round(volume * 100)}%</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
