'use client'

import { useState } from 'react'
import { Store, ReceiptText, Mail } from 'lucide-react'
import { CGVModal } from '@/components/cgv-modal'
import { EmailPreviewModal } from '@/components/email-preview-modal'

export function Footer() {
  const [isCGVOpen, setIsCGVOpen] = useState(false)
  const [isEmailPreviewOpen, setIsEmailPreviewOpen] = useState(false)

  return (
    <>
      <footer className="py-16 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <p className="text-gray-600 mb-3 font-light">
                Une question ? Notre équipe est là
              </p>
              <a
                href="mailto:info.xeilom@xeilom.fr"
                className="text-blue-600 font-medium hover:text-blue-700 transition-colors no-underline"
              >
                info.xeilom@xeilom.fr
              </a>
              <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                <a
                  href="https://www.xeilom.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <Store className="h-4 w-4" />
                  Notre boutique
                </a>
                <button
                  onClick={() => setIsCGVOpen(true)}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <ReceiptText className="h-4 w-4" />
                  CGV
                </button>
                <button
                  onClick={() => setIsEmailPreviewOpen(true)}
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <Mail className="h-4 w-4" />
                  Prévisualiser les emails
                </button>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://www.youtube.com/@xeilom455"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-100 flex items-center justify-center transition-colors duration-300 group"
                aria-label="YouTube"
              >
                <svg
                  className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              <a
                href="https://www.tiktok.com/@xeilom_france"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-100 flex items-center justify-center transition-colors duration-300 group"
                aria-label="TikTok"
              >
                <svg
                  className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>

              <a
                href="https://www.linkedin.com/company/xeilom"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-100 flex items-center justify-center transition-colors duration-300 group"
                aria-label="LinkedIn"
              >
                <svg
                  className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>

              <a
                href="https://www.facebook.com/xeilom"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-100 flex items-center justify-center transition-colors duration-300 group"
                aria-label="Facebook"
              >
                <svg
                  className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* CGV Modal */}
      <CGVModal open={isCGVOpen} onOpenChange={setIsCGVOpen} />

      {/* Email Preview Modal */}
      <EmailPreviewModal open={isEmailPreviewOpen} onOpenChange={setIsEmailPreviewOpen} />
    </>
  )
}
