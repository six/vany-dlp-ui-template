import { NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";

// Upload file to Pinata using API Key and Secret
async function uploadToPinata(file: Buffer): Promise<string> {
  const apiKey = process.env.PINATA_API_KEY;
  const privateKey = process.env.PINATA_PRIVATE_KEY;
  if (!apiKey || !privateKey) {
    throw new Error("PINATA_API_KEY or PINATA_PRIVATE_KEY is not set in the environment");
  }

  // Prepare multipart/form-data using the 'form-data' npm package
  const formData = new FormData();
  formData.append("file", file, {
    filename: "file.zip",
    contentType: "application/zip",
  });

  // Pinata API endpoint
  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";

  try {
    // Use axios to POST to Pinata
    const response = await axios.post(url, formData, {
      headers: {
        "pinata_api_key": apiKey,
        "pinata_secret_api_key": privateKey,
        ...formData.getHeaders(),
      },
      maxBodyLength: Infinity,
    });

    if (response.status !== 200) {
      throw new Error(`Pinata upload failed: ${response.statusText}`);
    }

    // Pinata returns the hash in IpfsHash
    return response.data.IpfsHash;
  } catch (err: any) {
    console.error("Pinata upload error (detailed):", err);
    if (err.response) {
      throw new Error(`Pinata error: ${err.response.status} ${err.response.statusText} - ${JSON.stringify(err.response.data)}`);
    } else if (err.request) {
      throw new Error(`No response from Pinata: ${err.message}`);
    } else {
      throw new Error(`Pinata upload error: ${err.message}`);
    }
  }
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
    const ipfsHash = await uploadToPinata(buffer);
    return NextResponse.json({ ipfsHash });
  } catch (error: any) {
    console.error("Pinata upload error (POST handler):", error, error?.stack);
    return NextResponse.json({ error: error.message || "Failed to upload to Pinata", stack: error.stack }, { status: 500 });
  }
} 