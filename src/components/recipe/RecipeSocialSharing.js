'use client';

import { Share2 } from 'lucide-react';
import { FaFacebook, FaInstagram, FaPinterest, FaWhatsapp } from 'react-icons/fa';
import { normalizeUrl } from '@/lib/utils/url';

export default function RecipeSocialSharing({ recipe }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kochera.de';
  const shareUrl = normalizeUrl(siteUrl, `/recept/${recipe.slug}`);
  const shareText = `Kolla in detta fantastiska recept: ${recipe.recipeName || recipe.title}`;

  const handleInstagramClick = async (e) => {
    e.preventDefault();
    try {
      if (navigator?.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      alert('Länk kopierad! Klistra in den i Instagram.');
    } catch (error) {
      alert(`Kopiera denna länk manuellt:\n${shareUrl}`);
    }
  };

  const shareLinks = [
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      icon: FaFacebook,
      color: 'bg-[#1877F2] hover:bg-[#166FE5]',
      onClick: null
    },
    {
      name: 'Instagram',
      url: '#',
      icon: FaInstagram,
      color: 'bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:opacity-90',
      onClick: handleInstagramClick
    },
    {
      name: 'Pinterest',
      url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(shareText)}&media=${encodeURIComponent(recipe.image?.src ? normalizeUrl(siteUrl, recipe.image.src) : '')}`,
      icon: FaPinterest,
      color: 'bg-[#BD081C] hover:bg-[#a50718]',
      onClick: null
    },
    {
      name: 'WhatsApp',
      url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
      icon: FaWhatsapp,
      color: 'bg-[#25D366] hover:bg-[#20ba5a]',
      onClick: null
    }
  ];

  return (
    <section className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 mb-12">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center">
          <Share2 className="w-6 h-6 mr-3 text-purple-600" />
          Dela detta recept
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Sprid glädjen och dela {recipe.recipeName || recipe.title} med dina vänner och familj!
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {shareLinks.map((link) => {
            const IconComponent = link.icon;
            if (link.onClick) {
              return (
                <button
                  key={link.name}
                  onClick={link.onClick}
                  className={`${link.color} text-white w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl`}
                  aria-label={`Dela på ${link.name}`}
                >
                  <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" />
                </button>
              );
            }
            return (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${link.color} text-white w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl`}
                aria-label={`Dela på ${link.name}`}
              >
                <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

