"use client";

import React, {
  useState,
} from "react";

import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import {
  Name,
  Identity,
  EthBalance,
  Address,
  Avatar,
} from "@coinbase/onchainkit/identity";
import "./basepool.css";
import sdk from '@farcaster/frame-sdk';
import DescriptionModal from './DescriptionModal';
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

/* function WalletControl() {
  return (
    <Wallet className="[&>div:nth-child(2)]:!opacity-20 md:[&>div:nth-child(2)]:!opacity-100">
      <ConnectWallet className="w-12 h-12 bg-[#0052FF] rounded-full hover:bg-[#0052FF] focus:bg-[#0052FF] cursor-pointer select-none transition-all duration-150 border-[1px] border-[#0052FF] min-w-12 [box-shadow:0_5px_0_0_#002299,0_8px_0_0_#0033cc33]">
        <ConnectWalletText>{""}</ConnectWalletText>
      </ConnectWallet>
      <WalletDropdown>
        <Identity className="px-4 pt-3 pb-2 [font-family:ProtoMono]" hasCopyAddressOnClick>
          <Avatar />
          <Name />
          <Address />
          <EthBalance />
        </Identity>
        <WalletDropdownDisconnect />
      </WalletDropdown>
      
    </Wallet>
  );
} */

export default function BasePool() {
    const router = useRouter();
    const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
    const { address } = useAccount();
    const handleNavigation = (path: string) => {
    router.push(path);
  };
  const handleShare = async () => {
    try {
      const text = `🟦 Base Pool 🟦 
A provably fair onchain lottery game deployed on @base, designed to be simple, transparent and autonomous.

Available Pools:
0.5 ETH Pool Prize
0.1 ETH Pool Prize
0.05 ETH Pool Prize

Cost per ticket: 0.0005 ETH`;

      const result = await sdk.actions.composeCast({
        text: text,
        embeds: ["https://basepool.miniapps.zone"],
      });

      if (result?.cast) {
        console.log('Cast shared successfully:', result.cast.hash);
      }
    } catch (error) {
      console.error('Error sharing to Warpcast:', error);
    }
  };

  function WalletControl() {
    return (
      <Wallet className="grid gap-2 max-w-xl mx-auto mb-2 items-center text-center">
        <ConnectWallet className="w-full h-12 flex justify-between items-center py-1 bg-[#0052FF] hover:bg-[#0052FF] cursor-pointer">
        <span className="text-sm [font-family:ProtoMono] text-center">
              {address ? (
                "Disconnect"
              ) : (
                <>
               Connect Wallet 
                </>
              )}
            </span>
        </ConnectWallet>
        <WalletDropdown>
          <Identity className="px-4 pt-3 pb-2 [font-family:ProtoMono]" hasCopyAddressOnClick>
            <Avatar />
            <Name />
            <Address />
            <EthBalance />
          </Identity>
          <WalletDropdownDisconnect />
        </WalletDropdown>
        
      </Wallet>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Contenedor principal blanco */}
      <div className="flex-1 w-full max-w-2xl mx-auto px-1 py-1">
        <div className="bg-white rounded-lg w-full h-full p-2 flex flex-col border-2 border-[#0052FF]">
          {/* Header */}
          <div className="text-center mb-0">
            <h1 className="text-[#0052FF] text-3xl [font-family:ProtoMono] leading-tight mb-0">
              BasePool
            </h1>
            <h2 className="text-[#0052FF] text-xl [font-family:ProtoMono] leading-tight text-center mb-2">
            A provably fair onchain lottery game deployed on Base, designed to be simple, transparent and autonomous.
            </h2>
          </div>
          <h2 className="text-[#0052FF] text-lg [font-family:ProtoMono] leading-tight text-center mb-2">

          </h2>
          <div className="text-[#0A0B0D] text-base [font-family:ProtoMono] leading-snug">
            <h2 className="text-[#0052FF] text-2xl [font-family:ProtoMono] leading-tight text-center mb-2">
              👇🏻 Available Pools 👇🏻
            </h2>
            <div className="grid grid-cols-2 gap-2 max-w-xl mx-auto mb-2 items-center text-center">
           {/* 0.5 ETH Pool / 1000 tickets */}
           <button 
              onClick={() => handleNavigation('/pools/bp_1000')}
              className="w-full flex justify-between items-center py-1 border-b border-[#ff8800] cursor-pointer hover:bg-[#0052FF] transition-colors"
            >
              <span className="text-[#0052FF] hover:text-white text-2xl">O.5 ETH Pool</span>
            </button>
            {/* 0.1 ETH Pool / 200 tickets */}
           <button 
              onClick={() => handleNavigation('/pools/bp_200')}
              className="w-full flex justify-between items-center py-1 border-b border-[#ff8800] cursor-pointer hover:bg-[#0052FF] hover:text-white transition-colors"
            >
              <span className="text-[#0052FF] hover:text-white text-2xl">O.1 ETH Pool</span>
            </button>
            {/* 0.05 ETH Pool / 100 tickets */}
           <button 
              onClick={() => handleNavigation('/pools/bp_100')}
              className="w-full flex justify-between items-center py-1 border-b border-[#ff8800] cursor-pointer hover:bg-[#0052FF] hover:text-white transition-colors mb-2"
            >
              <span className="text-[#0052FF] hover:text-white text-2xl">O.05 ETH Pool</span>
            </button>
                        {/* 0.05 ETH Pool / 100 tickets */}
{/*            <button 
              className="w-full flex justify-between items-center py-1 border-b border-[#ff8800] cursor-pointer hover:bg-[#0052FF] hover:text-white transition-colors mb-2"
            >
              <span className="text-[#0052FF] hover:text-white text-2xl">1 ETH Coming Soon</span>
            </button> */}
            </div>
            <h2 
              className="text-[#0052FF] text-xl [font-family:ProtoMono] leading-tight text-center mb-2 cursor-pointer hover:opacity-80"
              onClick={() => setIsDescriptionModalOpen(true)}
            >
              Full Description / FAQ
            </h2>
            <p className="flex items-start mb-1">
            <span className="text-[#0052FF] text-xs">🎟️ 0.0005 ETH per ticket.</span>
            </p>
            <p className="flex items-start mb-1">
            <span className="text-[#0052FF] text-xs">🎲 When pool reaches its target /pyth network draws a random number between participants.</span>
            </p>
            <p className="flex items-start mb-1">
            <span className="text-[#0052FF] text-xs">🍀 Lucky number receives pool balance.</span>
            </p>
            <p className="flex items-start mb-1">
            <span className="text-[#0052FF] text-xs">♻️ New pool starts, same rules.</span>
            </p>
            <p className="flex items-start mb-2">
            <button
              type="button"
              className="text-[#0052FF] text-xs"
              onClick={() => handleShare()}
            >
             🔊 Share BasePool
            </button>
            </p>
            <button
              type="button"
              className="w-full mt-1 text-[10px] [font-family:ProtoMono] text-black opacity-40 cursor-pointer hover:opacity-70 text-center mb-2"
              onClick={() => window.open("https://basescan.org/address/0xb40B5ef4c7cd998B5ef1F7aFB34E842F2Dac3A44", "_blank")}
            >
              Smart Contracts verified at BaseScan ✅
            </button>

            <div className="grid grid-cols-1 gap-2 max-w-xl mx-auto mb-2 items-center text-center">
              <WalletControl />
            </div>
          </div>
        </div>
      </div>
      {/* Description Modal */}
      <DescriptionModal 
        isOpen={isDescriptionModalOpen}
        onClose={() => setIsDescriptionModalOpen(false)}
      />
    </div>
  );
}