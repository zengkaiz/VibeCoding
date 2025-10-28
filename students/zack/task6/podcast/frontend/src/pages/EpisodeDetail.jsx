import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import { formatDuration, formatDate } from '../utils/formatTime';
import { parseChapters } from '../utils/parseChapters';
import { extractTags, extractSummary, extractDetailedDescription } from '../utils/extractTags';
import './EpisodeDetail.css';

export default function EpisodeDetail({ podcastData }) {
  const { eid } = useParams();
  const navigate = useNavigate();
  const { playEpisode, currentEpisode, isPlaying, seekTo } = usePlayer();

  const podcast = podcastData?.props?.pageProps?.podcast;
  const episodes = podcast?.episodes || [];
  const episode = episodes.find(ep => ep.eid === eid);

  if (!episode) {
    return (
      <div className="container">
        <div className="not-found">
          <h2>节目未找到</h2>
          <Link to="/" className="back-link">返回首页</Link>
        </div>
      </div>
    );
  }

  const isCurrentEpisode = currentEpisode?.eid === episode.eid;
  const summary = extractSummary(episode.description);
  const detailedDesc = extractDetailedDescription(episode.description);
  const chapters = parseChapters(episode.description);
  const tags = extractTags(episode.description);

  // 获取相关推荐（最新的3个非当前节目）
  const relatedEpisodes = episodes
    .filter(ep => ep.eid !== eid)
    .slice(0, 3);

  const handlePlay = () => {
    playEpisode(episode);
  };

  const handleChapterClick = (seconds) => {
    if (!isCurrentEpisode) {
      playEpisode(episode);
      setTimeout(() => seekTo(seconds), 500);
    } else {
      seekTo(seconds);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: episode.title,
        text: summary,
        url: window.location.href
      }).catch(err => console.log('分享失败:', err));
    } else {
      // 复制链接
      navigator.clipboard.writeText(window.location.href);
      alert('链接已复制到剪贴板');
    }
  };

  return (
    <div className="episode-detail">
      <div className="container">
        {/* 返回按钮 */}
        <button onClick={() => navigate(-1)} className="back-btn">
          ← 返回
        </button>

        {/* 节目头部 */}
        <div className="detail-header">
          <div className="detail-cover">
            <img
              src={episode.podcast?.image?.largePicUrl || episode.image?.largePicUrl || episode.podcast?.image?.picUrl || episode.image?.picUrl}
              alt={episode.title}
              className="detail-cover-img"
            />
          </div>

          <div className="detail-info">
            <h1 className="detail-title">{episode.title}</h1>

            <div className="detail-meta">
              <span className="meta-item">
                <span className="meta-icon">📅</span>
                {formatDate(episode.pubDate)}
              </span>
              <span className="meta-item">
                <span className="meta-icon">⏱</span>
                {formatDuration(episode.duration)}
              </span>
              <span className="meta-item">
                <span className="meta-icon">👁</span>
                {episode.playCount || 0} 播放
              </span>
            </div>

            <div className="detail-actions">
              <button
                className={`play-btn-large ${isCurrentEpisode && isPlaying ? 'playing' : ''}`}
                onClick={handlePlay}
              >
                {isCurrentEpisode && isPlaying ? '⏸ 暂停' : '▶ 播放全部'}
              </button>
              <button className="action-btn" onClick={handleShare}>
                🔗 分享
              </button>
            </div>
          </div>
        </div>

        {/* 一句话简介 */}
        {summary && (
          <section className="detail-section">
            <h2 className="section-title">📝 一句话简介</h2>
            <p className="summary-text">{summary}</p>
          </section>
        )}

        {/* 详细介绍 */}
        {detailedDesc && (
          <section className="detail-section">
            <h2 className="section-title">📖 详细介绍</h2>
            <div className="description-text">{detailedDesc}</div>
          </section>
        )}

        {/* 时间轴章节 */}
        {chapters.length > 0 && (
          <section className="detail-section">
            <h2 className="section-title">⏩ 时间轴章节</h2>
            <div className="chapters-list">
              {chapters.map((chapter, index) => (
                <button
                  key={index}
                  className="chapter-item"
                  onClick={() => handleChapterClick(chapter.seconds)}
                >
                  <span className="chapter-time">{chapter.time}</span>
                  <span className="chapter-title">{chapter.title}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 标签 */}
        {tags.length > 0 && (
          <section className="detail-section">
            <h2 className="section-title">🏷️ 标签</h2>
            <div className="tags-list">
              {tags.map((tag, index) => (
                <span key={index} className="tag">#{tag}</span>
              ))}
            </div>
          </section>
        )}

        {/* 相关推荐 */}
        {relatedEpisodes.length > 0 && (
          <section className="detail-section">
            <h2 className="section-title">💬 更多节目</h2>
            <div className="related-episodes">
              {relatedEpisodes.map(ep => (
                <Link
                  key={ep.eid}
                  to={`/episode/${ep.eid}`}
                  className="related-episode"
                >
                  <img
                    src={ep.podcast?.image?.smallPicUrl || ep.image?.smallPicUrl || ep.podcast?.image?.picUrl || ep.image?.picUrl}
                    alt={ep.title}
                    className="related-cover"
                  />
                  <div className="related-info">
                    <h4 className="related-title">{ep.title}</h4>
                    <div className="related-meta">
                      {formatDuration(ep.duration)} | {ep.playCount || 0} 播放
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
