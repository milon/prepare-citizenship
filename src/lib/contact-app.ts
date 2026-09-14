export const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xppzvkby';

export function contactFormApp() {
  return {
    name: '',
    email: '',
    message: '',
    honeypot: '',
    sending: false,
    sent: false,
    error: false,

    async submit() {
      if (this.honeypot || this.sending) {
        return;
      }
      this.sending = true;
      this.error = false;
      try {
        const locale = document.documentElement.dataset.locale === 'fr' ? 'fr' : 'en';
        const response = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: this.name.trim(),
            email: this.email.trim(),
            message: this.message.trim(),
            locale,
            _gotcha: this.honeypot,
            _subject: 'Prepare Citizenship',
          }),
        });
        if (!response.ok) {
          throw new Error('Formspree rejected the message');
        }
        this.sent = true;
        this.name = '';
        this.email = '';
        this.message = '';
      } catch {
        this.error = true;
      } finally {
        this.sending = false;
      }
    },

    reset() {
      this.sent = false;
      this.error = false;
    },
  };
}
