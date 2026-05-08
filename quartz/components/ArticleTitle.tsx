import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import readingTime from "reading-time"
import { getDate, formatDate } from "./Date"
// @ts-ignore
import articleTitleScript from "./scripts/articleTitle.inline"

const ArticleTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const title = fileData.frontmatter?.title
  if (!title) return null

  const author = fileData.frontmatter?.author as string | undefined
  const date = getDate(cfg, fileData)
  const dateStr = date ? formatDate(date, cfg.locale) : undefined

  let readTimeStr: string | undefined
  if (fileData.text) {
    const { minutes } = readingTime(fileData.text)
    readTimeStr = `${Math.ceil(minutes)} min read`
  }

  const hasMeta = author || dateStr || readTimeStr
  const isHome = fileData.slug === "index"

  return (
    <div class={classNames(displayClass, "article-title-hero")}>
      <canvas class="article-title-canvas" />
      <div class="article-title-overlay">
        <h1 class="article-title-text">{title}</h1>
        {!isHome && hasMeta && (
          <div class="article-title-meta">
            {author && (
              <span class="article-meta-item">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.8" />
                  <path
                    d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                  />
                </svg>
                {author}
              </span>
            )}
            {author && (dateStr || readTimeStr) && <span class="article-meta-dot">•</span>}
            {dateStr && (
              <span class="article-meta-item">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <rect
                    x="3"
                    y="4"
                    width="18"
                    height="17"
                    rx="2"
                    stroke="currentColor"
                    stroke-width="1.8"
                  />
                  <path
                    d="M3 9h18M8 2v4M16 2v4"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                  />
                </svg>
                {dateStr}
              </span>
            )}
            {dateStr && readTimeStr && <span class="article-meta-dot">•</span>}
            {readTimeStr && (
              <span class="article-meta-item">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" />
                  <path
                    d="M12 7v5l3 3"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                {readTimeStr}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

ArticleTitle.afterDOMLoaded = articleTitleScript

ArticleTitle.css = `
.article-title-hero {
  position: relative;
  width: 100%;
  min-height: 280px;
  margin: 1.5rem 0 2.5rem 0;
  border-radius: 16px;
  overflow: hidden;
  background: #0d0a14;
}

[saved-theme="light"] .article-title-hero {
  background: #f2eef6;
}

.article-title-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}

.article-title-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.75rem 2rem;
  background: linear-gradient(
    to top,
    rgba(8, 5, 14, 0.72) 0%,
    rgba(8, 5, 14, 0.25) 55%,
    transparent 100%
  );
}

[saved-theme="light"] .article-title-overlay {
  background: linear-gradient(
    to top,
    rgba(242, 238, 246, 0.78) 0%,
    rgba(242, 238, 246, 0.30) 55%,
    transparent 100%
  );
}

.article-title-text {
  color: #fff;
  font-size: clamp(1.65rem, 3.8vw, 2.6rem);
  font-weight: 800;
  margin: 0 0 0.65rem 0;
  line-height: 1.15;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 24px rgba(0, 0, 0, 0.45);
}

[saved-theme="light"] .article-title-text {
  color: #1a0a2e;
  text-shadow: 0 1px 12px rgba(255, 255, 255, 0.5);
}

.article-title-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.68);
  font-size: 0.85rem;
}

[saved-theme="light"] .article-title-meta {
  color: rgba(26, 10, 46, 0.68);
}

.article-meta-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.article-meta-dot {
  opacity: 0.4;
  font-size: 0.7rem;
}
`

export default (() => ArticleTitle) satisfies QuartzComponentConstructor
