import { getProverbOfTheDay } from "@/lib/proverbs";

export const QuoteWidget = () => {
  return (
    <div className="flex h-full w-full items-center justify-center px-4 text-center">
      <p className="text-2xl font-medium text-white italic drop-shadow-lg">
        « {getProverbOfTheDay()} »
      </p>
    </div>
  );
};
