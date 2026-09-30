import React, { useState } from 'react';
import {
  Copy,
  Check,
  RotateCw,
  Heart,
  Repeat,
  MessageCircle,
  Share,
  BadgeAlert,
} from 'lucide-react';
import { TwitterThreadArtifact } from '@shared/types';
import { useTransformationStore } from '../../store/useTransformationStore';

interface Props {
  data: TwitterThreadArtifact;
}

export const TwitterThreadViewer: React.FC<Props> = ({ data }) => {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedTweetIdx, setCopiedTweetIdx] = useState<number | null>(null);
  const { regenerateSingleArtifact, pipelineStage } = useTransformationStore();

  const handleCopyAll = () => {
    const threadText = data.tweets
      .map((t) => `${t.text}`)
      .join('\n\n---\n\n');
    navigator.clipboard.writeText(threadText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopySingle = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedTweetIdx(idx);
    setTimeout(() => setCopiedTweetIdx(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">
            Format 3 · Microblogging & Real-Time Broadcast
          </span>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Twitter / X Thread ({data.totalTweets || data.tweets.length} Tweets)
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => regenerateSingleArtifact('twitter_thread')}
            disabled={pipelineStage === 'generating_artifacts'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Regenerate Twitter Thread"
          >
            <RotateCw className="h-4 w-4" />
          </button>
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white transition-all shadow-md shadow-sky-600/25"
          >
            {copiedAll ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Copied Thread</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Entire Thread</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Twitter Thread Container */}
      <div className="max-w-xl mx-auto space-y-0 relative">
        {data.tweets.map((tweet, idx) => {
          const isLast = idx === data.tweets.length - 1;
          const charLimit = 280;
          const charPercent = Math.min(100, (tweet.charCount / charLimit) * 100);

          return (
            <div key={idx} className="relative flex gap-3.5 group">
              {/* Left Column: Avatar + Connecting Vertical Line */}
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-md">
                  𝕏
                </div>
                {!isLast && (
                  <div className="w-0.5 flex-1 bg-slate-800 my-1 group-hover:bg-sky-500/40 transition-colors"></div>
                )}
              </div>

              {/* Right Column: Tweet Card */}
              <div className="flex-1 pb-6">
                <div className="bg-slate-900 border border-slate-800 hover:border-slate-700/90 rounded-2xl p-4 transition-all shadow-sm">
                  {/* Tweet Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">OMNIBRIEF</span>
                      <span className="text-[11px] text-slate-500">@omnibrief</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-[10px] font-mono font-bold text-sky-400 bg-sky-950/50 px-2 py-0.5 rounded border border-sky-800/40">
                        {tweet.tweetNumber || idx + 1}/{data.totalTweets || data.tweets.length}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {tweet.calloutBadge && (
                        <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          {tweet.calloutBadge}
                        </span>
                      )}
                      <button
                        onClick={() => handleCopySingle(tweet.text, idx)}
                        className="p-1 text-slate-500 hover:text-slate-300 rounded"
                        title="Copy this tweet"
                      >
                        {copiedTweetIdx === idx ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Tweet Content */}
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-line mb-3">
                    {tweet.text}
                  </p>

                  {/* Tweet Footer: Character Indicator & Mock Engagement */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px] text-slate-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 hover:text-sky-400 cursor-pointer">
                        <MessageCircle className="h-3.5 w-3.5" /> 24
                      </span>
                      <span className="flex items-center gap-1 hover:text-emerald-400 cursor-pointer">
                        <Repeat className="h-3.5 w-3.5" /> 89
                      </span>
                      <span className="flex items-center gap-1 hover:text-rose-400 cursor-pointer">
                        <Heart className="h-3.5 w-3.5" /> 312
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[10px]">
                      <span className={tweet.charCount > 270 ? 'text-amber-400' : 'text-slate-500'}>
                        {tweet.charCount}/280
                      </span>
                      <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            charPercent > 90 ? 'bg-amber-500' : 'bg-sky-500'
                          }`}
                          style={{ width: `${charPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
