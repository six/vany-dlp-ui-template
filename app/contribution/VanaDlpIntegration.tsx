"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Loader2, Upload } from "lucide-react";
import { useSession } from "next-auth/react";
import { useAccount } from "wagmi";
import { useAuthModal } from "../auth/AuthModal";
import { useContributionFlow } from "./hooks/useContributionFlow";
import { UserInfo } from "./types";
import { useRef, useState } from "react";
import { ConnectWalletButton } from "./ConnectWalletButton";
import { ContributionSteps } from "./ContributionSteps";
import { ContributionSuccess } from "./ContributionSuccess";
import { ContributionSummary } from "./ContributionSummary";

/**
 * VanaDlpIntegration component for users to contribute data to VANA's Data Liquidity Pools
 */
export function VanaDlpIntegration() {
  const { isConnected, address: walletAddress } = useAccount();
  const { isOpen, openModal, closeModal } = useAuthModal();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    isSuccess,
    error,
    currentStep,
    completedSteps,
    contributionData,
    shareUrl,
    isLoading,
    isSigningMessage,
    handleContributeData,
    resetFlow,
  } = useContributionFlow();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleContribute = async () => {
    if (!selectedFile) return;
    resetFlow();
    const userInfo: UserInfo = {
      name: "Anonymous",
      email: "anonymous@example.com",
    };
    await handleContributeData(userInfo, selectedFile, isConnected, walletAddress || "");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Contribute to Data Liquidity Pools</CardTitle>
        <CardDescription>
          Upload your data file to contribute to VANA Data Liquidity Pools
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isSuccess && contributionData ? (
          <ContributionSuccess
            contributionData={contributionData}
            completedSteps={completedSteps}
            shareUrl={shareUrl}
          />
        ) : (
          <div className="space-y-4">
            {currentStep > 0 && (
              <ContributionSteps
                currentStep={currentStep}
                completedSteps={completedSteps}
                hasError={!!error}
              />
            )}

            {/* File input for user upload */}
            <div className="flex flex-col items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                accept=".json,.csv,.txt,.zip,.pdf,.png,.jpg,.jpeg"
              />
              {selectedFile && (
                <span className="text-xs text-gray-600">Selected: {selectedFile.name}</span>
              )}
            </div>

            <Button
              onClick={handleContribute}
              disabled={isLoading || !isConnected || !selectedFile}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {currentStep === 1
                    ? "Uploading to IPFS..."
                    : currentStep === 2
                    ? isSigningMessage
                      ? "Signing message..."
                      : "Adding to blockchain..."
                    : currentStep === 3
                    ? "Requesting TEE proof..."
                    : currentStep === 4
                    ? "Processing proof..."
                    : currentStep === 5
                    ? "Claiming reward..."
                    : "Processing..."}
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Contribute Data
                </>
              )}
            </Button>

            {!isConnected && (
              <ConnectWalletButton
                isOpen={isOpen}
                openModal={openModal}
                closeModal={closeModal}
              />
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Your data is encrypted and securely stored on IPFS. You maintain control over who can access it.
      </CardFooter>
    </Card>
  );
}
