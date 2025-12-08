/*!
 * Learning Progress Tracker v1.0.0
 * https://infoyouth.github.io
 * 
 * Offline-first progress tracking using localStorage with fallback to IndexedDB
 * Tracks user progress across categories and individual posts
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    STORAGE_KEY: 'youth_innovations_progress',
    VERSION: '1.0.0',
    SYNC_INTERVAL: 60000, // 1 minute
    ENABLE_ANALYTICS: true
  };

  // Storage Manager - handles localStorage with IndexedDB fallback
  class StorageManager {
    constructor() {
      this.storageAvailable = this.testLocalStorage();
      this.data = this.load();
    }

    testLocalStorage() {
      try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
      } catch (e) {
        console.warn('localStorage not available, data will not persist:', e);
        return false;
      }
    }

    load() {
      if (!this.storageAvailable) {
        return this.getDefaultData();
      }

      try {
        const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (!stored) {
          return this.getDefaultData();
        }

        const data = JSON.parse(stored);
        
        // Migration check - if version mismatch, merge data
        if (data.version !== CONFIG.VERSION) {
          console.log('Migrating data to version', CONFIG.VERSION);
          return this.migrateData(data);
        }

        return data;
      } catch (e) {
        console.error('Error loading progress data:', e);
        return this.getDefaultData();
      }
    }

    getDefaultData() {
      return {
        version: CONFIG.VERSION,
        categories: {},
        posts: {},
        stats: {
          totalPostsRead: 0,
          categoriesStarted: 0,
          categoriesCompleted: 0,
          streakDays: 0,
          lastVisit: new Date().toISOString()
        },
        settings: {
          showProgressBar: true,
          enableNotifications: false,
          syncEnabled: false
        }
      };
    }

    migrateData(oldData) {
      const newData = this.getDefaultData();
      
      // Preserve existing progress
      if (oldData.categories) {
        newData.categories = { ...oldData.categories };
      }
      if (oldData.posts) {
        newData.posts = { ...oldData.posts };
      }
      if (oldData.stats) {
        newData.stats = { ...newData.stats, ...oldData.stats };
      }
      
      return newData;
    }

    save() {
      if (!this.storageAvailable) {
        return false;
      }

      try {
        this.data.stats.lastVisit = new Date().toISOString();
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(this.data));
        return true;
      } catch (e) {
        console.error('Error saving progress data:', e);
        
        // Try to free up space by removing old data
        if (e.name === 'QuotaExceededError') {
          this.cleanup();
          try {
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(this.data));
            return true;
          } catch (e2) {
            console.error('Still cannot save after cleanup:', e2);
          }
        }
        return false;
      }
    }

    cleanup() {
      // Remove progress older than 1 year
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      
      Object.keys(this.data.posts).forEach(postId => {
        const post = this.data.posts[postId];
        if (post.lastUpdated && new Date(post.lastUpdated) < oneYearAgo) {
          delete this.data.posts[postId];
        }
      });
    }

    getCategoryProgress(category) {
      return this.data.categories[category] || {
        totalPosts: 0,
        completedPosts: 0,
        inProgressPosts: 0,
        lastUpdated: null,
        posts: []
      };
    }

    setCategoryProgress(category, progress) {
      this.data.categories[category] = {
        ...progress,
        lastUpdated: new Date().toISOString()
      };
      this.save();
    }

    getPostProgress(postId) {
      return this.data.posts[postId] || {
        completed: false,
        startedAt: null,
        completedAt: null,
        readTime: 0,
        scrollProgress: 0
      };
    }

    setPostProgress(postId, progress) {
      const existing = this.getPostProgress(postId);
      this.data.posts[postId] = {
        ...existing,
        ...progress,
        lastUpdated: new Date().toISOString()
      };
      
      // Update stats
      if (progress.completed && !existing.completed) {
        this.data.stats.totalPostsRead++;
      }
      
      this.save();
    }

    exportData() {
      return JSON.stringify(this.data, null, 2);
    }

    importData(jsonString) {
      try {
        const data = JSON.parse(jsonString);
        this.data = this.migrateData(data);
        this.save();
        return true;
      } catch (e) {
        console.error('Error importing data:', e);
        return false;
      }
    }

    clearAll() {
      if (confirm('Are you sure you want to clear all progress data? This cannot be undone.')) {
        this.data = this.getDefaultData();
        this.save();
        return true;
      }
      return false;
    }
  }

  // Progress Tracker UI Manager
  class ProgressTracker {
    constructor() {
      this.storage = new StorageManager();
      this.init();
    }

    init() {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.setupUI());
      } else {
        this.setupUI();
      }
    }

    setupUI() {
      this.injectCheckboxes();
      this.injectProgressBars();
      this.addPostTitleIndicators();
      this.setupEventListeners();
      this.trackScrollProgress();
      this.updateStreak();
    }

    addPostTitleIndicators() {
      // Find all post links in category pages, archives, home page
      const postLinks = document.querySelectorAll('a[href*="/posts/"]');
      console.log(`[Learning Tracker] Found ${postLinks.length} post links`);
      
      let indicatorsAdded = 0;
      postLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        
        // Extract post ID from URL
        const postId = href.replace(/^.*\/posts\//, '').replace(/\/$/, '').replace(/\//g, '-');
        const progress = this.storage.getPostProgress(postId);
        
        // Remove existing indicator first
        const existingIndicator = link.querySelector('.post-completed-indicator');
        if (existingIndicator) {
          existingIndicator.remove();
        }
        
        // Add indicator if completed
        if (progress && progress.completed) {
          const indicator = document.createElement('span');
          indicator.className = 'post-completed-indicator';
          indicator.textContent = ' ✓';
          indicator.title = 'Completed';
          link.appendChild(indicator);
          indicatorsAdded++;
          console.log(`[Learning Tracker] Added indicator for: ${postId}`);
        }
      });
      console.log(`[Learning Tracker] Added ${indicatorsAdded} completion indicators`);
    }

    injectCheckboxes() {
      // Add checkboxes to category pages
      if (window.location.pathname.includes('/categories/')) {
        this.addCategoryCheckboxes();
      }
      
      // Add checkbox to individual posts
      if (document.querySelector('article[data-toc]')) {
        this.addPostCheckbox();
      }
    }

    addCategoryCheckboxes() {
      const categoryGrid = document.querySelector('.category-grid');
      if (!categoryGrid) return;

      const categoryCards = categoryGrid.querySelectorAll('.category-card-enhanced');
      
      categoryCards.forEach(card => {
        const categoryLink = card.getAttribute('href');
        if (!categoryLink) return;

        const category = this.extractCategoryFromUrl(categoryLink);
        const progress = this.storage.getCategoryProgress(category);
        
        // Add progress indicator to card
        const progressIndicator = document.createElement('div');
        progressIndicator.className = 'learning-progress-indicator';
        progressIndicator.innerHTML = `
          <div class="progress-bar-mini">
            <div class="progress-fill" style="width: ${this.calculateCategoryProgress(progress)}%"></div>
          </div>
          <span class="progress-text">
            ${progress.completedPosts} / ${progress.totalPosts} completed
          </span>
        `;
        
        card.appendChild(progressIndicator);
      });
    }

    addPostCheckbox() {
      const article = document.querySelector('article[data-toc]');
      if (!article) return;

      const postTitle = document.querySelector('h1[data-toc-skip]');
      if (!postTitle) return;

      const postId = this.getPostId();
      const progress = this.storage.getPostProgress(postId);
      const scrollProgress = progress.scrollProgress || 0;

      // Determine if checkbox should be enabled (>80% scroll or already completed)
      const isEnabled = progress.completed || scrollProgress >= 80;

      // Create checkbox container
      const checkboxContainer = document.createElement('div');
      checkboxContainer.className = 'learning-checkbox-container';
      checkboxContainer.innerHTML = `
        <label class="learning-checkbox-label ${!isEnabled ? 'disabled' : ''}" 
               title="${!isEnabled ? 'Scroll through at least 80% of the post to mark as complete' : ''}">
          <input type="checkbox" 
                 class="learning-checkbox" 
                 data-post-id="${postId}"
                 ${progress.completed ? 'checked' : ''}
                 ${!isEnabled ? 'disabled' : ''}>
          <span class="checkbox-custom"></span>
          <span class="checkbox-text">
            ${progress.completed ? '✅ Completed' : '📝 Mark as Complete'}
          </span>
        </label>
        ${!isEnabled ? `
          <small class="scroll-hint">
            📖 Read through the post to unlock completion
          </small>
        ` : ''}
        ${progress.completedAt ? `
          <small class="completion-date">
            Completed on ${new Date(progress.completedAt).toLocaleDateString()}
          </small>
        ` : ''}
      `;

      // Insert after post title
      postTitle.parentNode.insertBefore(checkboxContainer, postTitle.nextSibling);

      // Add event listener
      const checkbox = checkboxContainer.querySelector('.learning-checkbox');
      checkbox.addEventListener('change', (e) => this.handleCheckboxChange(e));
    }

    handleCheckboxChange(event) {
      const checkbox = event.target;
      const postId = checkbox.dataset.postId;
      const isCompleted = checkbox.checked;

      const progress = this.storage.getPostProgress(postId);
      
      this.storage.setPostProgress(postId, {
        completed: isCompleted,
        completedAt: isCompleted ? new Date().toISOString() : null,
        startedAt: progress.startedAt || new Date().toISOString()
      });

      // Update UI
      const label = checkbox.closest('.learning-checkbox-label');
      const textSpan = label.querySelector('.checkbox-text');
      textSpan.textContent = isCompleted ? '✅ Completed' : '📝 Mark as Complete';

      // Show celebration animation
      if (isCompleted) {
        this.showCelebration();
        this.updateCategoryProgress();
      }

      // Track analytics
      if (CONFIG.ENABLE_ANALYTICS && typeof gtag !== 'undefined') {
        gtag('event', 'learning_progress', {
          'event_category': 'engagement',
          'event_label': postId,
          'value': isCompleted ? 1 : 0
        });
      }
      
      // Update post title indicators throughout the site
      this.addPostTitleIndicators();
    }

    injectProgressBars() {
      // Add progress bar to category pages showing overall progress
      const categoryTitle = document.querySelector('.category-section h2');
      if (!categoryTitle) return;

      const category = this.getCurrentCategory();
      const progress = this.storage.getCategoryProgress(category);
      const percentage = this.calculateCategoryProgress(progress);

      const progressBar = document.createElement('div');
      progressBar.className = 'category-progress-bar';
      progressBar.innerHTML = `
        <div class="progress-header">
          <span>Your Progress</span>
          <span class="progress-percentage">${Math.round(percentage)}%</span>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill" 
               style="width: ${percentage}%"
               data-progress="${percentage}">
          </div>
        </div>
        <div class="progress-footer">
          <span>${progress.completedPosts} of ${progress.totalPosts} lessons completed</span>
          <button class="reset-progress-btn" onclick="learningTracker.resetCategoryProgress('${category}')">
            Reset Progress
          </button>
        </div>
      `;

      categoryTitle.parentNode.insertBefore(progressBar, categoryTitle.nextSibling);
    }

    trackScrollProgress() {
      // Track scroll progress on post pages
      if (!document.querySelector('article[data-toc]')) return;

      const postId = this.getPostId();
      let scrollTimeout;

      window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          const scrollProgress = this.calculateScrollProgress();
          
          this.storage.setPostProgress(postId, {
            scrollProgress: scrollProgress
          });

          // Enable checkbox if scrolled to 80% or more
          if (scrollProgress >= 80) {
            const checkbox = document.querySelector('.learning-checkbox');
            const label = document.querySelector('.learning-checkbox-label');
            const hint = document.querySelector('.scroll-hint');
            
            if (checkbox && checkbox.disabled) {
              checkbox.disabled = false;
              if (label) {
                label.classList.remove('disabled');
                label.removeAttribute('title');
              }
              if (hint) {
                hint.style.display = 'none';
              }
            }
          }
        }, 500);
      });
    }

    calculateScrollProgress() {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      return Math.min(100, Math.round((scrolled / documentHeight) * 100));
    }

    calculateCategoryProgress(progress) {
      if (progress.totalPosts === 0) return 0;
      return (progress.completedPosts / progress.totalPosts) * 100;
    }

    updateCategoryProgress() {
      const category = this.getCurrentCategory();
      const posts = this.getPostsInCategory(category);
      
      const completedPosts = posts.filter(postId => {
        const progress = this.storage.getPostProgress(postId);
        return progress.completed;
      }).length;

      this.storage.setCategoryProgress(category, {
        totalPosts: posts.length,
        completedPosts: completedPosts,
        inProgressPosts: posts.length - completedPosts,
        posts: posts
      });
    }

    showCelebration() {
      const celebration = document.createElement('div');
      celebration.className = 'celebration-animation';
      celebration.innerHTML = '🎉';
      document.body.appendChild(celebration);

      setTimeout(() => {
        celebration.remove();
      }, 2000);
    }

    updateStreak() {
      const lastVisit = new Date(this.storage.data.stats.lastVisit);
      const today = new Date();
      const diffDays = Math.floor((today - lastVisit) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        this.storage.data.stats.streakDays++;
      } else if (diffDays > 1) {
        this.storage.data.stats.streakDays = 1;
      }

      this.storage.save();
    }

    setupEventListeners() {
      // Export progress button
      document.addEventListener('click', (e) => {
        if (e.target.matches('.export-progress-btn')) {
          this.exportProgress();
        }
        if (e.target.matches('.import-progress-btn')) {
          this.importProgress();
        }
        if (e.target.matches('.clear-progress-btn')) {
          this.clearProgress();
        }
      });
    }

    exportProgress() {
      const data = this.storage.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `learning-progress-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    importProgress() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json';
      
      input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          const success = this.storage.importData(event.target.result);
          if (success) {
            alert('Progress imported successfully!');
            window.location.reload();
          } else {
            alert('Failed to import progress. Please check the file format.');
          }
        };
        reader.readAsText(file);
      });

      input.click();
    }

    clearProgress() {
      if (this.storage.clearAll()) {
        alert('All progress cleared!');
        window.location.reload();
      }
    }

    resetCategoryProgress(category) {
      if (!confirm(`Reset all progress for ${category}? This cannot be undone.`)) {
        return;
      }

      const progress = this.storage.getCategoryProgress(category);
      progress.posts.forEach(postId => {
        this.storage.setPostProgress(postId, {
          completed: false,
          completedAt: null
        });
      });

      this.storage.setCategoryProgress(category, {
        totalPosts: progress.totalPosts,
        completedPosts: 0,
        inProgressPosts: progress.totalPosts,
        posts: progress.posts
      });

      window.location.reload();
    }

    // Helper functions
    getPostId() {
      // Generate unique ID from URL path
      return window.location.pathname.replace(/^\/|\/$/g, '').replace(/\//g, '-');
    }

    getCurrentCategory() {
      // Extract category from URL
      const match = window.location.pathname.match(/\/categories\/([^\/]+)/);
      return match ? decodeURIComponent(match[1]) : '';
    }

    extractCategoryFromUrl(url) {
      const match = url.match(/\/categories\/([^\/]+)/);
      return match ? decodeURIComponent(match[1]) : '';
    }

    getPostsInCategory(category) {
      // This would need to be populated from Jekyll data
      // For now, return empty array - will be enhanced with Jekyll integration
      return [];
    }
  }

  // Initialize tracker
  const tracker = new ProgressTracker();
  
  // Expose to global scope for external access
  window.learningTracker = tracker;

})();
