import Link from "next/link";
import { RiInstagramLine, RiFacebookCircleLine, RiTwitterXLine, RiPinterestLine } from "react-icons/ri";

export default function Footer() {
  return (
    <footer className="bg-charcoal-900 text-cream-100 pt-20 pb-10 border-t border-charcoal-800">
      <div className="container-custom grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 pb-16 border-b border-charcoal-800/50">
        
        {/* Brand Section */}
        <div className="space-y-6">
          <Link href="/" className="inline-block">
            <h3 className="font-heading text-3xl font-bold tracking-tight text-white">ARTISAN</h3>
            <span className="block text-[8px] uppercase tracking-[0.4em] text-gold-500 mt-1">Fine Art Gallery</span>
          </Link>
          <p className="text-sm text-charcoal-400 leading-relaxed font-body max-w-xs">
            Curating rare and original soul-stirring artwork since 1994. We believe every wall deserves a story told through the hands of a master.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-charcoal-800 rounded-full hover:text-gold-400 hover:bg-charcoal-700 transition-all"><RiInstagramLine className="w-5 h-5" /></a>
            <a href="#" className="p-2 bg-charcoal-800 rounded-full hover:text-gold-400 hover:bg-charcoal-700 transition-all"><RiTwitterXLine className="w-5 h-5" /></a>
            <a href="#" className="p-2 bg-charcoal-800 rounded-full hover:text-gold-400 hover:bg-charcoal-700 transition-all"><RiFacebookCircleLine className="w-5 h-5" /></a>
            <a href="#" className="p-2 bg-charcoal-800 rounded-full hover:text-gold-400 hover:bg-charcoal-700 transition-all"><RiPinterestLine className="w-5 h-5" /></a>
          </div>
        </div>

        {/* Collections */}
        <div>
          <h4 className="font-heading text-sm font-bold uppercase tracking-widest mb-8 text-gold-500">Collections</h4>
          <ul className="space-y-4 text-xs font-bold text-charcoal-400 font-body uppercase tracking-wider">
            <li><Link href="/category/oil-paintings" className="hover:text-white transition-colors">Oil Paintings</Link></li>
            <li><Link href="/category/sketches" className="hover:text-white transition-colors">Pencil Sketches</Link></li>
            <li><Link href="/category/watercolor" className="hover:text-white transition-colors">Watercolor</Link></li>
            <li><Link href="/category/abstract" className="hover:text-white transition-colors">Abstract</Link></li>
            <li><Link href="/shop" className="hover:text-white transition-colors">View All Curations</Link></li>
          </ul>
        </div>

        {/* Experience */}
        <div>
          <h4 className="font-heading text-sm font-bold uppercase tracking-widest mb-8 text-gold-500">Experience</h4>
          <ul className="space-y-4 text-xs font-bold text-charcoal-400 font-body uppercase tracking-wider">
            <li><Link href="/about" className="hover:text-white transition-colors">About the Gallery</Link></li>
            <li><Link href="/shop" className="hover:text-white transition-colors">Exhibitions</Link></li>
            <li><Link href="/login" className="hover:text-white transition-colors">Member Access</Link></li>
            <li><Link href="/wishlist" className="hover:text-white transition-colors">Member Wishlist</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Private Viewing</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
           <h4 className="font-heading text-sm font-bold uppercase tracking-widest mb-8 text-gold-500">Informed Choice</h4>
           <p className="text-sm text-charcoal-400 mb-6 font-body leading-relaxed">Join our inner circle for early access to new collections and artist stories.</p>
           <div className="space-y-3">
             <input 
               type="email" 
               placeholder="Your curated email" 
               className="bg-charcoal-800/50 border border-charcoal-700 rounded-md px-5 py-3 text-xs w-full focus:outline-none focus:ring-1 focus:ring-gold-500 text-cream-50 transition-all font-body" 
             />
             <button className="w-full bg-gold-500 hover:bg-gold-600 text-ink py-3 rounded-md text-[10px] uppercase font-black tracking-[0.2em] transition-all duration-300">
               Subscribe
             </button>
           </div>
        </div>
      </div>
      
      <div className="container-custom pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] uppercase tracking-[0.3em] text-charcoal-500 font-body font-bold">
        <p>© 2024 Artisan Original Gallery. Crafted for Collectors.</p>
        <div className="flex gap-8">
          <Link href="#" className="hover:text-white transition-colors">Terms of Sale</Link>
          <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-white transition-colors">Authenticity</Link>
        </div>
      </div>
    </footer>
  );
}
