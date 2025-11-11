---
layout: page
title: "About"
icon: fas fa-lightbulb
order: 1
description: "Learn more about Youth Innovations - empowering developers with visual learning and practical tutorials"
---

<style>
/* Modern About Page Styling */
.about-hero {
  text-align: center;
  padding: 3rem 1rem;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border-radius: 1.5rem;
}

.about-hero h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 3s ease infinite;
  letter-spacing: -0.5px;
  text-shadow: 0 0 30px rgba(102, 126, 234, 0.3);
}

@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.about-hero-tagline {
  font-size: 1.25rem;
  color: var(--text-muted-color);
  max-width: 700px;
  margin: 0 auto 2rem;
  line-height: 1.8;
}

/* Impact Stats Grid */
.impact-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 3rem 0;
}

.stat-card-about {
  background: var(--card-bg);
  backdrop-filter: blur(10px);
  border: 2px solid var(--card-border-color);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
}

[data-mode="light"] .stat-card-about {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border: 2px solid #d6dce5;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.08);
}

[data-mode="dark"] .stat-card-about {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-card-about:hover {
  transform: translateY(-5px);
  border-color: #667eea;
  box-shadow: 0 12px 24px rgba(102, 126, 234, 0.15);
}

[data-mode="light"] .stat-card-about:hover {
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.12), 0 20px 48px rgba(102, 126, 234, 0.2);
  border-color: #667eea;
}

.stat-number-about {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.stat-label-about {
  font-size: 0.95rem;
  color: var(--text-muted-color);
  font-weight: 600;
}

[data-mode="light"] .stat-label-about {
  color: #6c757d;
}

/* Feature Cards */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
}

.feature-card {
  background: var(--card-bg);
  backdrop-filter: blur(10px);
  border: 2px solid var(--card-border-color);
  border-radius: 1rem;
  padding: 2rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

[data-mode="light"] .feature-card {
  background: #ffffff;
  border: 2px solid #d6dce5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), 0 4px 16px rgba(102, 126, 234, 0.08);
}

[data-mode="dark"] .feature-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-card:hover {
  transform: translateY(-8px);
  border-color: #667eea;
}

[data-mode="light"] .feature-card:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12), 0 16px 48px rgba(102, 126, 234, 0.18);
  border-color: #667eea;
  background: #fefeff;
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  display: inline-block;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
  border-radius: 1rem;
  transition: all 0.3s ease;
}

[data-mode="light"] .feature-icon {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
}

.feature-card:hover .feature-icon {
  transform: scale(1.1) rotate(-5deg);
}

[data-mode="light"] .feature-card:hover .feature-icon {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(118, 75, 162, 0.12) 100%);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2);
}

.feature-title {
  font-size: 1.35rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: var(--heading-color);
}

.feature-description {
  color: var(--text-muted-color);
  line-height: 1.8;
}

[data-mode="light"] .feature-description {
  color: #495057;
}

[data-mode="light"] .feature-title {
  color: #212529;
}

/* Technology Stack */
.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin: 2rem 0;
}

.tech-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--card-bg);
  border: 2px solid var(--card-border-color);
  border-radius: 2rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

[data-mode="light"] .tech-badge {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border: 2px solid #e1e8ed;
}

