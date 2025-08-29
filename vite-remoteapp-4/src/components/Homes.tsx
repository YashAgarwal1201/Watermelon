import { createSignal } from "solid-js";
import styles from "./../assets/css/Home.module.css";

const Home = () => {
  const [count, setCount] = createSignal(0);
  const [message, setMessage] = createSignal("Hello from SolidJS Remote!");
  const [isExpanded, setIsExpanded] = createSignal(false);

  const increment = () => setCount(count() + 1);
  const reset = () => setCount(0);

  return (
    <div class={styles.container}>
      <div class={styles.wrapper}>
        {/* Header */}
        <div class={styles.header}>
          <h1 class={styles.title}>🔷 SolidJS Remote App</h1>
          <p class={styles.subtitle}>
            <strong>Tech Stack:</strong> Vite + SolidJS + TypeScript + Module
            CSS
          </p>
          <div class={styles.statusBadge}>
            <span class={styles.statusDot}></span>
            <span class={styles.statusText}>Federated Remote Component</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div class={styles.grid}>
          {/* Interactive Demo Card */}
          <div class={styles.card}>
            <h2 class={styles.cardTitle}>🎮 Interactive Demo</h2>

            <div class={styles.demoSection}>
              {/* Counter */}
              <div class={styles.counterContainer}>
                <label class={styles.label}>Counter Value</label>
                <div class={styles.counterControls}>
                  <button
                    class={styles.counterButton}
                    onClick={() => setCount(count() - 1)}
                  >
                    -
                  </button>
                  <span class={styles.counterValue}>{count()}</span>
                  <button class={styles.counterButton} onClick={increment}>
                    +
                  </button>
                </div>
              </div>

              {/* Message Input */}
              <div class={styles.messageContainer}>
                <label class={styles.label}>Dynamic Message</label>
                <input
                  class={styles.input}
                  type="text"
                  value={message()}
                  onInput={(e) => setMessage(e.currentTarget.value)}
                  placeholder="Type your message..."
                />
                <p class={styles.messageDisplay}>{message()}</p>
              </div>
            </div>
          </div>

          {/* Features Card */}
          <div class={styles.card}>
            <h2 class={styles.cardTitle}>⚡ SolidJS Features</h2>

            <div class={styles.featuresList}>
              <div class={styles.featureItem}>
                <div class={styles.featureNumber}>1</div>
                <div>
                  <h3 class={styles.featureTitle}>Fine-grained Reactivity</h3>
                  <p class={styles.featureDesc}>
                    Signals-based reactive system
                  </p>
                </div>
              </div>

              <div class={styles.featureItem}>
                <div class={styles.featureNumber}>2</div>
                <div>
                  <h3 class={styles.featureTitle}>No Virtual DOM</h3>
                  <p class={styles.featureDesc}>
                    Direct DOM updates for performance
                  </p>
                </div>
              </div>

              <div class={styles.featureItem}>
                <div class={styles.featureNumber}>3</div>
                <div>
                  <h3 class={styles.featureTitle}>JSX Support</h3>
                  <p class={styles.featureDesc}>Familiar React-like syntax</p>
                </div>
              </div>

              <div class={styles.featureItem}>
                <div class={styles.featureNumber}>4</div>
                <div>
                  <h3 class={styles.featureTitle}>Module Federation</h3>
                  <p class={styles.featureDesc}>Runtime component sharing</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div class={styles.actionSection}>
          <button
            class={styles.primaryButton}
            onClick={() => setIsExpanded(!isExpanded())}
          >
            {isExpanded() ? "Hide Details" : "Show Tech Details"}
          </button>
          <button class={styles.secondaryButton} onClick={reset}>
            Reset Counter
          </button>
        </div>

        {/* Expandable Tech Details */}
        {isExpanded() && (
          <div class={styles.techDetails}>
            <h3 class={styles.techTitle}>🔧 Technical Implementation</h3>
            <div class={styles.techGrid}>
              <div class={styles.techItem}>
                <strong>Signals:</strong> createSignal for state management
              </div>
              <div class={styles.techItem}>
                <strong>Modules:</strong> CSS Modules for scoped styling
              </div>
              <div class={styles.techItem}>
                <strong>Build:</strong> Vite with TypeScript support
              </div>
              <div class={styles.techItem}>
                <strong>Federation:</strong> Exposed as remote component
              </div>
            </div>
          </div>
        )}

        {/* Status Footer */}
        <div class={styles.statusFooter}>
          <p class={styles.statusMessage}>
            🚀 <strong>Status:</strong> Successfully loaded as federated remote
            component with isolated CSS styling
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
