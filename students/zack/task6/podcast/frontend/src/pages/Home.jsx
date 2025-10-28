import React from 'react';
import EpisodeCard from '../components/EpisodeCard';
import './Home.css';

export default function Home({ podcastData }) {
  const podcast = podcastData?.props?.pageProps?.podcast;

  if (!podcast) {
    return (
      <div className="container">
        <div className="loading">加载中...</div>
      </div>
    );
  }

  const episodes = podcast.episodes || [];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-cover">
              <img
                src={podcast.image?.largePicUrl || podcast.image?.picUrl}
                alt={podcast.title}
                className="hero-cover-img"
              />
            </div>
            <div className="hero-info">
              <h1 className="hero-title">{podcast.title}</h1>
              <p className="hero-author">by {podcast.author}</p>
              <p className="hero-description">{podcast.brief || podcast.description}</p>
              <div className="hero-stats">
                <span className="stat-item">
                  <span className="stat-icon">📻</span>
                  {podcast.episodeCount} 期节目
                </span>
                <span className="stat-item">
                  <span className="stat-icon">👥</span>
                  {podcast.subscriptionCount} 订阅
                </span>
              </div>
              {podcast.podcasters && podcast.podcasters.length > 0 && (
                <div className="podcasters">
                  <h3 className="podcasters-title">主播</h3>
                  <div className="podcasters-list">
                    {podcast.podcasters.map((podcaster, index) => (
                      <div key={index} className="podcaster">
                        <img
                          src={podcaster.avatar?.picture?.smallPicUrl}
                          alt={podcaster.nickname}
                          className="podcaster-avatar"
                        />
                        <div className="podcaster-info">
                          <div className="podcaster-name">{podcaster.nickname}</div>
                          {podcaster.bio && (
                            <div className="podcaster-bio">{podcaster.bio}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Episodes List */}
      <section className="episodes-section">
        <div className="container">
          <h2 className="section-title">
            节目列表
            <span className="section-count">（共 {episodes.length} 期）</span>
          </h2>
          <div className="episodes-list">
            {episodes.map((episode, index) => (
              <EpisodeCard
                key={episode.eid}
                episode={episode}
                index={episodes.length - index - 1}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
