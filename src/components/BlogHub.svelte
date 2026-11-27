<script lang="ts">
  import { BLOG_POSTS } from '../data/agencyData';
</script>

<section class="section" id="blog" aria-labelledby="blog-heading">
  <div class="container">
    <div class="blog-head" data-reveal>
      <div>
        <span class="eyebrow">Knowledge Hub</span>
        <h2 class="section-title" id="blog-heading">Playbooks for high-converting digital products.</h2>
      </div>
      <a href="/blog/" class="btn btn-ghost">
        View All Articles →
      </a>
    </div>

    <div class="grid-4">
      {#each BLOG_POSTS as post}
        <article class="blog-card" data-glow-card data-reveal>
          <a href={`/blog/${post.slug}/`} class="blog-card__img">
            <img src={post.image} alt={post.title} loading="lazy" />
          </a>
          <div class="blog-card__body">
            <div class="blog-card__meta">
              <span class="tag">{post.tag}</span>
              <span class="read-time">{post.readTime}</span>
            </div>
            <h3>
              <a href={`/blog/${post.slug}/`}>{post.title}</a>
            </h3>
            <p>{post.excerpt}</p>
            <a href={`/blog/${post.slug}/`} class="read-more">
              Read Guide
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
          </div>
        </article>
      {/each}
    </div>
  </div>
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
      display: block;

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
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    font-size: 0.86rem;
    font-weight: 700;
    color: $accent-emerald;
  }
</style>
