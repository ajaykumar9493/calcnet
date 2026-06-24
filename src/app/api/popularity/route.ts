import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const DATA_PATH = join(process.cwd(), "data", "popularity.json");

function readCounts(): Record<string, number> {
  try {
    if (existsSync(DATA_PATH)) {
      return JSON.parse(readFileSync(DATA_PATH, "utf-8"));
    }
  } catch {
    /* ignore */
  }
  return {};
}

function writeCounts(counts: Record<string, number>) {
  writeFileSync(DATA_PATH, JSON.stringify(counts, null, 2));
}

export async function GET() {
  return NextResponse.json({ counts: readCounts() });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { slug } = body;
  if (!slug || typeof slug !== "string") {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }
  const counts = readCounts();
  counts[slug] = (counts[slug] ?? 0) + 1;
  writeCounts(counts);
  return NextResponse.json({ slug, views: counts[slug] });
}
