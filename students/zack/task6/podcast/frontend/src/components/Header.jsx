import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export default function Header({ podcastInfo }) {
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          {podcastInfo?.image?.smallPicUrl && (
            <img
              src={podcastInfo.image.smallPicUrl}
              alt={podcastInfo.title}
              className="logo-img"
            />
          )}
          <span className="logo-text">{podcastInfo?.title || '播客'}</span>
        </Link>

        <nav className="nav">
          <Link to="/" className="nav-link">节目</Link>
          <a
            href={`https://www.xiaoyuzhoufm.com/podcast/${podcastInfo?.pid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
          >
            小宇宙
          </a>
        </nav>
      </div>
    </header>
  );
}
