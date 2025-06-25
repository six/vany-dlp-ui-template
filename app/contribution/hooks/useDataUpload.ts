import { useState } from "react";
import { clientSideEncrypt } from "@/lib/crypto/utils";
import { UserInfo } from "../types";
import JSZip from "jszip";
import type { JSZipObject } from "jszip";

export interface IpfsUploadResponse {
  ipfsHash: string;
  ipfsUrl: string;
}

/**
 * Hook for uploading and encrypting data to IPFS
 */
export function useDataUpload() {
  const [isUploading, setIsUploading] = useState(false);

  /**
   * Encrypt and upload data to IPFS
   * @param userInfo - Not used for file content, but can be used for future metadata
   * @param signature - Used for encryption
   * @param file - The actual file selected by the user
   * @param walletAddress - The connected wallet address for account.json
   */
  const uploadData = async (
    userInfo: UserInfo,
    signature: string,
    file: File,
    walletAddress: string
  ): Promise<IpfsUploadResponse | null> => {
    setIsUploading(true);
    try {
      // 1. Generate account.json
      const accountJson = JSON.stringify({ user: walletAddress }, null, 2);

      // 2. Create a zip file with the uploaded file and account.json
      const zip = new JSZip();
      zip.file(file.name, file);
      zip.file("account.json", accountJson);
      const zipBlob = await zip.generateAsync({ type: "blob" });

      // 3. Encrypt the zip file
      const encryptedBlob = await clientSideEncrypt(zipBlob, signature);

      // 4. Upload to IPFS via API route
      const formData = new FormData();
      formData.append("file", encryptedBlob, `vana_dlp_data_encrypted.zip`);
      const response = await fetch("/api/ipfs-upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to upload to IPFS");
      }
      const data = await response.json();
      const ipfsHash = data.ipfsHash;
      // Use Pinata gateway for public IPFS link
      const gateway = "https://gateway.pinata.cloud";
      const ipfsUrl = `${gateway}/ipfs/${ipfsHash}`;
      return { ipfsHash, ipfsUrl };
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadData,
    isUploading,
  };
}
