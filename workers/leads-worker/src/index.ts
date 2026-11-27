import { EmailMessage } from 'cloudflare:email';

export interface Env {
  LEADS_KV: KVNamespace;
  INQUIRY_MAILER: {
    send(message: EmailMessage): Promise<void>;
  };
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  RESEND_API_KEY?: string;
}

const FROM_EMAIL = 'hello@digitalworldau.com';
const TO_EMAIL = 'papica777@gmail.com';
const MAX_FILE_BYTES = 10 * 1024 * 1024;

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim().slice(0, 200);
}

function bytesToBase64Lines(bytes: Uint8Array): string {
  const chunkSize = 0x8000;
  let binary = '';
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  const b64 = btoa(binary);
  const lines: string[] = [];
  for (let i = 0; i < b64.length; i += 76) {
    lines.push(b64.slice(i, i + 76));
  }
  return lines.join('\r\n');
}

function hasAllowedMagicBytes(bytes: Uint8Array): boolean {
  if (bytes.length < 4) return false;
  // %PDF-
  if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) return true;
  // PNG
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return true;
  // JPEG
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return true;
  // DOC / OLE
  if (bytes[0] === 0xd0 && bytes[1] === 0xcf && bytes[2] === 0x11 && bytes[3] === 0xe0) return true;
  // DOCX / ZIP
  if (bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04) return true;
  return false;
}

function buildMimeMessage(params: {
  refCode: string;
  name: string;
  email: string;
  subject: string;
  bodyText: string;
  attachment?: { filename: string; contentType: string; bytes: Uint8Array } | null;
}): string {
  const boundary = `dw_bound_${params.refCode}_${Date.now()}`;
  const safeName = sanitizeHeaderValue(params.name).replace(/"/g, '');
  const safeEmail = sanitizeHeaderValue(params.email);
  const safeSubject = sanitizeHeaderValue(params.subject);

  const baseHeaders = [
    `From: Digital World AU <${FROM_EMAIL}>`,
    `To: ${TO_EMAIL}`,
    `Reply-To: "${safeName}" <${safeEmail}>`,
    `Subject: ${safeSubject}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${sanitizeHeaderValue(params.refCode)}.${Date.now()}@digitalworldau.com>`,
    'MIME-Version: 1.0',
  ];

  if (!params.attachment) {
    return [
      ...baseHeaders,
      'Content-Type: text/plain; charset=utf-8',
      'Content-Transfer-Encoding: 8bit',
      '',
      params.bodyText.replace(/\r?\n/g, '\r\n'),
      '',
    ].join('\r\n');
  }

  const safeFileName = sanitizeHeaderValue(params.attachment.filename).replace(/"/g, '');
  const safeMime = sanitizeHeaderValue(params.attachment.contentType || 'application/octet-stream');
  const b64Body = bytesToBase64Lines(params.attachment.bytes);

  return [
    ...baseHeaders,
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: 8bit',
    '',
    params.bodyText.replace(/\r?\n/g, '\r\n'),
    '',
    `--${boundary}`,
    `Content-Type: ${safeMime}; name="${safeFileName}"`,
    'Content-Transfer-Encoding: base64',
    `Content-Disposition: attachment; filename="${safeFileName}"`,
    '',
    b64Body,
    '',
    `--${boundary}--`,
    '',
  ].join('\r\n');
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      return await handleRequest(request, env, ctx);
    } catch (err) {
      return jsonResponse(
        { ok: false, error: err instanceof Error ? err.message : String(err) },
        500
      );
    }
  },
};

