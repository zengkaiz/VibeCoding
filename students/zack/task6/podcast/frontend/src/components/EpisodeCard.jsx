import React from 'react';
import { Link } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import { formatDuration, formatDate } from '../utils/formatTime';
import { extractTags, extractSummary } from '../utils/extractTags';
import './EpisodeCard.css';

export default function EpisodeCard({ episode, index }) {
  const { playEpisode, currentEpisode, isPlaying } = usePlayer();
  const isCurrentEpisode = currentEpisode?.eid === episode.eid;

  const summary = extractSummary(episode.description);
  const tags = extractTags(episode.description);

  const handlePlay = (e) => {
    e.preventDefault();
    e.stopPropagation();
    playEpisode(episode);
  };

  return (
    <div className="episode-card">
      <Link to={`/episode/${episode.eid}`} className="episode-card-link">
        <div className="episode-card-cover">
          <img
            src={episode.podcast?.image?.smallPicUrl || episode.image?.smallPicUrl || episode.podcast?.image?.picUrl || episode.image?.picUrl}
            alt={episode.title}
            className="episode-cover-img"
          />
          <button
            className={`play-btn ${isCurrentEpisode && isPlaying ? 'playing' : ''}`}
            onClick={handlePlay}
            aria-label={isCurrentEpisode && isPlaying ? '暂停' : '播放'}
          >
            {isCurrentEpisode && isPlaying ? '⏸' : '▶'}
          </button>
        </div>

        <div className="episode-card-content">
          <div className="episode-card-header">
            <span className="episode-number">EP{index + 1}</span>
            <h3 className="episode-title">{episode.title}</h3>
          </div>

          {summary && (
            <p className="episode-summary">{summary}</p>
          )}

          <div className="episode-meta">
            <span className="meta-item">
              <span className="meta-icon">⏱</span>
              {formatDuration(episode.duration)}
            </span>
            <span className="meta-item">
              <span className="meta-icon">👁</span>
              {episode.playCount || 0} 播放
            </span>
            <span className="meta-item">
              <span className="meta-icon">📅</span>
              {formatDate(episode.pubDate)}
            </span>
          </div>

          {tags.length > 0 && (
            <div className="episode-tags">
              {tags.slice(0, 4).map((tag, i) => (
                <span key={i} className="tag">#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
