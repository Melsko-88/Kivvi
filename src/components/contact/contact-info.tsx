import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants'

export function ContactInfo() {
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent('Bonjour KIVVI ! Je souhaite discuter d\'un projet.')}`

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-xl">
        <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold mb-5">Nos coordonnées</h3>
        <ul className="space-y-4">
          <li>
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground/60 mb-0.5">Email</p>
                <p>{SITE_CONFIG.email}</p>
              </div>
            </a>
          </li>
          <li>
            <a
              href={`tel:${SITE_CONFIG.phone.replace(/\s/g, '')}`}
              className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground/60 mb-0.5">Téléphone</p>
                <p>{SITE_CONFIG.phone}</p>
              </div>
            </a>
          </li>
          <li>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#25D366]/10 text-[#25D366]">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground/60 mb-0.5">WhatsApp</p>
                <p>Discuter maintenant</p>
              </div>
            </a>
          </li>
        </ul>
      </div>

      <div className="glass-card p-6 rounded-xl">
        <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold mb-5">Nos bureaux</h3>
        <ul className="space-y-4">
          <li className="flex items-start gap-3 text-sm text-muted-foreground">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-foreground">{SITE_CONFIG.location}</p>
              <p>Siège social</p>
            </div>
          </li>
          <li className="flex items-start gap-3 text-sm text-muted-foreground">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-foreground">{SITE_CONFIG.locationSecondary}</p>
              <p>Bureau régional</p>
            </div>
          </li>
        </ul>
      </div>

      <div className="glass-card p-6 rounded-xl text-center">
        <p className="text-sm text-muted-foreground">
          Nous répondons généralement sous <span className="text-foreground font-medium">24 heures</span>.
        </p>
      </div>
    </div>
  )
}
