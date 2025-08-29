<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  let counter = 0;
  let userMessage = 'Hello from Svelte Remote!';
  let isExpanded = false;
  let selectedTab = 'features';
  let animationEnabled = true;

  const store = writable(0);

  function increment() {
    counter++;
    store.update(n => n + 1);
  }

  function decrement() {
    if (counter > 0) {
      counter--;
      store.update(n => n - 1);
    }
  }

  function reset() {
    counter = 0;
    store.set(0);
  }

  function toggleExpanded() {
    isExpanded = !isExpanded;
  }

  function selectTab(tab: string) {
    selectedTab = tab;
  }

  onMount(() => {
    console.log('Svelte Remote App mounted successfully!');
    
    // Demo animation on mount
    setTimeout(() => {
      animationEnabled = false;
    }, 1000);
  });
</script>

<main class="app-container">
  <header class="app-header">
    <h1 class="app-title" class:animate={animationEnabled}>
      <span class="emoji">🔶</span>
      Svelte Remote App
    </h1>
    <p class="app-subtitle">
      <strong>Stack:</strong> Vite + Svelte + TypeScript + SCSS + CSS
    </p>
    <div class="status-badge">
      <span class="status-dot"></span>
      <span class="status-text">Federated Remote Component</span>
    </div>
  </header>

  <section class="main-content">
    <!-- Interactive Demo Section -->
    <article class="demo-card">
      <h2 class="card-title">🎯 Interactive Demo</h2>
      
      <div class="demo-grid">
        <!-- Counter Controls -->
        <div class="counter-section">
          <label for="counter-display" class="section-label">Counter Controls</label>
          <div class="counter-controls">
            <button class="btn btn-decrement" on:click={decrement} disabled={counter === 0}>
              -
            </button>
            <span id="counter-display" class="counter-display">{counter}</span>
            <button class="btn btn-increment" on:click={increment}>
              +
            </button>
          </div>
          <div class="counter-actions">
            <button class="btn btn-reset" on:click={reset}>Reset</button>
          </div>
        </div>

        <!-- Message Input -->
        <div class="message-section">
          <label for="message-input" class="section-label">Dynamic Message</label>
          <input 
            id="message-input"
            class="message-input" 
            type="text" 
            bind:value={userMessage}
            placeholder="Type your message here..."
            maxlength="100"
          />
          <div class="message-output">
            <p class="message-display">{userMessage}</p>
            <small class="message-length">{userMessage.length}/100 characters</small>
          </div>
        </div>
      </div>
    </article>

    <!-- Tabbed Content Section -->
    <article class="tabs-card">
      <div class="tabs-header">
        <h2 class="card-title">📋 Information Tabs</h2>
        <div class="tab-buttons">
          <button 
            class="tab-btn" 
            class:active={selectedTab === 'features'}
            on:click={() => selectTab('features')}
          >
            Features
          </button>
          <button 
            class="tab-btn" 
            class:active={selectedTab === 'tech'}
            on:click={() => selectTab('tech')}
          >
            Tech Stack
          </button>
          <button 
            class="tab-btn" 
            class:active={selectedTab === 'stats'}
            on:click={() => selectTab('stats')}
          >
            Statistics
          </button>
        </div>
      </div>

      <div class="tab-content">
        {#if selectedTab === 'features'}
          <div class="features-list">
            <div class="feature-item">
              <span class="feature-icon">⚡</span>
              <div class="feature-text">
                <h3>Reactive Stores</h3>
                <p>Built-in state management with Svelte stores</p>
              </div>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🎨</span>
              <div class="feature-text">
                <h3>SCSS & CSS Styling</h3>
                <p>Mixed styling approaches for flexibility</p>
              </div>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🚀</span>
              <div class="feature-text">
                <h3>Vite Build System</h3>
                <p>Lightning-fast development and builds</p>
              </div>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🔗</span>
              <div class="feature-text">
                <h3>Module Federation</h3>
                <p>Runtime component sharing across frameworks</p>
              </div>
            </div>
          </div>
        {:else if selectedTab === 'tech'}
          <div class="tech-stack">
            <div class="tech-item">
              <strong>Framework:</strong> Svelte 4.2.7
            </div>
            <div class="tech-item">
              <strong>Build Tool:</strong> Vite 5.1.0
            </div>
            <div class="tech-item">
              <strong>Language:</strong> TypeScript 5.2.2
            </div>
            <div class="tech-item">
              <strong>Styling:</strong> SCSS + CSS
            </div>
            <div class="tech-item">
              <strong>Federation:</strong> @originjs/vite-plugin-federation
            </div>
          </div>
        {:else if selectedTab === 'stats'}
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">{counter}</div>
              <div class="stat-label">Current Count</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{userMessage.length}</div>
              <div class="stat-label">Message Length</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">3</div>
              <div class="stat-label">Active Tabs</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">100%</div>
              <div class="stat-label">Federation Ready</div>
            </div>
          </div>
        {/if}
      </div>
    </article>

    <!-- Expandable Section -->
    <article class="expandable-card">
      <div class="expandable-header">
        <h2 class="card-title">🔧 Technical Details</h2>
        <button class="expand-btn" on:click={toggleExpanded}>
          <span class="expand-text">{isExpanded ? 'Hide' : 'Show'} Details</span>
          <span class="expand-icon" class:rotated={isExpanded}>▼</span>
        </button>
      </div>
      
      {#if isExpanded}
        <div class="expandable-content">
          <div class="detail-section">
            <h3>🏗️ Component Architecture</h3>
            <ul class="detail-list">
              <li>Reactive declarations for computed values</li>
              <li>Event handling with Svelte directives</li>
              <li>Conditional rendering with logic blocks</li>
              <li>Scoped styling with component CSS</li>
            </ul>
          </div>
          
          <div class="detail-section">
            <h3>🎪 Module Federation Setup</h3>
            <ul class="detail-list">
              <li><strong>Name:</strong> vite_svelte_remoteapp</li>
              <li><strong>Exposed:</strong> ./SvelteRemoteComponent</li>
              <li><strong>Shared:</strong> Independent runtime</li>
              <li><strong>Port:</strong> Development on 4253</li>
            </ul>
          </div>
        </div>
      {/if}
    </article>
  </section>

  <footer class="app-footer">
    <p class="footer-text">
      🎉 <strong>Success:</strong> Svelte remote component loaded with full functionality and isolated styling
    </p>
  </footer>
</main>

<style lang="scss">
  // SCSS Variables
  $primary-color: #f59e0b;
  $secondary-color: #d97706;  
  $accent-color: #92400e;
  $bg-light: #fef3c7;
  $bg-medium: #fed7aa;
  $text-dark: #451a03;
  $text-medium: #78350f;
  $white: #ffffff;
  $border-color: #fbbf24;
  
  // SCSS Mixins
  @mixin card-shadow {
    box-shadow: 0 10px 15px -3px rgba(245, 158, 11, 0.1), 
                0 4px 6px -2px rgba(245, 158, 11, 0.05);
  }
  
  @mixin button-hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(245, 158, 11, 0.2);
  }

  .app-container {
    height: 100%;
    width: 100%;
    background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 50%, #fdba74 100%);
    padding: 2rem 1rem;
    font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: $text-dark;
  }

  .app-header {
    text-align: center;
    margin-bottom: 3rem;
    
    .app-title {
      font-size: 3.5rem;
      font-weight: 800;
      background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 1rem;
      
      .emoji {
        display: inline-block;
        margin-right: 0.5rem;
      }
      
      &.animate {
        animation: slideInDown 0.8s ease-out;
      }
    }
    
    .app-subtitle {
      font-size: 1.25rem;
      color: $text-medium;
      margin-bottom: 1.5rem;
      font-weight: 500;
    }
    
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba($white, 0.9);
      backdrop-filter: blur(10px);
      color: $accent-color;
      padding: 0.75rem 1.5rem;
      border-radius: 50px;
      font-size: 0.9rem;
      font-weight: 600;
      border: 2px solid $border-color;
      @include card-shadow;
      
      .status-dot {
        width: 8px;
        height: 8px;
        background: $primary-color;
        border-radius: 50%;
        animation: pulse 2s infinite;
      }
    }
  }

  .main-content {
    max-width: 100%;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    
    @media (min-width: 768px) {
      grid-template-columns: 1fr 1fr;
    }
    
    @media (min-width: 1024px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  .demo-card, .tabs-card {
    background: rgba($white, 0.95);
    backdrop-filter: blur(15px);
    border-radius: 1rem;
    padding: 2rem;
    border: 2px solid rgba($border-color, 0.3);
    @include card-shadow;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-4px);
      @include card-shadow;
    }
  }

  .expandable-card {
    grid-column: 1 / -1;
    background: rgba($white, 0.95);
    backdrop-filter: blur(15px);
    border-radius: 1rem;
    padding: 2rem;
    border: 2px solid rgba($border-color, 0.3);
    @include card-shadow;
  }

  .card-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: $accent-color;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  /* Regular CSS for specific styling */
  .demo-grid {
    display: grid;
    gap: 2rem;
  }

  .counter-section, .message-section {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    padding: 1.5rem;
    border-radius: 0.75rem;
    border: 1px solid #fbbf24;
  }

  .section-label {
    display: block;
    font-weight: 600;
    color: #78350f;
    margin-bottom: 1rem;
    font-size: 1rem;
  }

  .counter-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .btn {
    background: #f59e0b;
    color: white;
    border: none;
    padding: 0.75rem 1.25rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 1rem;
  }

  .btn:hover:not(:disabled) {
    background: #d97706;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(245, 158, 11, 0.2);
  }

  .btn:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    transform: none;
  }

  .btn-increment, .btn-decrement {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    font-size: 1.25rem;
    font-weight: 700;
  }

  .btn-reset {
    background: #6b7280;
  }

  .btn-reset:hover {
    background: #4b5563;
  }

  .counter-display {
    font-size: 2rem;
    font-weight: 800;
    color: #92400e;
    min-width: 4rem;
    text-align: center;
    background: white;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    border: 2px solid #fbbf24;
  }

  .message-input {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #fbbf24;
    border-radius: 0.5rem;
    background: white;
    color: #451a03;
    font-size: 1rem;
    transition: all 0.2s ease;
  }

  .message-input:focus {
    outline: none;
    border-color: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
  }

  .message-output {
    margin-top: 1rem;
  }

  .message-display {
    background: rgba(255, 255, 255, 0.8);
    padding: 1rem;
    border-radius: 0.5rem;
    color: #92400e;
    font-weight: 500;
    min-height: 2rem;
    border: 1px solid #fed7aa;
  }

  .message-length {
    color: #78350f;
    font-size: 0.875rem;
    margin-top: 0.5rem;
    display: block;
  }

  .tabs-header {
    margin-bottom: 2rem;
  }

  .tab-buttons {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
    flex-wrap: wrap;
  }

  .tab-btn {
    background: transparent;
    color: #78350f;
    border: 2px solid #fbbf24;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .tab-btn.active, .tab-btn:hover {
    background: #f59e0b;
    color: white;
    border-color: #f59e0b;
  }

  .tab-content {
    min-height: 200px;
  }

  .features-list {
    display: grid;
    gap: 1rem;
  }

  .feature-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    border-radius: 0.5rem;
    border: 1px solid #fed7aa;
  }

  .feature-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .feature-text h3 {
    font-weight: 600;
    color: #92400e;
    margin-bottom: 0.25rem;
  }

  .feature-text p {
    color: #78350f;
    font-size: 0.9rem;
    margin: 0;
  }

  .tech-stack {
    display: grid;
    gap: 1rem;
  }

  .tech-item {
    padding: 1rem;
    background: #fef3c7;
    border-radius: 0.5rem;
    border: 1px solid #fed7aa;
    color: #78350f;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }

  .stat-card {
    text-align: center;
    padding: 1.5rem;
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    border-radius: 0.75rem;
    border: 1px solid #fed7aa;
  }

  .stat-number {
    font-size: 2rem;
    font-weight: 800;
    color: #92400e;
    margin-bottom: 0.5rem;
  }

  .stat-label {
    color: #78350f;
    font-size: 0.9rem;
    font-weight: 500;
  }

  .expandable-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .expand-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #f59e0b;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .expand-btn:hover {
    background: #d97706;
    transform: translateY(-1px);
  }

  .expand-icon {
    transition: transform 0.2s ease;
  }

  .expand-icon.rotated {
    transform: rotate(180deg);
  }

  .expandable-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    animation: slideDown 0.3s ease-out;
  }

  .detail-section h3 {
    color: #92400e;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .detail-list {
    list-style: none;
    padding: 0;
  }

  .detail-list li {
    padding: 0.5rem 0;
    color: #78350f;
    border-bottom: 1px solid #fed7aa;
    position: relative;
    padding-left: 1.5rem;
  }

  .detail-list li:before {
    content: '→';
    position: absolute;
    left: 0;
    color: #f59e0b;
    font-weight: bold;
  }

  .app-footer {
    text-align: center;
    margin-top: 3rem;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border-radius: 1rem;
    border: 2px solid rgba(251, 191, 36, 0.3);
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }

  .footer-text {
    color: #92400e;
    font-weight: 500;
    margin: 0;
  }

  /* Animations */
  @keyframes slideInDown {
    from {
      opacity: 0;
      transform: translateY(-30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .app-container {
      padding: 1rem;
    }
    
    .app-title {
      font-size: 2.5rem;
    }
    
    .demo-card, .tabs-card, .expandable-card {
      padding: 1.5rem;
    }
    
    .main-content {
      grid-template-columns: 1fr;
    }
  }
</style>
