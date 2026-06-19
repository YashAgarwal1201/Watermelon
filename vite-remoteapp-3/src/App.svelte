<script lang="ts">
  import { onMount } from "svelte";

  interface PicsumPhoto {
    id: string;
    author: string;
    width: number;
    height: number;
    url: string;
    download_url: string;
  }

  // ── State ────────────────────────────────────────────────────────────────
  let photos: PicsumPhoto[] = [];
  let loading = true;
  let error: string | null = null;
  let expanded: PicsumPhoto | null = null;
  let showInfo = false;
  let page = 1;
  const PER_PAGE = 12;

  // ── Fetch ────────────────────────────────────────────────────────────────
  async function fetchPhotos(p: number) {
    loading = true;
    error = null;
    try {
      const res = await fetch(
        `https://picsum.photos/v2/list?page=${p}&limit=${PER_PAGE}`,
      );
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      photos = await res.json();
    } catch (e: any) {
      error = e?.message ?? "Failed to load photos. Check your connection.";
      photos = [];
    } finally {
      loading = false;
    }
  }

  function refresh() {
    page = (page % 10) + 1;
    fetchPhotos(page);
  }

  function thumb(photo: PicsumPhoto) {
    return `https://picsum.photos/id/${photo.id}/400/300`;
  }

  function full(photo: PicsumPhoto) {
    return `https://picsum.photos/id/${photo.id}/1200/800`;
  }

  function openLightbox(photo: PicsumPhoto) {
    expanded = photo;
  }

  function closeLightbox() {
    expanded = null;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      closeLightbox();
      showInfo = false;
    }
    if (!expanded) return;
    const idx = photos.indexOf(expanded);
    if (e.key === "ArrowRight") expanded = photos[(idx + 1) % photos.length];
    if (e.key === "ArrowLeft")
      expanded = photos[(idx - 1 + photos.length) % photos.length];
  }

  onMount(() => fetchPhotos(page));
</script>

<svelte:window on:keydown={handleKeydown} />

<main class="container">
  <!-- Header -->
  <header class="header">
    <div class="header-left">
      <h1 class="title">Gallery</h1>
      <p class="subtitle">Random photography via Lorem Picsum</p>
    </div>
    <div class="header-actions">
      <button
        class="icon-btn"
        on:click={() => (showInfo = true)}
        title="About this app"
      >
        ℹ
      </button>
      <button class="refresh-btn" on:click={refresh} disabled={loading}>
        <span class="refresh-icon" class:spinning={loading}>↻</span>
        {loading ? "Loading…" : "Shuffle"}
      </button>
    </div>
  </header>

  <!-- Error state -->
  {#if error}
    <div class="error-state">
      <span class="error-icon">⚠</span>
      <p class="error-msg">{error}</p>
      <button class="retry-btn" on:click={() => fetchPhotos(page)}>Retry</button
      >
    </div>

    <!-- Loading skeleton -->
  {:else if loading}
    <div class="grid">
      {#each Array(PER_PAGE) as _}
        <div class="card skeleton">
          <div class="skeleton-img"></div>
          <div class="skeleton-meta">
            <div class="skeleton-line wide"></div>
            <div class="skeleton-line narrow"></div>
          </div>
        </div>
      {/each}
    </div>

    <!-- Photo grid -->
  {:else}
    <div class="grid">
      {#each photos as photo (photo.id)}
        <button class="card" on:click={() => openLightbox(photo)}>
          <div class="img-wrap">
            <img
              src={thumb(photo)}
              alt={`Photo by ${photo.author}`}
              loading="lazy"
              class="photo"
            />
            <div class="overlay">
              <span class="overlay-icon">⤢</span>
            </div>
          </div>
          <div class="meta">
            <span class="author">{photo.author}</span>
            <span class="dims">{photo.width} × {photo.height}</span>
          </div>
        </button>
      {/each}
    </div>
  {/if}
</main>

<!-- Info Modal -->
{#if showInfo}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="backdrop" on:click={() => (showInfo = false)}>
    <div class="modal" on:click|stopPropagation>
      <div class="modal-header">
        <h2 class="modal-title">About</h2>
        <button class="close-btn" on:click={() => (showInfo = false)}>✕</button>
      </div>
      <div class="modal-body">
        <p class="modal-desc">
          A minimal photo gallery that pulls random, royalty-free images from
          the Lorem Picsum API. Shuffle to load a fresh set, click any photo to
          view it full-size, and use arrow keys or buttons to browse.
        </p>
        <div class="divider"></div>
        <p class="stack-label">Tech Stack</p>
        <ul class="stack-list">
          <li>
            <span class="stack-key">Framework</span><span class="stack-val"
              >Svelte 4 + TypeScript</span
            >
          </li>
          <li>
            <span class="stack-key">Build</span><span class="stack-val"
              >Vite</span
            >
          </li>
          <li>
            <span class="stack-key">Styling</span><span class="stack-val"
              >Vanilla CSS</span
            >
          </li>
          <li>
            <span class="stack-key">Images</span><span class="stack-val"
              >Lorem Picsum (picsum.photos)</span
            >
          </li>
          <li>
            <span class="stack-key">Architecture</span><span class="stack-val"
              >Module Federation remote</span
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
{/if}

<!-- Lightbox -->
{#if expanded}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="backdrop" on:click={closeLightbox}>
    <div class="lightbox" on:click|stopPropagation>
      <img
        src={full(expanded)}
        alt={`Photo by ${expanded.author}`}
        class="lightbox-img"
      />
      <div class="lightbox-bar">
        <div class="lightbox-meta">
          <span class="lightbox-author">{expanded.author}</span>
          <span class="lightbox-dims"
            >{expanded.width} × {expanded.height}px · ID {expanded.id}</span
          >
        </div>
        <div class="lightbox-nav">
          <button
            class="nav-btn"
            on:click={() => {
              const idx = photos.indexOf(expanded!);
              expanded = photos[(idx - 1 + photos.length) % photos.length];
            }}>←</button
          >
          <button
            class="nav-btn"
            on:click={() => {
              const idx = photos.indexOf(expanded!);
              expanded = photos[(idx + 1) % photos.length];
            }}>→</button
          >
          <button class="close-btn" on:click={closeLightbox}>✕</button>
        </div>
      </div>
    </div>
  </div>
{/if}