async function handleRequest(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204 });
    }
    if (request.method === 'GET') {
      return jsonResponse({ ok: true, service: 'digitalworldau-leads', status: 'healthy' });
    }
    if (request.method !== 'POST') {
      return jsonResponse({ ok: false, error: 'Method not allowed' }, 405);
    }

    const contentType = request.headers.get('content-type') || '';
    let refCode = '';
    let name = '';
    let email = '';
    let phone = '';
    let scopes = '';
    let currency = 'AUD';
    let budget = '';
    let message = '';
    let pageUrl = '';
    let honeypot = '';
    let attachment: { filename: string; contentType: string; bytes: Uint8Array } | null = null;

    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData();
      refCode = String(form.get('refCode') || '').trim();
      name = String(form.get('name') || '').trim();
      email = String(form.get('email') || '').trim();
      phone = String(form.get('phone') || '').trim();
      scopes = String(form.get('scopes') || '').trim();
      currency = String(form.get('currency') || 'AUD').trim();
      budget = String(form.get('budget') || '').trim();
      message = String(form.get('message') || '').trim();
      pageUrl = String(form.get('pageUrl') || '').trim();
      honeypot = String(form.get('companyWebsite') || '').trim();

      const maybeFile = form.get('attachment');
      if (maybeFile && typeof maybeFile !== 'string' && maybeFile.size > 0) {
        if (maybeFile.size > MAX_FILE_BYTES) {
          return jsonResponse({ ok: false, error: 'Attachment exceeds 10MB limit' }, 400);
        }
        const buf = new Uint8Array(await maybeFile.arrayBuffer());
        if (!hasAllowedMagicBytes(buf)) {
          return jsonResponse({ ok: false, error: 'Unsupported attachment signature' }, 400);
        }
        attachment = {
          filename: maybeFile.name || 'brief-attachment',
          contentType: maybeFile.type || 'application/octet-stream',
          bytes: buf,
        };
      }
    } else if (contentType.includes('application/json')) {
      const data = (await request.json()) as Record<string, unknown>;
      refCode = String(data.refCode || '').trim();
      name = String(data.name || '').trim();
      email = String(data.email || '').trim();
      phone = String(data.phone || '').trim();
      scopes = String(data.scopes || '').trim();
      currency = String(data.currency || 'AUD').trim();
      budget = String(data.budget || '').trim();
      message = String(data.message || '').trim();
      pageUrl = String(data.pageUrl || '').trim();
      honeypot = String(data.companyWebsite || '').trim();
    } else {
      return jsonResponse({ ok: false, error: 'Unsupported Content-Type' }, 415);
    }

    // Silent honeypot success so bots do not retry
    if (honeypot.length > 0) {
      return jsonResponse({ ok: true, refCode: 'DW-BOT-FILTERED', delivered: true, stored: false });
    }

    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ ok: false, error: 'Valid name and work email are required' }, 400);
    }

    if (!refCode) {
      refCode = `DW-${Date.now().toString(36).toUpperCase()}`;
    }

    const receivedAt = new Date().toISOString();
    const record = {
      refCode,
      receivedAt,
      name,
      email,
      phone,
      scopes: scopes || 'Custom Scope',
      currency,
      budget,
      message,
      pageUrl,
      attachment: attachment ? { filename: attachment.filename, bytes: attachment.bytes.length } : null,
      country: (request.cf?.country as string) || 'unknown',
    };

    const kvKey = `lead:${receivedAt}:${refCode}`;
    let stored = false;
    try {
      await env.LEADS_KV.put(kvKey, JSON.stringify(record));
      stored = true;
    } catch {
      stored = false;
    }

    const bodyText = [
      `New Digital World AU Inquiry (${refCode})`,
      `==========================================`,
      `Received: ${receivedAt}`,
      `Country: ${record.country}`,
      `Page URL: ${pageUrl || 'https://digitalworldau.com/'}`,
      ``,
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || 'Not provided'}`,
      `Services: ${record.scopes}`,
      `Budget (${currency}): ${budget || 'Not specified'}`,
      `Attachment: ${attachment ? `${attachment.filename} (${Math.round(attachment.bytes.length / 1024)} KB)` : 'None'}`,
      ``,
      `Project Overview:`,
      message || '(No additional notes)',
    ].join('\n');

    let delivered = false;
    let emailError = '';
    try {
      const rawMime = buildMimeMessage({
        refCode,
        name,
        email,
        subject: `[${refCode}] New Lead: ${name} — ${record.scopes}`,
        bodyText,
        attachment,
      });
      const msg = new EmailMessage(FROM_EMAIL, TO_EMAIL, rawMime);
      await env.INQUIRY_MAILER.send(msg);
      delivered = true;
    } catch (err) {
      emailError = err instanceof Error ? err.message : 'send_email error';
    }

    if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
      const tgText = [
        `🚀 *Digital World AU Lead (${refCode})*`,
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || '—'}`,
        `Scopes: ${record.scopes}`,
        `Budget: ${budget} (${currency})`,
        attachment ? `File: ${attachment.filename}` : '',
        message ? `\n${message.slice(0, 400)}` : '',
      ]
        .filter(Boolean)
        .join('\n');

      ctx.waitUntil(
        fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: env.TELEGRAM_CHAT_ID,
            text: tgText,
            parse_mode: 'Markdown',
          }),
        }).catch(() => {})
      );
    }

    return jsonResponse({
      ok: stored || delivered,
      refCode,
      stored,
      delivered,
      emailError: emailError || undefined,
    });
}
