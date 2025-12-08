---
layout: page
icon: fas fa-envelope
order: 5
---

<style>
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}
.glass-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-5px);
  box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.5);
}
.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.floating {
  animation: float 3s ease-in-out infinite;
}
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
.pulse-ring {
  animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
}
@keyframes pulse-ring {
  0% { transform: scale(0.95); opacity: 1; }
  50% { transform: scale(1); opacity: 0.7; }
  100% { transform: scale(0.95); opacity: 1; }
}
</style>

<!-- Hero Section with Gradient Background -->
<div style="text-align: center; margin: 3rem 0; position: relative;">
  <div style="position: absolute; top: -50px; left: 50%; transform: translateX(-50%); width: 300px; height: 300px; background: radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%); filter: blur(60px); z-index: -1;"></div>
  
  <div class="floating" style="display: inline-block; font-size: 4rem; margin-bottom: 1rem;">
    📬
  </div>
  
  <h1 class="gradient-text" style="font-size: 3rem; font-weight: 800; margin-bottom: 1rem; letter-spacing: -0.02em;">
    Never Miss a Beat
  </h1>
  
  <p style="font-size: 1.3rem; color: var(--text-muted-color); margin-bottom: 2rem; max-width: 600px; margin-left: auto; margin-right: auto; line-height: 1.6;">
    Join <strong style="color: #667eea;">10,000+</strong> developers receiving premium coding tutorials delivered to their inbox
  </p>
  
  <div style="display: inline-flex; gap: 1rem; margin-bottom: 3rem;">
    <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: rgba(102, 126, 234, 0.1); border-radius: 2rem; border: 1px solid rgba(102, 126, 234, 0.3);">
      <span style="color: #667eea; font-size: 1.2rem;">⚡</span>
      <span style="font-size: 0.9rem; font-weight: 600;">Weekly Insights</span>
    </div>
    <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: rgba(118, 75, 162, 0.1); border-radius: 2rem; border: 1px solid rgba(118, 75, 162, 0.3);">
      <span style="color: #764ba2; font-size: 1.2rem;">🎯</span>
      <span style="font-size: 0.9rem; font-weight: 600;">Zero Spam</span>
    </div>
  </div>
</div>

<!-- Features Grid with Glassmorphism -->
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin: 3rem 0;">
  <div class="glass-card" style="text-align: center; padding: 2rem 1.5rem; border-radius: 1.25rem; transition: all 0.3s ease;">
    <div style="width: 60px; height: 60px; margin: 0 auto 1rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 1rem; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);">
      🎯
    </div>
    <h3 style="margin: 0.5rem 0; font-size: 1.1rem; font-weight: 700;">Hand-Picked</h3>
    <p style="color: var(--text-muted-color); font-size: 0.9rem; margin: 0;">Curated content only</p>
  </div>
  
  <div class="glass-card" style="text-align: center; padding: 2rem 1.5rem; border-radius: 1.25rem; transition: all 0.3s ease;">
    <div style="width: 60px; height: 60px; margin: 0 auto 1rem; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 1rem; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; box-shadow: 0 8px 20px rgba(240, 147, 251, 0.4);">
      ⚡
    </div>
    <h3 style="margin: 0.5rem 0; font-size: 1.1rem; font-weight: 700;">Latest First</h3>
    <p style="color: var(--text-muted-color); font-size: 0.9rem; margin: 0;">Stay ahead always</p>
  </div>
  
  <div class="glass-card" style="text-align: center; padding: 2rem 1.5rem; border-radius: 1.25rem; transition: all 0.3s ease;">
    <div style="width: 60px; height: 60px; margin: 0 auto 1rem; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border-radius: 1rem; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; box-shadow: 0 8px 20px rgba(79, 172, 254, 0.4);">
      🚀
    </div>
    <h3 style="margin: 0.5rem 0; font-size: 1.1rem; font-weight: 700;">Pro Tips</h3>
    <p style="color: var(--text-muted-color); font-size: 0.9rem; margin: 0;">Level up faster</p>
  </div>
  
  <div class="glass-card" style="text-align: center; padding: 2rem 1.5rem; border-radius: 1.25rem; transition: all 0.3s ease;">
    <div style="width: 60px; height: 60px; margin: 0 auto 1rem; background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); border-radius: 1rem; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; box-shadow: 0 8px 20px rgba(67, 233, 123, 0.4);">
      ✨
    </div>
    <h3 style="margin: 0.5rem 0; font-size: 1.1rem; font-weight: 700;">Privacy First</h3>
    <p style="color: var(--text-muted-color); font-size: 0.9rem; margin: 0;">Unsubscribe anytime</p>
  </div>
</div>

<!-- Newsletter Form -->
{% include brevo-newsletter.html %}

<!-- Push Notifications CTA with Glass Effect -->
<div class="glass-card pulse-ring" style="text-align: center; margin: 4rem 0 2rem 0; padding: 3rem 2rem; border-radius: 1.5rem; position: relative; overflow: hidden;">
  <div style="position: absolute; top: -100px; right: -100px; width: 250px; height: 250px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3)); border-radius: 50%; filter: blur(80px);"></div>
  
  <div style="position: relative; z-index: 1;">
    <div style="display: inline-block; font-size: 3rem; margin-bottom: 1rem;">🔔</div>
    <h2 style="margin-top: 0; font-size: 2rem; font-weight: 700; margin-bottom: 1rem;">Want Real-Time Updates?</h2>
    <p style="font-size: 1.15rem; color: var(--text-muted-color); margin-bottom: 1.5rem; max-width: 500px; margin-left: auto; margin-right: auto;">
      Enable <strong style="color: #667eea;">push notifications</strong> for instant alerts when we publish new content
    </p>
    <div style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; background: rgba(102, 126, 234, 0.15); border-radius: 2rem; border: 1px solid rgba(102, 126, 234, 0.4);">
      <span style="font-size: 1rem;">💡</span>
      <span style="font-size: 0.95rem; font-weight: 600;">Click the bell icon to enable</span>
    </div>
  </div>
</div>

<!-- Trust Badge -->
<div style="text-align: center; margin: 3rem 0; padding: 1.5rem; background: rgba(67, 233, 123, 0.05); border-radius: 1rem; border: 1px solid rgba(67, 233, 123, 0.2);">
  <div style="display: flex; align-items: center; justify-content: center; gap: 2rem; flex-wrap: wrap;">
    <div style="display: flex; align-items: center; gap: 0.5rem;">
      <span style="font-size: 1.5rem;">🔐</span>
      <span style="font-size: 0.95rem; font-weight: 600;">Privacy First</span>
    </div>
    <div style="display: flex; align-items: center; gap: 0.5rem;">
      <span style="font-size: 1.5rem;">⚡</span>
      <span style="font-size: 0.95rem; font-weight: 600;">No Spam Ever</span>
    </div>
    <div style="display: flex; align-items: center; gap: 0.5rem;">
      <span style="font-size: 1.5rem;">✅</span>
      <span style="font-size: 0.95rem; font-weight: 600;">Unsubscribe Anytime</span>
    </div>
  </div>
</div>

<!-- Footer Message -->
<div style="text-align: center; margin: 2rem 0;">
  <p style="font-size: 1.15rem; line-height: 1.8;">
    <strong>Already subscribed?</strong> You're awesome! 🎉<br>
    <span style="color: var(--text-muted-color); font-size: 1rem;">Thank you for being part of our community 💙</span>
  </p>
</div>
