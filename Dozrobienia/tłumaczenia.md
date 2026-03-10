<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# \# ZADANIE: Przetłumacz i dostosuj CForum (adysec/CForum) dla jimbo77 community

## KONTEKST

Fork repozytorium [https://github.com/adysec/CForum](https://github.com/adysec/CForum) — forum oparte na Cloudflare Workers + Pages + D1 + R2.
Cały UI i backend jest po CHIŃSKU. Potrzebuję pełnego tłumaczenia PL/EN i dostosowania pod projekt jimbo77.

## WYMAGANIA

- Domena: community.jimbo77.org
- Owner/Admin: Karol (NIE Jimbo — Jimbo to marka bloga, Karol to autor)
- Rejestracja: prosty email + hasło, bez barier
- Język UI: POLSKI jako domyślny, angielski jako fallback
- Styl: cyberpunk/dark theme (projekt jimbo77 to cyberpunk AI blog)


## CO TRZEBA PRZETŁUMACZYĆ

### A) Frontend — pliki w `frontend/src/`

1. **frontend/src/pages/register-page.tsx** — stringi:
    - `请完成验证码验证` → "Uzupełnij captcha"
    - `注册失败` → "Rejestracja nie powiodła się"
    - `注册成功！请前往邮箱完成验证后再登录。` → "Rejestracja udana! Sprawdź email i potwierdź konto."
    - `注册` → "Rejestracja"
    - `用户名 (最多 20 字符)` → "Nazwa użytkownika (max 20 znaków)"
    - `邮箱` → "Email"
    - `密码 (8-16 字符)` → "Hasło (8-16 znaków)"
    - `处理中...` → "Ładowanie..."
    - `已有账号？登录` → "Masz już konto? Zaloguj się"
2. **frontend/src/pages/login-page.tsx** — stringi:
    - `登录` → "Logowanie"
    - `邮箱` → "Email"
    - `密码` → "Hasło"
    - `忘记密码？` → "Zapomniałeś hasła?"
    - `没有账号？注册` → "Nie masz konta? Zarejestruj się"
3. **frontend/src/pages/index-page.tsx** (34KB — główna strona) — stringi:
    - `发帖` → "Nowy post"
    - `搜索帖子...` → "Szukaj postów..."
    - `全部` → "Wszystkie"
    - `未分类` → "Bez kategorii"
    - `置顶` → "Przypięty"
    - `暂无帖子` → "Brak postów"
    - `上一页` / `下一页` → "Poprzednia" / "Następna"
    - `最新` / `最热` → "Najnowsze" / "Najpopularniejsze"
    - `浏览` → "Wyświetlenia"
    - `点赞` → "Polubienia"
    - `评论` → "Komentarze"
    - Wszelkie inne chińskie stringi w tym pliku
4. **frontend/src/pages/post-page.tsx** (26KB) — stringi:
    - `编辑` → "Edytuj"
    - `删除` → "Usuń"
    - `确定要删除这篇帖子吗？` → "Na pewno chcesz usunąć ten post?"
    - `评论` → "Komentarz"
    - `回复` → "Odpowiedz"
    - `发表评论` → "Dodaj komentarz"
    - `写下你的评论...` → "Napisz komentarz..."
    - Wszelkie inne chińskie stringi
5. **frontend/src/pages/admin-page.tsx** (18KB) — panel admina:
    - `管理后台` → "Panel admina"
    - `用户管理` → "Użytkownicy"
    - `分类管理` → "Kategorie"
    - `设置` → "Ustawienia"
    - `统计` → "Statystyki"
    - `删除用户` → "Usuń użytkownika"
    - `验证` → "Zweryfikuj"
    - Wszystkie chińskie stringi
6. **frontend/src/pages/settings-page.tsx** (11KB):
    - `个人设置` → "Ustawienia"
    - `头像` → "Avatar"
    - `用户名` → "Nazwa użytkownika"
    - `邮箱` → "Email"
    - `密码` → "Hasło"
    - `两步验证` → "Weryfikacja dwuetapowa (2FA)"
    - `删除账号` → "Usuń konto"
    - Wszystkie chińskie stringi
7. **frontend/src/pages/forgot-page.tsx** i **reset-page.tsx**:
    - `忘记密码` → "Resetowanie hasła"
    - `发送重置链接` → "Wyślij link resetujący"
    - `新密码` → "Nowe hasło"
    - Wszystkie chińskie stringi
8. **frontend/src/components/site-header.tsx**:
    - `主页` → "Strona główna"
    - `切换主题` → "Zmień motyw"
    - `欢迎，` → "Witaj, "
    - `管理后台` → "Admin"
    - `设置` → "Ustawienia"
    - `退出` → "Wyloguj"
    - `登录` → "Zaloguj"
    - `注册` → "Rejestracja"
9. **frontend/src/lib/api.ts**:
    - `登录已过期，请重新登录` → "Sesja wygasła, zaloguj się ponownie"
    - `请求失败` → "Żądanie nie powiodło się"
    - `formatDate()` — zmień locale z `zh-CN` na `pl-PL`

### B) Backend — `src/index.ts` (1931 linii)

Emaile HTML (templates):

- `密码重置请求` → "Resetowanie hasła"
- `请点击下方链接重置您的密码` → "Kliknij poniższy link, aby zresetować hasło"
- `重置密码` → "Resetuj hasło"
- `欢迎加入论坛` → "Witaj na forum Jimbo77 Community!"
- `请验证您的邮箱` → "Potwierdź swój adres email"
- `确认更换邮箱` → "Potwierdź zmianę adresu email"
- `您的头像已更新` → "Twój avatar został zaktualizowany"
- `您的用户名已修改` → "Twoja nazwa użytkownika została zmieniona"
- `账户已验证` → "Konto zweryfikowane"
- `账户已删除` → "Konto usunięte"
- `验证邮件已发送` → "Email weryfikacyjny wysłany"
- Wszystkie inne chińskie stringi w error messages i responses

`src/smtp.ts`:

- `DEFAULT_FROM_NAME = '论坛管理员'` → `'Jimbo77 Community'`
- Chińskie error messages → PL


### C) Branding

Zamień w CAŁYM projekcie:

- `CloudflareForum` → `Jimbo77 Community`
- `cforum` (nazwa projektu w wrangler.jsonc, package.json) → `jimbo77-community`
- `forum.adysec.com` → `community.jimbo77.org`
- `admin@adysec.com` → `karol@jimbo77.org`
- `adysec` → `Bonzokoles` (GitHub owner)
- Default admin password hash → nowy hash dla mojego hasła


### D) Poprawki bezpieczeństwa (KRYTYCZNE)

1. **Password hashing** — zamień SHA-256 bez soli na Web Crypto `scrypt` lub `PBKDF2`:

```typescript
// STARY KOD (ZŁY):
async function hashPassword(password: string): Promise<string> {
  const myDigest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
  return Array.from(new Uint8Array(myDigest)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// NOWY KOD (BEZPIECZNY) — użyj PBKDF2 z solą:
// Wygeneruj sól per-user, zapisz w DB (dodaj kolumnę `salt` do tabeli users)                                                        CORS — zmień 'Access-Control-Allow-Origin': '*' na 'https://community.jimbo77.org'

```


Ukryj emaile — endpoint GET /api/users nie powinien zwracać pola email dla nieautoryzowanych

Rate limiting — dodaj prosty counter w D1 lub KV dla /api/login, /api/register, /api/auth/forgot-password

FORMAT ODPOWIEDZI
Dla każdego pliku podaj:

Pełną listę stringów do zamiany (chiński → polski)
Gotowy kod zmian (search \& replace lub pełne nowe bloki)
Nowe pliki jeśli potrzebne (np. system i18n)
Priorytet: najpierw frontend UI (to co widzi user), potem backend (emaile), potem security fixes.

Podejmę to jak task „specyfikacja → patch plan”, ale nie mogę w jednym kroku wygenerować realnego diffu dla 2k‑linowego backendu i całego frontu, bo nie widzę Twojego forka lokalnie. Opracuję więc precyzyjny plan + gotowe fragmenty kodu i mapę stringów, które możesz wkleić 1:1 w repo.[^1][^2]

## 1. Strategia i18n (PL/EN, domyślnie PL)

Najprościej: proste słownikowe i18n bez bibliotek.

1. Dodaj plik `frontend/src/lib/i18n.ts`:
```ts
// frontend/src/lib/i18n.ts
export type Lang = 'pl' | 'en';

const dict = {
  pl: {
    // register
    complete_captcha: 'Uzupełnij captcha',
    register_failed: 'Rejestracja nie powiodła się',
    register_success: 'Rejestracja udana! Sprawdź email i potwierdź konto.',
    register: 'Rejestracja',
    username_20: 'Nazwa użytkownika (max 20 znaków)',
    email: 'Email',
    password_8_16: 'Hasło (8-16 znaków)',
    loading: 'Ładowanie...',
    have_account_login: 'Masz już konto? Zaloguj się',
    // login
    login: 'Logowanie',
    forgot_password: 'Zapomniałeś hasła?',
    no_account_register: 'Nie masz konta? Zarejestruj się',
    // index
    new_post: 'Nowy post',
    search_posts: 'Szukaj postów...',
    all: 'Wszystkie',
    uncategorized: 'Bez kategorii',
    pinned: 'Przypięty',
    no_posts: 'Brak postów',
    prev_page: 'Poprzednia',
    next_page: 'Następna',
    newest: 'Najnowsze',
    hottest: 'Najpopularniejsze',
    views: 'Wyświetlenia',
    likes: 'Polubienia',
    comments: 'Komentarze',
    // post
    edit: 'Edytuj',
    delete: 'Usuń',
    confirm_delete_post: 'Na pewno chcesz usunąć ten post?',
    comment: 'Komentarz',
    reply: 'Odpowiedz',
    add_comment: 'Dodaj komentarz',
    write_comment: 'Napisz komentarz...',
    // admin
    admin_panel: 'Panel admina',
    user_manage: 'Użytkownicy',
    category_manage: 'Kategorie',
    settings: 'Ustawienia',
    stats: 'Statystyki',
    delete_user: 'Usuń użytkownika',
    verify: 'Zweryfikuj',
    // settings-page
    personal_settings: 'Ustawienia',
    avatar: 'Avatar',
    username: 'Nazwa użytkownika',
    password: 'Hasło',
    two_factor: 'Weryfikacja dwuetapowa (2FA)',
    delete_account: 'Usuń konto',
    // forgot/reset
    forgot_pwd_title: 'Resetowanie hasła',
    send_reset_link: 'Wyślij link resetujący',
    new_password: 'Nowe hasło',
    // header
    home: 'Strona główna',
    toggle_theme: 'Zmień motyw',
    welcome: 'Witaj, ',
    logout: 'Wyloguj',
    // api errors
    session_expired: 'Sesja wygasła, zaloguj się ponownie',
    request_failed: 'Żądanie nie powiodło się',
  },
  en: {
    complete_captcha: 'Please complete the captcha',
    register_failed: 'Registration failed',
    register_success: 'Registration successful! Check your email to confirm the account.',
    register: 'Register',
    username_20: 'Username (max 20 characters)',
    email: 'Email',
    password_8_16: 'Password (8–16 characters)',
    loading: 'Loading...',
    have_account_login: 'Already have an account? Log in',
    login: 'Login',
    forgot_password: 'Forgot password?',
    no_account_register: 'No account? Register',
    new_post: 'New post',
    search_posts: 'Search posts...',
    all: 'All',
    uncategorized: 'Uncategorized',
    pinned: 'Pinned',
    no_posts: 'No posts yet',
    prev_page: 'Previous',
    next_page: 'Next',
    newest: 'Newest',
    hottest: 'Hottest',
    views: 'Views',
    likes: 'Likes',
    comments: 'Comments',
    edit: 'Edit',
    delete: 'Delete',
    confirm_delete_post: 'Are you sure you want to delete this post?',
    comment: 'Comment',
    reply: 'Reply',
    add_comment: 'Add comment',
    write_comment: 'Write your comment...',
    admin_panel: 'Admin panel',
    user_manage: 'Users',
    category_manage: 'Categories',
    settings: 'Settings',
    stats: 'Statistics',
    delete_user: 'Delete user',
    verify: 'Verify',
    personal_settings: 'Settings',
    avatar: 'Avatar',
    username: 'Username',
    password: 'Password',
    two_factor: 'Two-factor authentication (2FA)',
    delete_account: 'Delete account',
    forgot_pwd_title: 'Forgot password',
    send_reset_link: 'Send reset link',
    new_password: 'New password',
    home: 'Home',
    toggle_theme: 'Toggle theme',
    welcome: 'Welcome, ',
    logout: 'Logout',
    session_expired: 'Session expired, please log in again',
    request_failed: 'Request failed',
  },
} as const;

export function t(key: keyof typeof dict['pl'], lang: Lang = 'pl') {
  const d = dict[lang];
  return (d as any)[key] ?? (dict.en as any)[key] ?? key;
}
```

2. Prosty wybór języka: w `frontend/src/main.tsx` (lub root layout) odczytaj `navigator.language` i zapisz w `localStorage` jako `'pl'` lub `'en'`. Domyślnie `'pl'`.[^1]

## 2. Frontend – konkretne zamiany stringów

Poniżej minimalne zmiany w plikach, które podałeś, z użyciem `t()`.

### 2.1 `frontend/src/pages/register-page.tsx`

Mapowanie:

- `请完成验证码验证` → `t('complete_captcha', lang)`
- `注册失败` → `t('register_failed', lang)`
- `注册成功！请前往邮箱完成验证后再登录。` → `t('register_success', lang)`
- `注册` → `t('register', lang)`
- `用户名 (最多 20 字符)` → `t('username_20', lang)`
- `邮箱` → `t('email', lang)`
- `密码 (8-16 字符)` → `t('password_8_16', lang)`
- `处理中...` → `t('loading', lang)`
- `已有账号？登录` → `t('have_account_login', lang)`

Przykładowy fragment:

```tsx
// register-page.tsx (fragment)
import { t, type Lang } from '../lib/i18n';

const lang: Lang = 'pl'; // później pobierz z contextu / hooka

// ...
<p className="text-sm text-red-500">
  {captchaError && t('complete_captcha', lang)}
</p>

<button type="submit">
  {isLoading ? t('loading', lang) : t('register', lang)}
</button>

```

<label>{t('username_20', lang)}</label>

```
```

<label>{t('email', lang)}</label>

```
```

<label>{t('password_8_16', lang)}</label>

```

<p className="text-sm">
  {t('have_account_login', lang)}
</p>
```


### 2.2 `frontend/src/pages/login-page.tsx`

- `登录` → `t('login', lang)`
- `邮箱` → `t('email', lang)`
- `密码` → `t('password', lang)`
- `忘记密码？` → `t('forgot_password', lang)`
- `没有账号？注册` → `t('no_account_register', lang)`

Analogicznie:

```tsx
```

<h1>{t('login', lang)}</h1>

```
```

<label>{t('email', lang)}</label>

```
```

<label>{t('password', lang)}</label>

```
```

<a>{t('forgot_password', lang)}</a>

```
```

<a>{t('no_account_register', lang)}</a>

```
```


### 2.3 `frontend/src/pages/index-page.tsx`

Podmień:

- `发帖` → `t('new_post', lang)`
- `搜索帖子...` → `t('search_posts', lang)`
- `全部` → `t('all', lang)`
- `未分类` → `t('uncategorized', lang)`
- `置顶` → `t('pinned', lang)`
- `暂无帖子` → `t('no_posts', lang)`
- `上一页` → `t('prev_page', lang)`
- `下一页` → `t('next_page', lang)`
- `最新` → `t('newest', lang)`
- `最热` → `t('hottest', lang)`
- `浏览` → `t('views', lang)`
- `点赞` → `t('likes', lang)`
- `评论` → `t('comments', lang)`
-     + wszystkie inne chińskie napisy (tooltipy, placeholdery) na odpowiednie klucze.


### 2.4 `frontend/src/pages/post-page.tsx`

- `编辑` → `t('edit', lang)`
- `删除` → `t('delete', lang)`
- `确定要删除这篇帖子吗？` → `t('confirm_delete_post', lang)`
- `评论` → `t('comment', lang)`
- `回复` → `t('reply', lang)`
- `发表评论` → `t('add_comment', lang)`
- `写下你的评论...` → `t('write_comment', lang)`


### 2.5 `frontend/src/pages/admin-page.tsx`

- `管理后台` → `t('admin_panel', lang)`
- `用户管理` → `t('user_manage', lang)`
- `分类管理` → `t('category_manage', lang)`
- `设置` → `t('settings', lang)`
- `统计` → `t('stats', lang)`
- `删除用户` → `t('delete_user', lang)`
- `验证` → `t('verify', lang)`


### 2.6 `settings-page.tsx`, `forgot-page.tsx`, `reset-page.tsx`

- `个人设置` → `t('personal_settings', lang)`
- `头像` → `t('avatar', lang)`
- `用户名` → `t('username', lang)`
- `邮箱` → `t('email', lang)`
- `密码` → `t('password', lang)`
- `两步验证` → `t('two_factor', lang)`
- `删除账号` → `t('delete_account', lang)`
- `忘记密码` → `t('forgot_pwd_title', lang)`
- `发送重置链接` → `t('send_reset_link', lang)`
- `新密码` → `t('new_password', lang)`


### 2.7 `frontend/src/components/site-header.tsx`

- `主页` → `t('home', lang)`
- `切换主题` → `t('toggle_theme', lang)`
- `欢迎，` → `{t('welcome', lang)}` + username
- `管理后台` → `t('admin_panel', lang)`
- `设置` → `t('settings', lang)`
- `退出` → `t('logout', lang)`
- `登录` → `t('login', lang)`
- `注册` → `t('register', lang)`


### 2.8 `frontend/src/lib/api.ts`

- `登录已过期，请重新登录` → `t('session_expired', lang)`
- `请求失败` → `t('request_failed', lang)`
- `formatDate()`:

```ts
export function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleString('pl-PL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
```


## 3. Backend – emaile i komunikaty

W `src/index.ts` znajdziesz szablony HTML z chińskimi tytułami/treścią.[^1]

Mapowanie tytułów:

- `密码重置请求` → `"Resetowanie hasła"`
- `请点击下方链接重置您的密码` → `"Kliknij poniższy link, aby zresetować hasło"`
- `重置密码` → `"Resetuj hasło"`
- `欢迎加入论坛` → `"Witaj na forum Jimbo77 Community!"`
- `请验证您的邮箱` → `"Potwierdź swój adres email"`
- `确认更换邮箱` → `"Potwierdź zmianę adresu email"`
- `您的头像已更新` → `"Twój avatar został zaktualizowany"`
- `您的用户名已修改` → `"Twoja nazwa użytkownika została zmieniona"`
- `账户已验证` → `"Konto zweryfikowane"`
- `账户已删除` → `"Konto usunięte"`
- `验证邮件已发送` → `"Email weryfikacyjny wysłany"`

Przykład fragmentu:

```ts
const subject = 'Resetowanie hasła';
const html = `
```

<p>Cześć,</p>

```
```

<p>Kliknij poniższy link, aby zresetować hasło do konta w Jimbo77 Community.</p>

```
<p><a href="${resetUrl}">Resetuj hasło</a></p>
```

<p>Jeśli to nie Ty inicjowałeś tę operację, zignoruj tę wiadomość.</p>

```
`;
```

Zrób analogicznie dla maila powitalnego, weryfikacji email, zmiany użytkownika itd. – wszystko PL z prostymi, krótkimi zdaniami.

### 3.1 `src/smtp.ts`

- `DEFAULT_FROM_NAME = '论坛管理员'` →

```ts
export const DEFAULT_FROM_NAME = 'Jimbo77 Community';
```

- Komunikaty błędów (jeśli są po chińsku) zmień np. na:

```ts
throw new Error('Nie udało się wysłać emaila. Spróbuj ponownie później.');
```


## 4. Branding – globalne zamiany

W całym repo (frontend + backend):

- `CloudflareForum` → `Jimbo77 Community`
- `cforum` → `jimbo77-community`
- `forum.adysec.com` → `community.jimbo77.org`
- `admin@adysec.com` → `karol@jimbo77.org`
- `adysec` → `Bonzokoles` (w `package.json`, README, ewentualnych linkach GitHub)

Szczególnie:

- `wrangler.toml` / `wrangler.jsonc`: name/bindings → `jimbo77-community`
- `package.json` `"name": "jimbo77-community"`


## 5. Poprawki bezpieczeństwa (krytyczne)

### 5.1 PBKDF2 + sól w D1

1. W schemacie D1 dodaj kolumnę `salt` (TEXT):
```sql
ALTER TABLE users ADD COLUMN salt TEXT;
```

2. Nowy hasher:
```ts
// src/security.ts (nowy plik)
export async function hashPassword(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode(salt),
      iterations: 100_000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  const rawKey = await crypto.subtle.exportKey('raw', key);
  return Array.from(new Uint8Array(rawKey))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function generateSalt(length = 16): string {
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
```

3. Przy rejestracji:
```ts
import { hashPassword, generateSalt } from './security';

// ...
const salt = generateSalt();
const passwordHash = await hashPassword(password, salt);
await db
  .prepare('INSERT INTO users (email, username, password_hash, salt, ...) VALUES (?, ?, ?, ?, ...)')
  .bind(email, username, passwordHash, salt)
  .run();
```

4. Przy logowaniu:
```ts
const user = await db
  .prepare('SELECT id, password_hash, salt FROM users WHERE email = ?')
  .bind(email)
  .first();

const candidate = await hashPassword(password, user.salt);
if (candidate !== user.password_hash) {
  // auth fail
}
```

5. Default admin password hash – wygeneruj nowy: odpal prosty script w Workerze lub lokalnie, używając powyższej funkcji z Twoim hasłem i wpisz wynik w seederze D1.

### 5.2 CORS

W handlerach API (tam gdzie jest `new Response` z nagłówkami):

- Zmień:

```ts
'Access-Control-Allow-Origin': '*',
```

na:

```ts
'Access-Control-Allow-Origin': 'https://community.jimbo77.org',
'Vary': 'Origin',
```


### 5.3 Ukrywanie emaili w `GET /api/users`

W handlerze listy użytkowników:

```ts
const users = await db.prepare('SELECT id, username, email, role, created_at FROM users').all();

// jeśli request nie jest zautoryzowany:
if (!currentUser || !currentUser.isAdmin) {
  const safeUsers = users.results.map((u: any) => ({
    id: u.id,
    username: u.username,
    role: u.role,
    created_at: u.created_at,
  }));
  return jsonResponse(safeUsers);
}

// tylko admin widzi email
return jsonResponse(users.results);
```


### 5.4 Prosty rate limiting w KV

Załóż, że masz binding `RATE_LIMIT` (KV) w `wrangler.toml`.

```ts
// src/rate-limit.ts
const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 10;

export async function checkRateLimit(env: Env, key: string): Promise<boolean> {
  const now = Date.now();
  const bucketKey = `rl:${key}:${Math.floor(now / WINDOW_MS)}`;
  const current = await env.RATE_LIMIT.get(bucketKey);
  const count = current ? parseInt(current, 10) : 0;
  if (count >= MAX_ATTEMPTS) return false;
  await env.RATE_LIMIT.put(bucketKey, String(count + 1), { expirationTtl: 120 });
  return true;
}
```

W `/api/login`, `/api/register`, `/api/auth/forgot-password`:

```ts
import { checkRateLimit } from './rate-limit';

if (!(await checkRateLimit(env, `login:${ip}`))) {
  return new Response('Too many requests', { status: 429 });
}
```

(IP pobierzesz z `request.headers.get('CF-Connecting-IP')`).

## 6. Styl cyberpunk/dark

Na start: dopal Tailwind/temat bez wchodzenia w design system.

- W głównym layoucie dodaj klasę `data-theme="jimbo77"` i w CSS/`tailwind.config.js` dodaj kolory typu:

```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      bg: '#050816',
      primary: '#00f6ff',
      accent: '#ff00ff',
      surface: '#0f172a',
    },
  },
}
```

- Zamień domyślne tła/teksty na `bg-bg`, `text-gray-200`, border w kolorze `accent`, glow na przyciskach.

***

Jeśli chcesz, mogę w kolejnym kroku przejść plik po pliku (zaczynając od `register-page.tsx` i `login-page.tsx`) i wypisać Ci dokładne fragmenty „przed → po” pod copy‑paste.
<span style="display:none">[^10][^11][^12][^13][^14][^15][^3][^4][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://github.com/adysec

[^2]: https://developers.cloudflare.com/d1/

[^3]: https://github.com/adysec/CForum/forks

[^4]: https://github.com/adysec/adysec

[^5]: https://github.com/adysec/adysec/blob/main/README.md

[^6]: https://github.com/adysec/h1_asset/discussions

[^7]: https://www.devclass.com/development/2024/04/03/cloudflare-updates-workers-platform-with-python-support-event-notifications-and-improved-local-development/1620750

[^8]: https://raw.githubusercontent.com/AdguardTeam/FiltersRegistry/master/filters/filter_18_Annoyances_Cookies/filter.txt

[^9]: https://github.com/adysec/adysec/pulls

[^10]: https://filters.adtidy.org/ios/filters/14.txt

[^11]: https://github.com/adysec/script/actions

[^12]: https://developers.cloudflare.com/workers/platform/storage-options/

[^13]: https://aiesec.org

[^14]: https://github.com/adysec/tracker/activity

[^15]: https://developers.cloudflare.com/changelog/post/2025-06-18-remote-bindings-beta/

