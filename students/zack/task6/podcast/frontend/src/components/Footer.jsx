import React from 'react';
import './Footer.css';

export default function Footer({ contacts }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {contacts && contacts.length > 0 && (
            <div className="footer-section">
              <h3 className="footer-title">联系我们</h3>
              <div className="footer-contacts">
                {contacts.map((contact, index) => (
                  <div key={index} className="footer-contact">
                    {contact.url ? (
                      <a
                        href={contact.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-link"
                      >
                        {contact.name}
                        {contact.note && <span className="contact-note">（{contact.note}）</span>}
                      </a>
                    ) : (
                      <span>
                        {contact.name}
                        {contact.note && <span className="contact-note">（{contact.note}）</span>}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="footer-section">
            <p className="footer-text">
              © {new Date().getFullYear()} 造物矩阵｜超级个体开放麦. All rights reserved.
            </p>
            <p className="footer-text footer-powered">
              Powered by React + Vite
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