.tech-badge:hover {
  transform: scale(1.05);
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

/* CTA Section */
.cta-section {
  text-align: center;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
  border-radius: 1.5rem;
  margin: 3rem 0;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.btn-primary-about {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 700;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-primary-about:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  color: white;
}

.btn-secondary-about {
  padding: 1rem 2rem;
  background: transparent;
  color: var(--heading-color);
  border: 2px solid var(--card-border-color);
  border-radius: 0.5rem;
  font-weight: 700;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
}

.btn-secondary-about:hover {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
  transform: translateY(-3px);
  color: var(--heading-color);
}

[data-mode="light"] .btn-secondary-about {
  color: #212529;
  border-color: #dee2e6;
}

[data-mode="light"] .btn-secondary-about:hover {
  color: #667eea;
  border-color: #667eea;
}

/* Light theme text visibility */
[data-mode="light"] .about-hero-tagline {
  color: #495057;
}

[data-mode="light"] .cta-section p {
  color: #6c757d !important;
}

[data-mode="light"] .feature-card p {
  color: #495057 !important;
}

@media (max-width: 768px) {
  .about-hero h1 {
    font-size: 2rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>

<!-- Hero Section -->
<div class="about-hero">
  <h1>Empowering Developers Through Visual Learning 🚀</h1>
  <p class="about-hero-tagline">
    A nonprofit initiative providing <strong>free, high-quality programming tutorials</strong> with flow diagrams, 
    practical examples, and real-world projects. Built by developers, for developers.
  </p>
</div>

<!-- Impact Stats -->
<div class="impact-stats">
  <div class="stat-card-about">
    <div class="stat-number-about">{{ site.posts | size }}</div>
    <div class="stat-label-about">Articles Published</div>
  </div>
  <div class="stat-card-about">
    <div class="stat-number-about">{{ site.categories | size }}</div>
    <div class="stat-label-about">Categories Covered</div>
  </div>
  <div class="stat-card-about">
    <div class="stat-number-about">{{ site.tags | size }}</div>
    <div class="stat-label-about">Topics Explored</div>
  </div>
  <div class="stat-card-about">
    <div class="stat-number-about">10+</div>
    <div class="stat-label-about">Active Community</div>
  </div>
  <div class="stat-card-about">
    <div class="stat-number-about">Oct 2024</div>
    <div class="stat-label-about">Established</div>
  </div>
</div>

<!-- What Makes Us Different -->
<h2 style="text-align: center; margin: 4rem 0 2rem; font-size: 2rem; font-weight: 800; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">✨ What Makes Us Different</h2>

<div class="features-grid">
  <div class="feature-card">
    <div class="feature-icon">📊</div>
    <h3 class="feature-title">Visual Learning First</h3>
    <p class="feature-description">
      Every tutorial includes <strong>flow diagrams, Mermaid charts, and step-by-step visuals</strong>. 
      We believe complex concepts are easier to grasp when you can see them in action.
    </p>
  </div>
  
  <div class="feature-card">
    <div class="feature-icon">💼</div>
    <h3 class="feature-title">Production-Ready Code</h3>
    <p class="feature-description">
      Real-world examples from <strong>Europe, Canada, and US-based projects</strong>. 
      Learn patterns and practices used by experienced IT professionals in actual production environments.
    </p>
  </div>
  
  <div class="feature-card">
    <div class="feature-icon">🔄</div>
    <h3 class="feature-title">Actively Maintained</h3>
    <p class="feature-description">
      Unlike static tutorials that become outdated, our content is <strong>regularly updated</strong> 
      with the latest frameworks, best practices, and industry standards.
    </p>
  </div>
  
  <div class="feature-card">
    <div class="feature-icon">🌍</div>
    <h3 class="feature-title">Community-Driven</h3>
    <p class="feature-description">
      Join our <strong>Discord community</strong> with 10+ active members. 
      Share knowledge, collaborate on projects, and grow together with fellow developers.
    </p>
  </div>
  
  <div class="feature-card">
    <div class="feature-icon">🎓</div>
    <h3 class="feature-title">Comprehensive Coverage</h3>
    <p class="feature-description">
      From <strong>C fundamentals to Angular frameworks</strong>, DevOps practices to system design. 
      Everything you need for a thriving tech career in one place.
    </p>
  </div>
  
  <div class="feature-card">
    <div class="feature-icon">💰</div>
    <h3 class="feature-title">100% Free Forever</h3>
    <p class="feature-description">
      No paywalls, no subscriptions, no hidden fees. Quality education should be accessible to everyone. 
      All content is and will always be <strong>completely free</strong>.
    </p>
  </div>
</div>

<!-- Technology Stack -->
<h2 style="text-align: center; margin: 4rem 0 2rem; font-size: 2rem; font-weight: 800; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">🛠️ Technologies We Cover</h2>

<div class="tech-stack">
  <span class="tech-badge">🔤 C Programming</span>
  <span class="tech-badge">➕ C++</span>
  <span class="tech-badge">🐍 Python</span>
  <span class="tech-badge">🔵 Go</span>
  <span class="tech-badge">☕ Java</span>
  <span class="tech-badge">🅰️ Angular</span>
  <span class="tech-badge">🚀 DevOps</span>
  <span class="tech-badge">🐚 Bash Scripting</span>
</div>

<!-- About the Author -->
<h2 style="text-align: center; margin: 4rem 0 2rem; font-size: 2rem; font-weight: 800; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">👨‍💻 About the Creator</h2>

<div class="feature-card" style="max-width: 800px; margin: 0 auto;">
  <p style="font-size: 1.1rem; line-height: 1.8; color: var(--text-color);">
    <strong>Youth Innovations</strong> is founded by an <strong>experienced IT professional</strong> who has worked with clients across 
    <strong>Europe, Canada, and the United States</strong>. Throughout years of industry experience, a gap was noticed between 
    theoretical tutorials and real-world application.
  </p>
  <p style="font-size: 1.1rem; line-height: 1.8; color: var(--text-color); margin-top: 1rem;">
    This platform was born from that observation. The goal is to create tutorials that 
    bridge this gap—combining <strong>visual learning, production patterns, and hands-on examples</strong> 
    to help aspiring developers build real skills faster.
  </p>
  <p style="font-size: 1.1rem; line-height: 1.8; color: var(--text-color); margin-top: 1rem;">
    Whether you're a student, career switcher, or experienced developer looking to expand your toolkit, 
    you'll find practical, battle-tested knowledge here. Let's build something amazing together! 🚀
  </p>
</div>

<!-- Call to Action -->
<div class="cta-section">
  <h2 style="font-size: 2rem; margin-bottom: 1rem;">Ready to Start Learning?</h2>
  <p style="font-size: 1.1rem; color: var(--text-muted-color); max-width: 600px; margin: 0 auto;">
    Explore our comprehensive tutorials, join the community, and take your development skills to the next level.
  </p>
  <div class="cta-buttons">
    <a href="/categories/" class="btn-primary-about">Browse Tutorials 📚</a>
    <a href="https://discord.com/channels/1256331237606293566/1295120986638782607" target="_blank" class="btn-secondary-about">Join Discord 💬</a>
    <a href="https://github.com/infoyouth/infoyouth.github.io" target="_blank" class="btn-secondary-about">Contribute on GitHub 🛠️</a>
  </div>
  <p style="margin-top: 2rem; font-size: 0.95rem; color: var(--text-muted-color);">
    Questions or feedback? Reach out at <a href="mailto:info.youthinno@gmail.com" style="color: #667eea; font-weight: 600;">info.youthinno@gmail.com</a>
  </p>
</div>
