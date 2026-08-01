import { next } from '@vercel/edge';

// 이 앱은 클라이언트 렌더링 SPA라서 링크 미리보기 크롤러는 index.html의
// 고정 OG 태그만 읽는다. 그 결과 어떤 청첩장 링크를 붙여넣어도 미리보기가
// 동일하게 나오므로, 크롤러 요청에 한해 청첩장별 OG 태그를 만들어 응답한다.
//
// 안전 원칙:
// 1. 크롤러 UA에만 개입한다. 실제 하객 요청은 그대로 통과시킨다.
// 2. 어떤 실패든 통과(fail-open)시켜 최악의 경우에도 기존 동작을 유지한다.
export const config = {
  // 어드민 경로와 확장자가 있는 정적 파일은 미들웨어를 태우지 않는다.
  matcher: '/((?!admin|assets|.*\\.).*)',
};

const CRAWLER_UA =
  /kakaotalk-scrap|facebookexternalhit|facebot|twitterbot|slackbot|discordbot|telegrambot|whatsapp|linkedinbot|pinterest|redditbot|googlebot|bingbot|yeti|daumoa/i;

const SLUG_PATTERN = /^\/([a-z0-9-]+)\/?$/;

const FETCH_TIMEOUT_MS = 2500;

const DEFAULT_DESCRIPTION = '저희 두 사람의 특별한 날에 초대합니다.';

export interface OgContent {
  title: string;
  description: string;
  image: string;
  url: string;
}

export function isCrawler(userAgent: string | null | undefined): boolean {
  return typeof userAgent === 'string' && CRAWLER_UA.test(userAgent);
}

export function extractSlug(pathname: string): string | null {
  const matched = SLUG_PATTERN.exec(pathname);
  return matched ? matched[1] : null;
}

// DB에서 온 값이 그대로 마크업에 들어가므로 반드시 이스케이프한다.
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildOgContent(row: Record<string, any>, pageUrl: string): OgContent {
  const groomName = row?.groom?.name ?? '';
  const brideName = row?.bride?.name ?? '';
  const couple = groomName && brideName ? `${groomName} ♥ ${brideName} 결혼합니다` : '저희 결혼합니다';

  return {
    title: couple,
    description: row?.greeting?.title || DEFAULT_DESCRIPTION,
    image: row?.cover_image || '',
    url: pageUrl,
  };
}

export function buildOgHtml(og: OgContent): string {
  const title = escapeHtml(og.title);
  const description = escapeHtml(og.description);
  const image = escapeHtml(og.image);
  const url = escapeHtml(og.url);

  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:url" content="${url}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
  </head>
  <body>
    <a href="${url}">${title}</a>
  </body>
</html>`;
}

async function fetchInvitation(slug: string): Promise<Record<string, any> | null> {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) return null;

  const endpoint =
    `${supabaseUrl}/rest/v1/invitations` +
    `?select=groom,bride,greeting,cover_image&slug=eq.${encodeURIComponent(slug)}&limit=1`;

  const response = await fetch(endpoint, {
    headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  if (!response.ok) return null;

  const rows = await response.json();
  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
}

export default async function middleware(request: Request) {
  try {
    const userAgent = request.headers.get('user-agent');
    if (!isCrawler(userAgent)) return next();

    const requestUrl = new URL(request.url);
    const slug = extractSlug(requestUrl.pathname);
    if (!slug) return next();

    const row = await fetchInvitation(slug);
    if (!row) return next();

    const og = buildOgContent(row, `${requestUrl.origin}/${slug}`);
    return new Response(buildOgHtml(og), {
      status: 200,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=300, s-maxage=300',
      },
    });
  } catch {
    // 미리보기 생성 실패가 청첩장 접속 자체를 막아서는 안 된다.
    return next();
  }
}
