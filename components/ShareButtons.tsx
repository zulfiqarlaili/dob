import { useEffect, useState } from 'react';
import { MdContentCopy, MdDownload, MdShare } from 'react-icons/md';
import {
  FaInstagram,
  FaThreads,
  FaWhatsapp,
  FaXTwitter,
} from 'react-icons/fa6';

type ShareButtonsProps = {
  shareUrl: string;
  shareText: string;
  onDownload: () => void;
};
export default function ShareButtons({
  shareUrl,
  shareText,
  onDownload,
}: ShareButtonsProps) {
  const [expanded, setExpanded] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [status, setStatus] = useState('');
  const [showCopyFallback, setShowCopyFallback] = useState(false);
  useEffect(() => {
    setCanNativeShare(!!navigator.share);
  }, []);
  const text = encodeURIComponent(shareText);
  const url = encodeURIComponent(shareUrl);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setStatus('Link copied. Ready to share.');
      setShowCopyFallback(false);
    } catch {
      setShowCopyFallback(true);
      setStatus('Select and copy the link below.');
    }
  }
  async function nativeShare() {
    try {
      await navigator.share({
        title: 'My BornDate reading',
        text: shareText,
        url: shareUrl,
      });
    } catch (error) {
      if (!(error instanceof Error && error.name === 'AbortError'))
        setStatus('Sharing is unavailable. Try copying the link instead.');
    }
  }
  function download() {
    try {
      onDownload();
      setStatus('Your card is ready. Check your downloads.');
    } catch {
      setStatus('We couldn’t create your card. Please try again.');
    }
  }

  return (
    <section className='sharing-section' aria-label='Share your reading'>
      <div className='reading-actions'>
        <button
          className='secondary-button'
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-controls='sharing-options'
        >
          <MdShare aria-hidden='true' /> Share reading
        </button>
        <button className='text-button' onClick={download}>
          <MdDownload aria-hidden='true' /> Download card
        </button>
      </div>
      {expanded && (
        <div id='sharing-options' className='share-panel fade-in'>
          <p>Share a little of yourself.</p>
          <div className='share-buttons'>
            <a
              className='share-btn'
              href={`https://wa.me/?text=${text}%0A${url}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaWhatsapp aria-hidden='true' /> WhatsApp
            </a>
            <a
              className='share-btn'
              href={`https://twitter.com/intent/tweet?text=${text}&url=${url}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaXTwitter aria-hidden='true' /> X
            </a>
            <a
              className='share-btn'
              href={`https://www.threads.net/intent/post?text=${text}%20${url}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaThreads aria-hidden='true' /> Threads
            </a>
            <button className='share-btn' onClick={download}>
              <FaInstagram aria-hidden='true' /> Download for Story
            </button>
            <button className='share-btn' onClick={copyLink}>
              <MdContentCopy aria-hidden='true' /> Copy link
            </button>
            {canNativeShare && (
              <button className='share-btn' onClick={nativeShare}>
                <MdShare aria-hidden='true' /> More options
              </button>
            )}
          </div>
          {showCopyFallback && (
            <label className='copy-fallback'>
              Reading link
              <input
                readOnly
                value={shareUrl}
                onFocus={(event) => event.target.select()}
              />
            </label>
          )}
        </div>
      )}
      <p className='status-text' role='status'>
        {status}
      </p>
    </section>
  );
}
