import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export async function GET() {
  const getFiles = (dir: string, fileList: string[] = []) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const name = path.join(dir, file);
      if (fs.statSync(name).isDirectory()) {
        getFiles(name, fileList);
      } else {
        fileList.push(name);
      }
    }
    return fileList;
  };

  try {
    const root = process.cwd();
    const allFiles = getFiles(root);
    return NextResponse.json({
      workingDirectory: root,
      files: allFiles.map(f => f.replace(root, ""))
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message });
  }
}