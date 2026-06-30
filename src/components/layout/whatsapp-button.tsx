import { MessageCircle } from "lucide-react"

const phone = "541152203679"
const msg = encodeURIComponent("Hola! Quiero hacer un pedido")
const href = `https://wa.me/${phone}?text=${msg}`

export function WhatsAppButton() {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-all hover:bg-green-600 hover:scale-110 active:scale-95"
      aria-label="Chatear por WhatsApp"
    >
      <MessageCircle className="size-7" />
    </a>
  )
}
