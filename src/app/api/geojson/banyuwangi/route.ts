// src/app/api/geojson/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'cluring_banyuwangi.geojson');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const geoJSON = JSON.parse(fileContents);
    return NextResponse.json(geoJSON);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error loading GeoJSON file' },
      { status: 500 }
    );
  }
}