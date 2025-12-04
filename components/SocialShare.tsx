import React, { useState } from 'react';
import { Twitter, Linkedin, Facebook, Link2, Check, Share2 } from 'lucide-react';
import { analytics } from '../utils/analytics';

interface SocialShareProps {
  url?: string;
  title: string;
  description?: string;
  contentType?: 'blog' | 'project' | 'page';
  contentId?: string;
  className?: string;
}

export const SocialShare: React.FC<SocialShareProps> = ({
  url,
  title,
  description,
  contentType = 'page',
  contentId,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = `${title}${description ? ` - ${description}` : ''}`;

  const handleShare = (platform: string, shareUrl: string) => {
    analytics.trackSocialShare(platform, contentType, contentId);

    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);

    switch (platform) {
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
          '_blank',
          'width=550,height=420'
        );
        break;
      case 'linkedin':
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
          '_blank',
          'width=550,height=420'
        );
        break;
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
          '_blank',
          'width=550,height=420'
        );
        break;
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      analytics.trackSocialShare('copy_link', contentType, contentId);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <span className="text-gray-400 text-sm font-medium">Partager:</span>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleShare('twitter', shareUrl)}
          className="p-2 bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/50 rounded-lg text-gray-400 hover:text-blue-400 transition-all"
          aria-label="Partager sur Twitter"
        >
          <Twitter className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleShare('linkedin', shareUrl)}
          className="p-2 bg-white/5 hover:bg-blue-600/20 border border-white/10 hover:border-blue-600/50 rounded-lg text-gray-400 hover:text-blue-500 transition-all"
          aria-label="Partager sur LinkedIn"
        >
          <Linkedin className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleShare('facebook', shareUrl)}
          className="p-2 bg-white/5 hover:bg-blue-700/20 border border-white/10 hover:border-blue-700/50 rounded-lg text-gray-400 hover:text-blue-600 transition-all"
          aria-label="Partager sur Facebook"
        >
          <Facebook className="w-4 h-4" />
        </button>
        <button
          onClick={handleCopyLink}
          className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg text-gray-400 hover:text-white transition-all"
          aria-label="Copier le lien"
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Link2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

// Compact version for cards
export const SocialShareCompact: React.FC<SocialShareProps> = (props) => {
  return (
    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
      <SocialShare {...props} className="justify-end" />
    </div>
  );
};

