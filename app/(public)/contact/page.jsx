import { HiOutlineMail, HiOutlineLocationMarker, HiOutlinePhone, HiOutlineChatAlt2 } from "react-icons/hi";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-charcoal-50 dark:bg-charcoal-900 pb-20 pt-24 md:pt-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-start">
          
          {/* Left: Contact Narrative */}
          <div className="space-y-12">
            <div className="space-y-6">
              <p className="text-gold-600 font-extrabold text-[10px] uppercase tracking-[0.4em]">Inquiries</p>
              <h1 className="font-heading text-5xl md:text-7xl font-bold text-ink dark:text-cream-50 leading-tight tracking-tighter">
                Let's start a <span className="text-gold-500 italic font-serif">conversation.</span>
              </h1>
              <p className="text-charcoal-500 dark:text-charcoal-400 text-lg leading-relaxed max-w-lg">
                Whether you have a question about a specific masterpiece, commission requests, or logistics, our curators are standing by to assist you.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 pt-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gold-600">
                  <HiOutlineChatAlt2 className="w-5 h-5" />
                  <span className="text-[10px] font-extrabold uppercase tracking-widest">Inquiries</span>
                </div>
                <p className="text-ink dark:text-cream-100 font-bold">curator@artisan.com</p>
                <p className="text-sm text-charcoal-400">Response within 24 hours.</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gold-600">
                  <HiOutlineLocationMarker className="w-5 h-5" />
                  <span className="text-[10px] font-extrabold uppercase tracking-widest">Atelier</span>
                </div>
                <p className="text-ink dark:text-cream-100 font-bold">Ganga Mahal, Manikarnika Ghat</p>
                <p className="text-sm text-charcoal-400">Varanasi, UP 221001, India</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gold-600">
                  <HiOutlinePhone className="w-5 h-5" />
                  <span className="text-[10px] font-extrabold uppercase tracking-widest">Phone</span>
                </div>
                <p className="text-ink dark:text-cream-100 font-bold">+91 542 223 4455</p>
                <p className="text-sm text-charcoal-400">Mon-Sat, 10am - 6pm IST</p>
              </div>
            </div>
          </div>

          {/* Right: Premium Form */}
          <div className="bg-white dark:bg-charcoal-800 p-8 md:p-12 rounded-[2.5rem] shadow-huge border border-charcoal-100 dark:border-charcoal-700">
            <h3 className="font-heading text-2xl font-bold text-ink dark:text-cream-50 mb-8">Send a Secure Inquiry</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-charcoal-400 pl-1">Full Name</label>
                  <input type="text" className="w-full bg-charcoal-50 dark:bg-charcoal-900 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-gold-500/20 dark:text-cream-100 outline-none transition-all placeholder:text-charcoal-300" placeholder="Collector Name" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-charcoal-400 pl-1">Email Address</label>
                  <input type="email" className="w-full bg-charcoal-50 dark:bg-charcoal-900 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-gold-500/20 dark:text-cream-100 outline-none transition-all placeholder:text-charcoal-300" placeholder="email@address.com" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-charcoal-400 pl-1">Subject</label>
                <select className="w-full bg-charcoal-50 dark:bg-charcoal-900 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-gold-500/20 dark:text-cream-100 outline-none transition-all">
                  <option>Artwork Inquiry</option>
                  <option>Commission Request</option>
                  <option>Shipping & Logistics</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-charcoal-400 pl-1">Your Narrative</label>
                <textarea rows="5" className="w-full bg-charcoal-50 dark:bg-charcoal-900 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-gold-500/20 dark:text-cream-100 outline-none transition-all placeholder:text-charcoal-300" placeholder="How can our curators assist you?"></textarea>
              </div>

              <button type="submit" className="w-full py-4 bg-ink dark:bg-cream-50 text-white dark:text-ink rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-gold-600 dark:hover:bg-gold-500 dark:hover:text-white transition-all shadow-xl shadow-ink/10">
                Seal and Send
              </button>
            </form>
          </div>

        </div>

        {/* Map Placeholder / Elite Texture */}
        <div className="mt-32 rounded-[3rem] overflow-hidden h-96 relative bg-charcoal-200 dark:bg-charcoal-800">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center grayscale opacity-30"></div>
          <div className="absolute inset-0 bg-ink/10"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="bg-white/90 dark:bg-charcoal-900/90 backdrop-blur-md px-8 py-4 rounded-full border border-white/20 shadow-huge">
                <p className="text-ink dark:text-cream-50 font-bold flex items-center gap-2">
                   <HiOutlineLocationMarker className="w-5 h-5 text-gold-600" />
                   Manikarnika Ghat, Varanasi
                </p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
