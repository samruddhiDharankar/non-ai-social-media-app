'use client';

import { useState } from "react";

interface TierChangeProps {
    tierChangeValue: number;
}

function TierChange({ tierChangeValue }: TierChangeProps) {
    const [showTierChangeModal, setShowTierChangeModal] = useState(true);

    return (
        <>
            {showTierChangeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-2xl border border-white/20">
                        {/* Tier Message */}
                        <div className="bg-gradient-to-r from-purple-500 via-pink-400 to-yellow-300 text-white p-5 rounded-2xl shadow-md mb-6">
                            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wide text-center drop-shadow-md">
                                {tierChangeValue === 1 && "🚀 Tier Upgraded!"}
                                {tierChangeValue === -1 && "📉 Tier Downgraded"}
                            </h2>
                        </div>

                        {/* Explanation (optional) */}
                        <p className="text-center text-sm text-gray-700 mb-6">
                            Your tier status has changed based on your recent activity.
                        </p>

                        {/* Close Button */}
                        <div className="flex justify-center">
                            <button
                                onClick={() => setShowTierChangeModal(false)}
                                className="bg-gradient-to-r from-pink-600 to-yellow-400 hover:from-pink-700 hover:to-yellow-500 transition duration-300 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:shadow-lg"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default TierChange;
