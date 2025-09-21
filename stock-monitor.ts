#!/usr/bin/env node

import axios from 'axios';
import chalk from 'chalk';
import dotenv from 'dotenv';

dotenv.config();

export interface StockQuote {
	symbol: string;
	price: number;
	change: number;
	changePercent: number;
	timestamp: number;
	currency?: string;
	marketState?: string;
}

export interface MonitorOptions {
	intervalMs?: number;
	telegram?: boolean;
	thresholdPercent?: number; // send alert when change exceeds this percent (absolute)
}

const DEFAULT_INTERVAL_MS = parseInt(process.env.AAPL_POLL_INTERVAL_MS || '60000');

export async function fetchQuote(symbol: string): Promise<StockQuote> {
	const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbol)}`;
	const { data } = await axios.get(url, { timeout: 10000 });
	const result = data?.quoteResponse?.result?.[0];
	if (!result) {
		throw new Error('No quote data returned');
	}
	const price = result.regularMarketPrice ?? result.postMarketPrice ?? result.preMarketPrice;
	const change = result.regularMarketChange ?? result.postMarketChange ?? result.preMarketChange ?? 0;
	const changePercent = result.regularMarketChangePercent ?? result.postMarketChangePercent ?? result.preMarketChangePercent ?? 0;
	return {
		symbol: result.symbol || symbol,
		price: Number(price ?? 0),
		change: Number(change),
		changePercent: Number(changePercent),
		timestamp: Date.now(),
		currency: result.currency,
		marketState: result.marketState,
	};
}

export function formatQuote(quote: StockQuote): string {
	const dir = quote.change >= 0 ? '🟢' : '🔴';
	const pct = `${quote.changePercent.toFixed(2)}%`;
	const price = `${quote.price.toFixed(2)}${quote.currency ? ' ' + quote.currency : ''}`;
	const state = quote.marketState ? ` (${quote.marketState})` : '';
	return `${dir} ${quote.symbol}${state} — ${price} (${pct})`;
}

async function sendTelegram(message: string): Promise<void> {
	const token = process.env.TELEGRAM_BOT_TOKEN;
	const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
	if (!token || !chatId || chatId.includes('YOUR_') || chatId.includes('your_')) {
		console.log(chalk.yellow('⚠️ Telegram not configured. Skipping notification.'));
		return;
	}
	const url = `https://api.telegram.org/bot${token}/sendMessage`;
	await axios.post(url, {
		chat_id: chatId,
		text: message,
		parse_mode: 'Markdown'
	});
}

export async function checkOnce(symbol: string, notify: boolean = true): Promise<StockQuote> {
	const quote = await fetchQuote(symbol);
	const line = formatQuote(quote);
	console.log(chalk.blue(line));
	if (notify) {
		await sendTelegram(`📈 تحديث ${symbol}\n${line}`);
	}
	return quote;
}

export async function watchSymbol(symbol: string, options: MonitorOptions = {}): Promise<() => void> {
	const intervalMs = options.intervalMs ?? DEFAULT_INTERVAL_MS;
	const notify = options.telegram !== false; // default true
	const threshold = options.thresholdPercent ?? 0; // 0 = always

	console.log(chalk.cyan(`\n📡 Monitoring ${symbol} every ${Math.round(intervalMs/1000)}s (alerts: ${notify ? 'Telegram ON' : 'OFF'})\n`));
	let lastPrice: number | null = null;
	let lastAlertPct: number | null = null;

	const timer = setInterval(async () => {
		try {
			const q = await fetchQuote(symbol);
			const line = formatQuote(q);
			console.log(line);

			if (notify) {
				let shouldAlert = threshold === 0;
				if (!shouldAlert && lastPrice !== null) {
					const pctMove = ((q.price - lastPrice) / lastPrice) * 100;
					if (Math.abs(pctMove) >= threshold) {
						shouldAlert = true;
						lastAlertPct = pctMove;
					}
				}
				if (shouldAlert) {
					await sendTelegram(`📈 ${symbol} Update\n${line}`);
				}
			}
			lastPrice = q.price;
		} catch (err: any) {
			console.log(chalk.red(`❌ Monitor error: ${err.message}`));
		}
	}, intervalMs);

	const stop = () => clearInterval(timer);
	return stop;
}
