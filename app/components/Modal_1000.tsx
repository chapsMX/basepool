import React from 'react';
import { useContractRead } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../lib/contract';
import { formatEther } from 'viem';
import { useAccount } from 'wagmi';

type PoolModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function PoolModal({ isOpen, onClose }: PoolModalProps) {
  const { address } = useAccount();
  const { data, isLoading, error } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getPoolStatus'
  });

  const { data: participantNumbers } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getParticipantNumbers',
    args: address ? [address as `0x${string}`] : undefined
  });

  const { data: conqueredNumbers } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getAllConqueredNumbers'
  });

  if (!isOpen) return null;

  const currentBalance = data?.[2] ? Number(formatEther(data[2])) : 0;
  const threshold = data?.[3] ? Number(formatEther(data[3])) : 0.5;
  const progress = (currentBalance / threshold) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-[400px] mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl [font-family:ProtoMono] text-[#0052FF]">Pool Status</h2>
          <button 
            onClick={onClose}
            className="text-[#0052FF] hover:text-[#0033cc]"
          >
            ✕
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-4 [font-family:ProtoMono] text-[#0052FF]">
            Loading pool status...
          </div>
        ) : error ? (
          <div className="text-center py-4 [font-family:ProtoMono] text-red-500">
            Error loading pool status
          </div>
        ) : (
          <>
            <div className="mb-4">
              <div className="flex justify-between text-sm [font-family:ProtoMono] mb-1">
                <span>Current Balance</span>
                <span>{currentBalance.toFixed(4)} ETH</span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#0052FF] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs [font-family:ProtoMono] mt-1">
                <span>{progress.toFixed(1)}% Filled</span>
                <span>Target: {threshold} ETH</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 [font-family:ProtoMono] text-sm">
              <div>
                <div className="text-gray-500">Pool ID</div>
                <div>{data?.[0]?.toString() || '0'}</div>
              </div>
              <div>
                <div className="text-gray-500">Total Numbers</div>
                <div>{data?.[1]?.toString() || '0'}</div>
              </div>
            </div>

            {address && participantNumbers && participantNumbers.length > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-sm [font-family:ProtoMono] mb-1">
                  <span>Your Numbers</span>
                  <span className="text-[#0052FF]">{participantNumbers.length}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {participantNumbers.map((number, index) => (
                    <span key={index} className="inline-block px-2 py-1 bg-gray-50 border border-[#0052FF] rounded-full text-xs [font-family:ProtoMono] text-[#0052FF]">
                      #{number.toString()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {conqueredNumbers && conqueredNumbers.length > 0 && (
              <div className="mt-4">
                <div className="text-gray-500 mb-2">Previous Conquered Numbers</div>
                <div className="flex flex-wrap gap-2">
                  {conqueredNumbers.map((number, index) => (
                    <span key={index} className="inline-block px-2 py-1 bg-gray-50 border border-[#0052FF] rounded-full text-xs [font-family:ProtoMono] text-[#0052FF]">
                      #{number.toString()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 