import React, { useState, useEffect } from 'react';
import { ExternalLink, Calendar, User } from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  author: string;
  link: string;
  imageUrl?: string;
}

const NewsSection: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(9);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadMoreRef = React.useRef<HTMLDivElement | null>(null);

  const FEED_URL = 'https://varsitarian.net/feed/';
  const PROXY_RAW = 'https://api.allorigins.win/raw?url='; // CORS-friendly
  const CACHE_KEY = 'varsitarian_feed_v1';
  const CACHE_TS_KEY = 'varsitarian_feed_ts_v1';
  const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

  function extractFirstImage(html?: string | null): string | undefined {
    if (!html) return undefined;
    const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    return imgMatch ? imgMatch[1] : undefined;
  }

  function parseRss(xmlText: string): NewsArticle[] {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, 'text/xml');
    const items = Array.from(xml.querySelectorAll('item'));
    return items.slice(0, 50).map((item, idx) => {
      const title = item.querySelector('title')?.textContent?.trim() || 'Untitled';
      const link = item.querySelector('link')?.textContent?.trim() || '#';
      const pubDate = item.querySelector('pubDate')?.textContent || new Date().toISOString();
      const creator = item.getElementsByTagName('dc:creator')[0]?.textContent || 'Varsitarian';
      const description = item.querySelector('description')?.textContent || '';
      const contentEncoded = item.getElementsByTagName('content:encoded')[0]?.textContent || '';
      const mediaContent = (item.getElementsByTagName('media:content')[0]?.getAttribute('url')) || (item.querySelector('enclosure')?.getAttribute('url')) || extractFirstImage(contentEncoded) || extractFirstImage(description);
      const excerpt = description.replace(/<[^>]+>/g, '').slice(0, 160);
      return {
        id: `${idx}-${title}`,
        title,
        excerpt,
        publishedAt: new Date(pubDate).toISOString(),
        author: creator,
        link,
        imageUrl: mediaContent || undefined,
      } as NewsArticle;
    });
  }

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        // Cache-first
        const now = Date.now();
        const ts = parseInt(localStorage.getItem(CACHE_TS_KEY) || '0', 10);
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached && !Number.isNaN(ts) && (now - ts) < CACHE_TTL) {
          setArticles(JSON.parse(cached) as NewsArticle[]);
          setLoading(false);
          return;
        }

        let text = '';
        // Try direct fetch (may fail due to CORS)
        try {
          const res = await fetch(FEED_URL);
          if (res.ok) text = await res.text();
        } catch {}
        // Fallback to proxy
        if (!text) {
          const proxyRes = await fetch(PROXY_RAW + encodeURIComponent(FEED_URL));
          if (!proxyRes.ok) throw new Error('Failed to fetch feed');
          text = await proxyRes.text();
        }

        const parsed = parseRss(text);
        setArticles(parsed);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(parsed));
          localStorage.setItem(CACHE_TS_KEY, String(Date.now()));
        } catch {}
      } catch (err) {
        setError('Failed to load news articles');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Infinite scroll using IntersectionObserver
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const sentinel = loadMoreRef.current;
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        setVisibleCount((prev) => Math.min(prev + 9, articles.length));
      }
    }, { rootMargin: '200px' });
    observer.observe(sentinel);
    return () => observer.unobserve(sentinel);
  }, [articles.length]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Manila'
    });
  };

  if (loading) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800/50 rounded-lg p-6">
        <div className="text-center text-red-400">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Varsitarian News</h2>
          <p className="text-gray-400">Latest articles from the Varsitarian feed</p>
        </div>
        <a
          href="https://www.facebook.com/varsitarian"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Visit Varsitarian</span>
        </a>
      </div>

      {/* Articles Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.slice(0, visibleCount).map((article) => (
          <article
            key={article.id}
            className="bg-gray-800/50 rounded-lg overflow-hidden hover:bg-gray-800/70 transition-colors"
          >
            {article.imageUrl && (
              <div className="aspect-video bg-gray-700">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                {article.title}
              </h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                {article.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="w-3 h-3" />
                  <span>{article.author}</span>
                </div>
              </div>
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-yellow-500 hover:text-yellow-400 transition-colors"
              >
                <span className="text-sm font-medium">Read More</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://www.facebook.com/varsitarian"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-4 inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                aria-label="Open in Facebook"
              >
                <span className="text-sm font-medium">Open in Facebook</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={loadMoreRef} className="h-8" />

      {/* Footer */}
      <div className="text-center text-gray-400 text-sm">
        <p>News powered by <a href="https://www.facebook.com/varsitarian" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Varsitarian</a></p>
      </div>
    </div>
  );
};

export default NewsSection;
