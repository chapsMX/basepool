"use client";

import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
} from "@coinbase/onchainkit/minikit";
import { Name, Identity } from "@coinbase/onchainkit/identity";
import { useCallback, useEffect, useMemo, useState } from "react";
import Snake from "./components/snake";
import { useAccount } from "wagmi";
import Check from "./svg/Check";

const SCHEMA_UID =
  "0x7889a09fb295b0a0c63a3d7903c4f00f7896cca4fa64d2c1313f8547390b7d39";

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);

  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();
  const { address } = useAccount();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const handleAddFrame = useCallback(async () => {
    const frameAdded = await addFrame();
    setFrameAdded(Boolean(frameAdded));
  }, [addFrame, setFrameAdded]);

  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <button
          type="button"
          onClick={handleAddFrame}
          className="cursor-pointer bg-transparent [font-family:ProtoMono] text-sm"
        >
          + SAVE FRAME
        </button>
      );
    }

    if (frameAdded) {
      return (
        <div className="flex items-center space-x-1 text-sm [font-family:ProtoMono] animate-fade-out">
          <Check />
          <span>SAVED</span>
        </div>
      );
    }

    return null;
  }, [context, handleAddFrame, frameAdded]);

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      {/* Header */}
      <header className="w-full py-0 px-4 flex justify-between items-center">
        <div className="flex items-center">
            {address ? (
              <Identity
                address={address}
                schemaId={SCHEMA_UID}
              className="!bg-inherit p-0 [&>div]:space-x-2 [font-family:ProtoMono]"
              >
              <Name className="text-inherit" />
              </Identity>
            ) : (
            <div className="text-gray-500 text-sm [font-family:ProtoMono]">
                NOT CONNECTED
              </div>
            )}
          </div>
        <div>{saveFrameButton}</div>
        </header>

      {/* Main Content */}
      <main className="flex-1 w-full overflow-y-auto">
          <Snake />
        </main>

      {/* Footer */}
      <footer className="w-full py-1 flex justify-center">
          <button
            type="button"
          className="px-2 py-1 flex justify-start rounded-2xl opacity-40 border border-black text-xs [font-family:ProtoMono]"
            onClick={() => openUrl("https://base.org/builders/minikit")}
          >
            BUILT ON BASE WITH MINIKIT
          </button>
        </footer>
    </div>
  );
}
