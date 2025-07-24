import React from 'react';
import { useTransaction, useContractRead } from 'wagmi';
import { formatEther } from 'viem';
import ArrowSvg from '../svg/ArrowSvg';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../lib/contract';
import sdk from '@farcaster/frame-sdk';

type TransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  hash?: `0x${string}`;
  amount?: string;
  address?: string;
};

export default function TransactionModal({ isOpen, onClose, hash, amount, address }: TransactionModalProps) {
  const { data, isError, isLoading } = useTransaction({
    hash: hash || undefined,
  });

  const { data: participantNumbers } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getParticipantNumbers',
    args: address ? [address as `0x${string}`] : undefined
  });

  const { data: poolStatus, refetch: refetchPoolStatus } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getPoolStatus'
  });

  // Refetch pool status when transaction is confirmed
  React.useEffect(() => {
    if (data) {
      refetchPoolStatus();
    }
  }, [data, refetchPoolStatus]);

  if (!isOpen) return null;

  const getStatusColor = () => {
    if (isError) return 'text-red-500';
    if (isLoading) return 'text-[#0052FF]';
    if (data) return 'text-green-500';
    return 'text-[#0052FF]';
  };

  const getStatusText = () => {
    if (isError) return 'Transaction Failed';
    if (isLoading) return 'Transaction Pending';
    if (data) return 'Transaction Successful';
    return 'Initiating Transaction';
  };

  const getStatusIcon = () => {
    if (isError) return '❌';
    if (isLoading) return '⏳';
    if (data) return '✅';
    return '🔄';
  };

  const numberOfNumbers = amount ? Number(amount) / 0.0005 : 0;
  const currentBalance = poolStatus?.[2] ? Number(formatEther(poolStatus[2])) : 0;
  const threshold = poolStatus?.[3] ? Number(formatEther(poolStatus[3])) : 0.5;
  const progress = (currentBalance / threshold) * 100;

  const handleShare = async () => {
    if (!amount) return;
    
    try {
      // Refetch pool data before sharing
      await refetchPoolStatus();
      
      const numberOfTickets = Number(amount) / 0.0005;
      const text = `I just bought ${numberOfTickets} ticket${numberOfTickets > 1 ? 's' : ''} for Base Pool, a fair on chain game\n\n🏆 Prize: 0.5 ETH\n💰 Pool Balance: ${currentBalance.toFixed(4)} ETH\n🎟️ Tickets sold: ${poolStatus?.[1] || 0} / 1000\n\nBuy your tickets and join Base Pool 👇`;
      const linkUrl = "https://basepool.miniapps.zone";

      await sdk.actions.openUrl(
        `https://farcaster.xyz/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(linkUrl)}`
      );
    } catch (error) {
      console.error('Error sharing to Warpcast:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-[400px] mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl [font-family:ProtoMono] text-[#0052FF]">Transaction Status</h2>
          <button 
            onClick={onClose}
            className="text-[#0052FF] hover:text-[#0033cc]"
          >
            ✕
          </button>
        </div>

        <div className="text-center mb-6">
          <div className={`text-xl mb-2 [font-family:ProtoMono] ${getStatusColor()}`}>
            {getStatusIcon()} {getStatusText()}
          </div>
          {amount && (
            <div className="text-sm [font-family:ProtoMono] text-gray-600">
              Sending {amount} ETH for {numberOfNumbers} number{numberOfNumbers > 1 ? 's' : ''}
            </div>
          )}
        </div>

        {hash && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="text-sm [font-family:ProtoMono] text-gray-500 mb-1">
              Transaction Hash
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm [font-family:ProtoMono] text-[#0A0B0D] truncate">
                {hash}
              </div>
              <a
                href={`https://basescan.org/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0052FF] hover:text-[#0033cc] ml-2"
              >
                <ArrowSvg />
              </a>
            </div>
          </div>
        )}

        {data && participantNumbers && participantNumbers.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="text-sm [font-family:ProtoMono] text-gray-500 mb-2">
              Your Assigned Numbers
            </div>
            <div className="flex flex-wrap gap-2">
              {participantNumbers.map((number, index) => (
                <span key={index} className="inline-block px-2 py-1 bg-white border border-[#0052FF] rounded-full text-xs [font-family:ProtoMono] text-[#0052FF]">
                  #{number.toString()}
                </span>
              ))}
            </div>
          </div>
        )}

        {data && poolStatus && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="text-sm [font-family:ProtoMono] text-gray-500 mb-2">
              Pool Progress
            </div>
            <div className="flex justify-between text-sm [font-family:ProtoMono] mb-1">
              <span>Current Balance</span>
              <span>{currentBalance.toFixed(4)} ETH</span>
            </div>
            <div className="h-3 bg-white rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#0052FF] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-right text-xs [font-family:ProtoMono] mt-1">
              Target: {threshold} ETH
            </div>
          </div>
        )}

        {isError && (
          <div className="text-center text-red-500 [font-family:ProtoMono] text-sm">
            Please try again. If the problem persists, check your wallet settings.
          </div>
        )}

        {data && (
          <div className="flex justify-center">
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-white text-[#0052FF] border border-[#0052FF] rounded-full hover:bg-gray-50 transition-colors [font-family:ProtoMono]"
            >
              Share
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 