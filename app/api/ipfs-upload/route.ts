import { NextResponse } from "next/server";

// Real IPFS upload logic using the IPFS HTTP API
async function uploadToIpfs(file: Buffer): Promise<string> {
  const endpoint = process.env.IPFS_ENDPOINT;
  if (!endpoint) {
    throw new Error("IPFS_ENDPOINT is not set in the environment");
  }

  // Prepare multipart/form-data
  const formData = new FormData();
  formData.append("file", new Blob([file]), "file");

  // Use fetch to POST to the IPFS API
  const response = await fetch(`${endpoint}/api/v0/add`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`IPFS upload failed: ${await response.text()}`);
  }

  // The response is NDJSON, but for a single file, the first line is the result
  const text = await response.text();
  const firstLine = text.split("\n")[0];
  const result = JSON.parse(firstLine);
  return result.Hash;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ipfsHash = await uploadToIpfs(buffer);
    return NextResponse.json({ ipfsHash });
  } catch (error) {
    console.error("IPFS upload error:", error);
    return NextResponse.json({ error: "Failed to upload to IPFS" }, { status: 500 });
  }
} 