import React from 'react';

type DescriptionModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function DescriptionModal({ isOpen, onClose }: DescriptionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[#0052FF] text-2xl [font-family:ProtoMono]">BasePool:</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="text-[#0A0B0D] [font-family:ProtoMono] space-y-4">
          <div>
            <h3 className="text-[#0052FF] text-xl mb-2">🎯 Technical Overview of BasePool 🎯</h3>
            <p className="text-base leading-relaxed">
              BasePool is a provably fair onchain lottery game deployed on Base, designed to be simple, transparent, and autonomous. The game revolves around a single smart contract that collects ETH and distributes the entire pool to a randomly selected winner.
            </p>
          </div>

          <div>
            <h3 className="text-[#0052FF] text-xl mb-2">🔧 How It Works</h3>
            <div className="space-y-2">
              <h4 className="font-semibold">Entry Mechanism</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Each 0.0005 ETH sent to the BasePool smart contract grants the sender one unique number, each number corresponds to 1 ticket.</li>
                <li>Smart Contract will only receive TXs with multiples of 0.0005 ETH</li>
                <li>Numbers are assigned sequentially as they are purchased.</li>
              </ul>

              <h4 className="font-semibold">Draw Trigger</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Once the contract balance reaches its pool target (0.5 ETH, 0.1 ETH or 0.05 ETH), the draw is automatically triggered.</li>
                <li>A random number between 0 and total number of tickets is generated using Pyth Network, ensuring verifiability and fairness.</li>
              </ul>

              <h4 className="font-semibold">Winner Selection</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>The wallet holding the number that matches the random result receives the contract balance minus fees.</li>
              </ul>

              <h4 className="font-semibold">Cycle Reset</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>After each draw, the contract resets and a new round begins with the same rules and pricing.</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-[#0052FF] text-xl mb-2">📜 Game Rules</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Ticket price: 0.0005 ETH per number.</li>
              <li>One wallet can hold multiple entries.</li>
              <li>No refunds or partial draws.</li>
              <li>Draw is fair and autonomous using <a href="https://www.pyth.network/entropy" target="_blank" rel="noopener noreferrer" className="text-[#0052FF] hover:underline">Pyth Network</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 