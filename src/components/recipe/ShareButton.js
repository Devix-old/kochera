'use client';

import { Share2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { FaFacebook, FaInstagram, FaPinterest, FaWhatsapp } from 'react-icons/fa';

export default function ShareButton({ title, excerpt, url }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const shareText = excerpt || `Schau dir dieses Rezept an: ${title}`;

  const shareLinks = [
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      icon: FaFacebook,
      color: 'bg-[#1877F2] hover:bg-[#166FE5]',
      isInstagram: false
    },
    {
      name: 'Instagram',
      url: url,
      icon: FaInstagram,
      color: 'bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:opacity-90',
      isInstagram: true
    },
    {
      name: 'Pinterest',
      url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(shareText)}`,
      icon: FaPinterest,
      color: 'bg-[#BD081C] hover:bg-[#a50718]',
      isInstagram: false
    },
    {
      name: 'WhatsApp',
      url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + url)}`,
      icon: FaWhatsapp,
      color: 'bg-[#25D366] hover:bg-[#20ba5a]',
      isInstagram: false
    }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleShareClick = async (link) => {
    if (link.isInstagram) {
      try {
        if (navigator?.clipboard?.writeText && window.isSecureContext) {
          await navigator.clipboard.writeText(url);
        } else {
          const textarea = document.createElement('textarea');
          textarea.value = url;
          textarea.style.position = 'fixed';
          textarea.style.left = '-9999px';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }
        alert('Länk kopierad! Klistra in den i Instagram.');
      } catch (error) {
        alert(`Kopiera denna länk manuellt:\n${url}`);
      }
    } else {
      window.open(link.url, '_blank', 'width=600,height=400');
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors border border-purple-200 dark:border-purple-800 cursor-pointer"
        aria-label="Rezept teilen"
      >
        <Share2 className="w-4 h-4" />
        <span className="text-sm font-medium">Teilen</span>
      </button>

      {/* Small Dropdown Popup */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-3">
            <div className="flex gap-2">
              {shareLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <button
                    key={link.name}
                    onClick={() => handleShareClick(link)}
                    className={`group relative flex items-center justify-center w-10 h-10 rounded-full ${link.color} text-white transition-all duration-200 hover:scale-110 shadow-md hover:shadow-lg`}
                    aria-label={`Dela på ${link.name}`}
                    title={link.name}
                  >
                    <IconComponent className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

