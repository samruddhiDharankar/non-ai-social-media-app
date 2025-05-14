'use client';
type TierAndPerksInfoProps = {
    isVisible: boolean;
    closeModal: () => void;
}

function TierAndPerksInfo({ isVisible, closeModal }: TierAndPerksInfoProps) {
    if (!isVisible) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-80 backdrop-blur-sm p-4">
            <div className="bg-gradient-to-br from-indigo-500 via-pink-500 to-yellow-500 p-6 md:p-8 rounded-3xl text-center shadow-2xl transform md:scale-105 w-full max-w-md">
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 text-shadow-xl">Unlock Your Authenticity Rank!</h2>
                <p className="text-base md:text-lg text-white mb-4 opacity-90">
                    We’re here to reward those who keep it real! Your content's authenticity will shape your rank - move up the ladder by sharing genuine, creative, and original posts.
                </p>
                <p className="text-base md:text-lg text-white mb-6 opacity-80">
                    {/* Your ranking will grow as you engage with the community. The more authentic you are, the more you level up, unlocking exclusive badges and perks. */}
                </p>

                <div className="space-y-3 mt-4 px-4 py-3 bg-white bg-opacity-20 rounded-lg">
                    <h3 className="font-semibold text-xl md:text-2xl text-purple-400">🔮 What’s in Store?</h3>
                    <p className="text-sm opacity-80 text-[#3d2d63]">
                        The higher your authenticity, the more you stand out! Get ready for a fun journey, and let’s see who can reach the top tier first.
                    </p>
                </div>

                <div className="mt-6 flex justify-center">
                    <button
                        onClick={closeModal}
                        className="bg-gradient-to-r from-pink-600 to-yellow-400 text-white px-6 py-3 rounded-full text-base md:text-lg font-semibold shadow-xl hover:scale-105 transition-all duration-300"
                    >
                        Let's Go! 🚀
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TierAndPerksInfo;
