import { useMemo } from 'react';
import {
  MdCheckCircle,
  MdContentCopy,
  MdDownload,
  MdShare,
} from 'react-icons/md';
import {
  FaInstagram,
  FaThreads,
  FaWhatsapp,
  FaXTwitter,
} from 'react-icons/fa6';

type ShareButtonsProps = {
  shareUrl: string;
  shareText: string;
  elementName?: string;
  copyStatus?: string;
  onCopy: () => void;
  onDownload: () => void;
};

export default function ShareButtons({
  shareUrl,
  shareText,
  elementName,
  copyStatus,
  onCopy,
  onDownload,
}: ShareButtonsProps) {
  const canNativeShare = useMemo(
    () => typeof navigator !== 'undefined' && !!navigator.share,
    [],
  );

  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(shareUrl);

  function handleWhatsApp() {
    window.open(
      `https://wa.me/?text=${encodedText}%0A${encodedUrl}`,
      '_blank',
      'noopener',
    );
  }

  function handleTwitter() {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      '_blank',
      'noopener',
    );
  }

  function handleThreads() {
    window.open(
      `https://www.threads.net/intent/post?text=${encodedText}%20${encodedUrl}`,
      '_blank',
      'noopener',
    );
  }

  function handleInstagram() {
    // Instagram doesn't have a direct share URL — trigger download for story
    onDownload();
  }

  async function handleNativeShare() {
    try {
      await navigator.share({
        title: 'My BornDate Reading',
        text: shareText,
        url: shareUrl,
      });
    } catch (err) {
      // User cancelled or share failed — ignore
    }
  }

  return (
    <div className='share-buttons'>
      <button
        className='share-btn share-btn--whatsapp'
        onClick={handleWhatsApp}
        title='Share to WhatsApp'
      >
        <FaWhatsapp size={16} />
        WhatsApp
      </button>
      <button
        className='share-btn share-btn--twitter'
        onClick={handleTwitter}
        title='Share to X / Twitter'
      >
        <FaXTwitter size={14} />
        X
      </button>
      <button
        className='share-btn share-btn--threads'
        onClick={handleThreads}
        title='Share to Threads'
      >
        <FaThreads size={14} />
        Threads
      </button>
      <button
        className='share-btn share-btn--instagram'
        onClick={handleInstagram}
        title='Share to Instagram (downloads card)'
      >
        <FaInstagram size={15} />
        Story
      </button>
      <button
        className='share-btn share-btn--copy'
        onClick={onCopy}
        title='Copy link'
      >
        {copyStatus ? (
          <>
            <MdCheckCircle size={15} />
            Copied!
          </>
        ) : (
          <>
            <MdContentCopy size={15} />
            Copy Link
          </>
        )}
      </button>
      <button
        className='share-btn share-btn--download'
        onClick={onDownload}
        title='Download card'
      >
        <MdDownload size={16} />
        Download
      </button>
      {canNativeShare && (
        <button
          className='share-btn share-btn--native'
          onClick={handleNativeShare}
          title='Share'
        >
          <MdShare size={16} />
          More
        </button>
      )}
    </div>
  );
}
