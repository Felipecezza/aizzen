import { useEffect } from 'react';

interface ChatwootWidgetProps {
  accountId: string;
  baseUrl?: string;
  position?: 'left' | 'right';
  primaryColor?: string;
  isOpen?: boolean;
}

declare global {
  interface Window {
    chatwootSDK: any;
  }
}

export function ChatwootWidget({
  accountId,
  baseUrl = 'https://app.chatwoot.com',
  position = 'right',
  primaryColor = '#1f93ff',
  isOpen = false
}: ChatwootWidgetProps) {
  useEffect(() => {
    // Carrega o script do Chatwoot
    const script = document.createElement('script');
    script.src = `${baseUrl}/packs/js/sdk.js`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.chatwootSDK.run({
        websiteToken: accountId,
        baseUrl: baseUrl,
        position: position,
        primaryColor: primaryColor,
        isOpen: isOpen
      });
    };

    return () => {
      // Limpa o script quando o componente é desmontado
      document.body.removeChild(script);
      if (window.chatwootSDK) {
        window.chatwootSDK.toggle();
      }
    };
  }, [accountId, baseUrl, position, primaryColor, isOpen]);

  return null;
} 