<script lang="ts">
  import { BLOG_POSTS } from '../data/agencyData';

  let activePost = $state<(typeof BLOG_POSTS)[number] | null>(null);
  let showArchive = $state(false);
</script>

<section class="section" id="blog" aria-labelledby="blog-heading">
  <div class="container">
    <div class="blog-head" data-reveal>
      <div>
        <span class="eyebrow">Knowledge Hub</span>
        <h2 class="section-title" id="blog-heading">Playbooks for high-converting digital products.</h2>
      </div>
      <button type="button" class="btn btn-ghost" onclick={() => (showArchive = !showArchive)}>
        {showArchive ? 'Collapse Index' : 'View All Articles'}
      </button>
    </div>

    <div class="grid-4">
      {#each BLOG_POSTS as post}
        <article class="blog-card" data-glow-card data-reveal>
          <div class="blog-card__img">
            <img src={post.image} alt={post.title} loading="lazy" />
          </div>
          <div class="blog-card__body">
            <div class="blog-card__meta">
              <span class="tag">{post.tag}</span>
              <span class="read-time">{post.readTime}</span>
            </div>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
            <button type="button" class="read-more" onclick={() => (activePost = post)}>
              Read Guide
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </div>
        </article>
      {/each}
    </div>

    {#if showArchive}
      <div class="archive-drawer" data-glow-card>
        <h3>Editorial Index — Industry Vertical Guides</h3>
        <div class="archive-list">
          {#each BLOG_POSTS as post}
            <button type="button" class="archive-row" onclick={() => (activePost = post)}>
              <span class="tag">{post.tag}</span>
              <strong>{post.title}</strong>
              <small>{post.readTime}</small>
            </button>
          {/each}
        </div>
      </div>
    {/if}
  </div>

  {#if activePost}
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-article-title">
      <div class="modal-card">
        <button type="button" class="modal-close" aria-label="Close article" onclick={() => (activePost = null)}>×</button>
        <span class="tag">{activePost.tag} • {activePost.readTime}</span>
        <h3 id="modal-article-title">{activePost.title}</h3>
        <p class="modal-excerpt">{activePost.excerpt}</p>
        <h4>Key Implementation Takeaways</h4>
        <ul>
          {#each activePost.takeaways as tip}
            <li>{tip}</li>
          {/each}
        </ul>
        <a href="#contact" class="btn btn-primary" onclick={() => (activePost = null)}>
          Request Custom Roadmap
        </a>
      </div>
    </div>
  {/if}
</section>

<style lang="scss">
  @use '../styles/tokens' as *;
  @use '../styles/mixins' as *;

  .blog-head {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1.5rem;
    margin-bottom: 2.25rem;

    > div {
      max-width: 680px;
    }
  }

  .blog-card {
    @include interactive-card;
    display: flex;
    flex-direction: column;

    &__img {
      aspect-ratio: 16 / 10;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform $transition-smooth;
      }
    }

    &:hover &__img img {
      transform: scale(1.04);
    }

    &__body {
      padding: 1.35rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      flex: 1;

      h3 {
        margin: 0;
        font-size: 1.08rem;
        line-height: 1.35;
      }

      p {
        margin: 0;
        font-size: 0.86rem;
        color: $text-secondary;
        flex: 1;
      }
    }

    &__meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .read-time {
    font-family: $font-mono;
    font-size: 0.72rem;
    color: $text-muted;
  }

  .read-more {
    align-self: flex-start;
    background: none;
    border: none;
    padding: 0;
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    font-size: 0.86rem;
    font-weight: 700;
    color: $accent-emerald;
    cursor: pointer;
  }

  .archive-drawer {
    @include glass-surface;
    margin-top: 1.75rem;
    border-radius: $radius-lg;
    padding: 1.5rem;

    h3 {
      margin: 0 0 1rem;
      font-size: 1.05rem;
    }
  }

  .archive-list {
    display: grid;
    gap: 0.65rem;
  }

  .archive-row {
    width: 100%;
    text-align: left;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: $radius-sm;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid $border-subtle;
    cursor: pointer;

    strong {
      flex: 1;
      font-size: 0.92rem;
    }

    small {
      color: $text-muted;
      font-family: $font-mono;
    }

    &:hover {
      border-color: rgba(0, 245, 160, 0.35);
    }
  }

  .modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 90;
    background: rgba(3, 5, 10, 0.8);
    backdrop-filter: blur(10px);
    display: grid;
    place-items: center;
    padding: 1.25rem;
  }

  .modal-card {
    @include glass-surface(true);
    border-radius: $radius-lg;
    max-width: 620px;
    width: 100%;
    padding: 2rem;
    position: relative;

    h3 {
      margin: 0.85rem 0 0.75rem;
      font-size: 1.5rem;
    }

    h4 {
      margin: 1.25rem 0 0.6rem;
      font-size: 0.95rem;
      color: $accent-emerald;
    }

    ul {
      margin: 0 0 1.5rem;
      padding-left: 1.2rem;
      color: $text-secondary;
      display: grid;
      gap: 0.5rem;
    }
  }

  .modal-excerpt {
    margin: 0;
    color: $text-secondary;
  }

  .modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid $border-subtle;
    background: rgba(255, 255, 255, 0.06);
    font-size: 1.35rem;
    cursor: pointer;
  }
</style>
