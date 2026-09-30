import React, { useState } from 'react';
import {
  Copy,
  Check,
  RotateCw,
  Globe2,
  ThumbsUp,
  MessageSquare,
  Repeat2,
  Send,
  MoreHorizontal,
  Sparkles,
} from 'lucide-react';
import { LinkedInPostArtifact } from '@shared/types';
import { useTransformationStore } from '../../store/useTransformationStore';

interface Props {
  data: LinkedInPostArtifact;
}

export const LinkedInPostViewer: React.FC<Props> = ({ data }) => {
  const [copied, setCopied] = useState(false);
  const { regenerateSingleArtifact, pipelineStage, parameters } = useTransformationStore();

  const handleCopy = () => {
    navigator.clipboard.writeText(data.fullFormattedPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
            Format 2 · Professional Social Channel
          </span>
          <h2 className="text-lg font-bold text-white tracking-tight">
            LinkedIn Thought Leadership Post
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
            {data.characterCount || data.fullFormattedPost.length} chars
          </span>
          <button
            onClick={() => regenerateSingleArtifact('linkedin_post')}
            disabled={pipelineStage === 'generating_artifacts'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Regenerate LinkedIn Post"
          >
            <RotateCw className="h-4 w-4" />
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md shadow-blue-600/25"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy for LinkedIn</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Simulated LinkedIn Card Container */}
      <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        {/* Post Author Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
              OB
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm text-slate-100">
                  OMNIBRIEF
                </span>
                <span className="text-xs text-slate-400 font-normal">· 1st</span>
              </div>
              <p className="text-xs text-slate-400 leading-tight">
                Strategic Communications · {parameters.targetAudience}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                <span>Just now</span>
                <span>•</span>
                <Globe2 className="h-3 w-3" />
              </div>
            </div>
          </div>

          <button className="text-slate-500 hover:text-slate-300 p-1">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>

        {/* Post Body Content */}
        <div className="space-y-3.5 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-line">
          {/* Hook */}
          <p className="font-semibold text-white tracking-tight">
            {data.hook}
          </p>

          {/* Body Paragraphs */}
          {data.bodyParagraphs?.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}

          {/* Bullet Insights */}
          {data.bulletInsights?.length > 0 && (
            <div className="space-y-1.5 py-1">
              {data.bulletInsights.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span>•</span>
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          )}

          {/* Call To Action */}
          {data.callToAction && (
            <p className="font-medium text-brand-300 pt-1">
              {data.callToAction}
            </p>
          )}

          {/* Hashtags */}
          {data.hashtags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {data.hashtags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs text-blue-400 hover:underline cursor-pointer font-medium"
                >
                  {tag.startsWith('#') ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Social Engagement Stats */}
        <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-1">
              <span className="h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center text-[9px] text-white">
                👍
              </span>
              <span className="h-4 w-4 rounded-full bg-rose-500 flex items-center justify-center text-[9px] text-white">
                ❤️
              </span>
              <span className="h-4 w-4 rounded-full bg-amber-500 flex items-center justify-center text-[9px] text-white">
                💡
              </span>
            </div>
            <span>842 reactions</span>
          </div>
          <span>64 comments · 31 reposts</span>
        </div>

        {/* Social Interaction Buttons */}
        <div className="mt-2 pt-2 border-t border-slate-800/80 grid grid-cols-4 gap-1 text-slate-400 text-xs font-semibold">
          <button className="flex items-center justify-center gap-1.5 py-2 hover:bg-slate-800 rounded-lg transition-colors">
            <ThumbsUp className="h-4 w-4" />
            <span className="hidden sm:inline">Like</span>
          </button>
          <button className="flex items-center justify-center gap-1.5 py-2 hover:bg-slate-800 rounded-lg transition-colors">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Comment</span>
          </button>
          <button className="flex items-center justify-center gap-1.5 py-2 hover:bg-slate-800 rounded-lg transition-colors">
            <Repeat2 className="h-4 w-4" />
            <span className="hidden sm:inline">Repost</span>
          </button>
          <button className="flex items-center justify-center gap-1.5 py-2 hover:bg-slate-800 rounded-lg transition-colors">
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
