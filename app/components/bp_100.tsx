"use client";

import React, {
  useState,
} from "react";
import { useNotification } from "@coinbase/onchainkit/minikit";
import {
  ConnectWallet,
  ConnectWalletText,
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
import { useAccount, useWalletClient } from "wagmi";
import { parseEther } from "viem";
import "./basepool.css";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../lib/contract_100";
import PoolModal from './Modal_100';
import WarningModal from './WarningModal';
import TransactionModal from './TransactionModal';
import sdk from '@farcaster/frame-sdk';
import { useContractRead } from "wagmi";
import DescriptionModal from './DescriptionModal';

type ControlButtonProps = {
  className?: string;
  children?: React.ReactNode;
  onClick: () => void;
};

function ControlButton({ children, onClick, className }: ControlButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      type="button"
      className={`w-12 h-12 bg-[#0052FF] rounded-full cursor-pointer select-none
        transition-all duration-150 border-[1px] border-[#0052FF] ${className}
        ${
          isPressed
            ? "translate-y-1 [box-shadow:0_0px_0_0_#002299,0_0px_0_0_#0033cc33] border-b-[0px]"
            : "[box-shadow:0_5px_0_0_#002299,0_8px_0_0_#0033cc33]"
        }`}
      onPointerDown={() => setIsPressed(true)}
      onPointerUp={() => setIsPressed(false)}
      onPointerLeave={() => setIsPressed(false)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function WalletControl() {
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
}

type PillButtonProps = {
  numbers: string;
  eth: string;
  onClick: () => void;
};

function PillButton({ numbers, eth, onClick }: PillButtonProps) {
  return (
        <button
      onClick={onClick}
      className="w-full px-4 py-2 border border-[#0052FF] rounded-full bg-white hover:bg-gray-50 transition-colors text-center group [font-family:ProtoMono]"
    >
      <div className="text-[#0052FF] text-base leading-tight">{numbers}</div>
      <div className="text-[#0A0B0D] text-xs leading-tight">{eth}</div>
    </button>
  );
}

export default function Bp_1000() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [transactionHash, setTransactionHash] = useState<`0x${string}` | undefined>();
  const [transactionAmount, setTransactionAmount] = useState<string | undefined>();
  const notification = useNotification();

  const { data: poolStatus } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getPoolStatus'
  }) as { data: [bigint, bigint] | undefined };

  const handleTransaction = async (amount: string) => {
    if (!walletClient) {
      setIsWarningOpen(true);
      return;
    }

    try {
      // Verificar red Base
      const chainId = await walletClient.getChainId();
      if (chainId !== 8453) {
        try {
          await walletClient.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x2105' }],
          });
          // Esperar a que la red cambie
          await new Promise(resolve => setTimeout(resolve, 1000));
          // Reiniciar la transacción después del cambio de red
          return handleTransaction(amount);
        } catch (switchError) {
          console.error('Error switching to Base:', switchError);
          notification({
            title: "❌ Network Error",
            body: "Please switch to Base network manually in your wallet"
          }).catch(console.error);
          return;
        }
      }

      // Enviar transacción
      const tx = await walletClient.sendTransaction({
        to: CONTRACT_ADDRESS,
        value: parseEther(amount),
      });

      if (!tx) {
        throw new Error('Transaction failed');
      }

      setTransactionAmount(amount);
      setTransactionHash(tx);
      setIsTransactionModalOpen(true);

      const numberOfTickets = Number(amount) / 0.0005;
      
      // Enviar notificación inmediatamente
      try {
        await notification({
          title: "🎲 BasePool Participation",
          body: `Just acquired ${numberOfTickets} numbers in BasePool with ${amount} ETH!\n\n💰 Pool: 0.05 ETH\n🎯 Target: ${(Number(amount) / 0.05 * 100).toFixed(1)}% filled\n\nJoin the pool! 👇\nhttps://basepool.miniapps.zone`
        });
      } catch (notifError) {
        console.error('Error sending notification:', notifError);
      }
    } catch (error) {
      console.error('Transaction error:', error);
      // Mostrar error al usuario
      notification({
        title: "❌ Transaction Failed",
        body: "Please try again. If the problem persists, check your wallet settings."
      }).catch(console.error);
    }
  };

  const handleCloseTransactionModal = () => {
    setIsTransactionModalOpen(false);
    setTransactionHash(undefined);
    setTransactionAmount(undefined);
  };

  const handleShare = async () => {
    try {
      const text = `🔵 Base Pool — fair onchain game
🏆 Prize: 0.05 ETH
💸 0.0005 ETH = 1 number
🎲 At 0.5 ETH, /pyth draws a random number between 0-999
🍀 Lucky number receives contract balance
♻️ New round starts same way

🎟️ Numbers sold: ${poolStatus?.[1] || 0} / 100`;
      const linkUrl = "https://basepool.miniapps.zone";

      await sdk.actions.openUrl(
        `https://farcaster.xyz/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(linkUrl)}`
      );
    } catch (error) {
      console.error('Error sharing to Warpcast:', error);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Contenedor principal blanco */}
      <div className="flex-1 w-full max-w-2xl mx-auto px-1 py-4">
        <div className="bg-white rounded-lg w-full h-full p-2 flex flex-col border-2 border-[#0052FF]">
          {/* Header */}
          <div className="text-center mb-0">
            <h1 className="text-[#0052FF] text-4xl [font-family:ProtoMono] leading-tight mb-0">
              BasePool
            </h1>
            <h2 className="text-[#0052FF] text-xl [font-family:ProtoMono] leading-tight mb-2">
              🏆 Pool target: 0.05 ETH 🏆
            </h2>
            <h2 className="text-[#0052FF] text-xl [font-family:ProtoMono] leading-tight text-center mb-2">
             {poolStatus?.[1]?.toString() || '0'} / 100 tickets sold
            </h2>
          </div>

          {/* Game explanation and Send ETH buttons */}
          <div className="text-[#0A0B0D] text-base [font-family:ProtoMono] leading-snug">
            <h2 className="text-[#0052FF] text-2xl [font-family:ProtoMono] leading-tight text-center mb-3">
              👇🏻 Buy Tickets 👇🏻
            </h2>
            <div className="grid grid-cols-2 gap-2 max-w-xl mx-auto mb-4">
              <PillButton 
                numbers="1 Ticket"
                eth="0.0005 ETH"
                onClick={() => handleTransaction("0.0005")}
              />
              <PillButton 
                numbers="2 Tickets"
                eth="0.001 ETH"
                onClick={() => handleTransaction("0.001")}
              />
              <PillButton 
                numbers="3 Tickets"
                eth="0.0015 ETH"
                onClick={() => handleTransaction("0.0015")}
              />
              <PillButton 
                numbers="5 Tickets"
                eth="0.0025 ETH"
                onClick={() => handleTransaction("0.0025")}
              />
             <PillButton 
                numbers="10 Tickets"
                eth="0.005 ETH"
                onClick={() => handleTransaction("0.005")}
              />
              <PillButton 
                numbers="20 Tickets"
                eth="0.01 ETH"
                onClick={() => handleTransaction("0.01")}
              />
            </div>
            <p className="flex items-start mb-1">
              <span>💸0.0005 ETH per ticket.</span>
            </p>
            <p className="flex items-start mb-1">
              <span>🎲/pyth draws a random number.</span>
            </p>
            <p className="flex items-start mb-1">
              <span>🍀Lucky number gets pool balance.</span>
            </p>
            <p className="flex items-start mb-4">
              <span>♻️New pool starts, same rules.</span>
            </p>
            <h2 
              className="text-[#0052FF] text-xl [font-family:ProtoMono] leading-tight text-center mb-1 cursor-pointer hover:opacity-80"
              onClick={() => setIsDescriptionModalOpen(true)}
            >
              Full Description / FAQ
            </h2>
            <button
              type="button"
              className="w-full mt-1 text-[10px] [font-family:ProtoMono] text-black opacity-40 cursor-pointer hover:opacity-70 text-center"
              onClick={() => window.open("https://basescan.org/address/0xb40B5ef4c7cd998B5ef1F7aFB34E842F2Dac3A44", "_blank")}
            >
              Smart Contract verified at BaseScan ✅
            </button>
          </div>
        </div>
      </div>

      {/* Control buttons */}
      <div className="w-full max-w-2xl mx-auto px-1 py-1">
        <div className="grid grid-cols-3 gap-x-4">
          <div className="flex flex-col items-center">
            <ControlButton onClick={() => handleShare()} className="block mb-2" />
            <span className="text-s [font-family:ProtoMono] text-[#0052FF] text-center">Share<br/>Frame</span>
          </div>
          <div className="flex flex-col items-center">
            <ControlButton onClick={() => setIsModalOpen(true)} className="block mb-2" />
            <span className="text-s [font-family:ProtoMono] text-[#0052FF] text-center">Pool<br/>Status</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="block mb-2">
              <WalletControl />
            </div>
            <span className="text-s [font-family:ProtoMono] text-[#0052FF] text-center">
              {address ? (
                "Disconnect"
              ) : (
                <>
                  Connect<br/>Wallet
                </>
              )}
            </span>
        </div>
        </div>
      </div>

      <PoolModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      />
      <WarningModal
        isOpen={isWarningOpen}
        onClose={() => setIsWarningOpen(false)}
      />
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={handleCloseTransactionModal}
        hash={transactionHash}
        amount={transactionAmount}
        address={address}
      />
      <DescriptionModal 
        isOpen={isDescriptionModalOpen}
        onClose={() => setIsDescriptionModalOpen(false)}
      />
    </div>
  );
}