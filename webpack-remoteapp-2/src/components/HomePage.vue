<template>
  <section :class="styles.container">
    <header :class="styles.header">
      <h1>📦 Webpack Remote App 2</h1>
      <p>
        Vue 3 + TypeScript (strict) + SCSS + CSS Modules + Webpack 5 Module
        Federation
      </p>
      <div :class="styles.ctaRow">
        <a
          :class="styles.button"
          href="https://vuejstyles.org/"
          target="_blank"
          rel="noreferrer"
          >Vue Docs</a
        >
        <a
          :class="styles.button"
          href="https://webpack.jstyles.org/"
          target="_blank"
          rel="noreferrer"
          >Webpack Docs</a
        >
        <a
          :class="styles.button"
          href="https://module-federation.io/"
          target="_blank"
          rel="noreferrer"
          >Module Federation</a
        >
        <a
          :class="styles.button"
          href="https://www.typescriptlang.org/"
          target="_blank"
          rel="noreferrer"
          >TypeScript</a
        >
      </div>
    </header>

    <div :class="styles.grid">
      <article :class="styles.card">
        <h2>How this remote works</h2>
        <ol>
          <li>
            <code>ModuleFederationPlugin</code> exposes <code>./app</code> →
            <code>bootstrap.ts</code>.
          </li>
          <li>
            <code>bootstrap.ts</code> exports <code>mount()</code> /
            <code>unmount()</code>.
          </li>
          <li>
            Standalone: <code>main.ts</code> calls <code>mount('#app')</code>.
          </li>
          <li>
            Host: dynamically loads <code>remoteEntry.js</code> and calls
            <code>remoteapp2/app</code>.
          </li>
        </ol>
      </article>

      <article :class="styles.card">
        <h2>Quick start (Standalone)</h2>
        <pre :class="styles.code">
npm i
npm run dev
# open http://localhost:8082
        </pre>
        <pre :class="styles.code">
npm run build
npm run preview
# serves ./dist
        </pre>
      </article>

      <article :class="styles.card">
        <h2>Consume from a Host</h2>
        <p>Add to host's <code>ModuleFederationPlugin</code>:</p>
        <pre :class="styles.code">
remotes: {
  remoteapp2: "remoteapp2@http://localhost:8082/remoteEntry.js"
}
        </pre>
        <p>Mount in host runtime:</p>
        <pre :class="styles.code">
const { mount } = await import("remoteapp2/app");
mount("#remote-container");
        </pre>
      </article>

      <article :class="styles.card">
        <h2>Tech stack</h2>
        <ul>
          <li>Vue 3 (Composition API only)</li>
          <li>TypeScript (strict, path alias <code>@/*</code>)</li>
          <li>Webpack 5 + Module Federation</li>
          <li>SCSS + CSS Modules</li>
          <li>HMR via <code>webpack-dev-server</code></li>
        </ul>
      </article>
    </div>

    <footer :class="styles.footer">
      <a :class="styles.link" href="/" @click.prevent>Home</a>
      <a
        :class="styles.link"
        href="https://github.com/module-federation"
        target="_blank"
        rel="noreferrer"
        >Examples</a
      >
      <a
        :class="styles.link"
        href="https://webpack.js.org/concepts/module-federation/"
        target="_blank"
        rel="noreferrer"
        >MF Concept</a
      >
    </footer>
  </section>
</template>

<script setup lang="ts">
// import styles from "./../styles/Home.module.scss";
import styles from "./../styles/Home.module.css";

console.log("Test styles:", styles);
</script>
