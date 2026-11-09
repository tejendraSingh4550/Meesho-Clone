import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Product {
  name: string;
  price: number;
  oldPrice: number;
  rating: string;
  reviews: string;
  image: string;
  badge?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="top-strip"><span>✨ India's favourite online shopping destination</span><span>Free delivery on your first order <b>→</b></span></div>
    <header class="site-header">
      <a class="brand" href="#home" aria-label="meesho home">meesho<span>.</span></a>
      <div class="search-wrap"><span class="search-icon">⌕</span><input aria-label="Search products" placeholder="Try Saree, Kurti or Search by Product Code" [value]="query" (input)="onSearch($event)"><kbd>⌘ K</kbd></div>
      <div class="header-actions">
        <button class="download-link"><span class="line-icon">▣</span><span>Download App</span></button>
        <button class="nav-action"><span class="line-icon">♙</span><span>Profile</span></button>
        <button class="nav-action bag-action" (click)="cartOpen = !cartOpen"><span class="line-icon">♧</span><span>Cart</span><i *ngIf="cartCount">{{ cartCount }}</i></button>
      </div>
      <div class="cart-popover" *ngIf="cartOpen"><span class="cart-icon">♧</span><strong>{{ cartCount ? cartCount + ' lovely find' + (cartCount > 1 ? 's' : '') + ' in your bag' : 'Your bag is waiting' }}</strong><small>{{ cartCount ? 'You have great taste.' : 'Add something you love to get started.' }}</small></div>
    </header>
    <nav class="category-nav" aria-label="Product categories">
      <a *ngFor="let item of categories" href="#products" [class.active]="activeCategory === item" (click)="selectCategory(item, $event)">{{ item }}</a>
    </nav>

    <main id="home">
      <section class="hero">
        <div class="hero-copy"><div class="eyebrow"><span></span> THE EVERYDAY EDIT</div><h1>Good finds.<br><em>Great prices.</em></h1><p>Your next favourite thing is just a scroll away.</p><a class="shop-button" href="#products">Shop the collection <span>↗</span></a><div class="hero-trust"><div class="avatar-stack"><b>R</b><b>A</b><b>S</b></div><span>Loved by <strong>10 crore+</strong> shoppers</span></div></div>
        <div class="hero-art"><div class="sun-disc"></div><img class="hero-img" src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85" alt="Woman wearing a colourful traditional outfit"><div class="float-note"><span>✦</span><div><b>Style starts here</b><small>and it starts at ₹199</small></div></div><div class="hero-sparkle">✳</div></div>
        <div class="hero-index">01 <span>/</span> 03</div>
      </section>

      <section class="benefits"><div><span class="benefit-icon">♡</span><span><b>Prices you'll love</b><small>Everyday low prices</small></span></div><i></i><div><span class="benefit-icon">⌁</span><span><b>Cash on delivery</b><small>Pay when it arrives</small></span></div><i></i><div><span class="benefit-icon">↺</span><span><b>Easy returns</b><small>Hassle-free shopping</small></span></div><i></i><div><span class="benefit-icon">✧</span><span><b>Made for everyone</b><small>Find your kind of style</small></span></div></section>

      <section class="category-section"><div class="section-heading"><div><span class="eyebrow">A LITTLE SOMETHING FOR EVERYONE</span><h2>What are you in the mood for?</h2></div><a href="#products">Explore all categories <span>→</span></a></div><div class="category-cards"><button class="category-card" *ngFor="let category of categoryTiles; let i = index" (click)="selectTile(category.name)" [class.chosen]="activeCategory === category.name"><div class="category-photo" [style.background-image]="'url(' + category.image + ')' "><span class="category-number">0{{ i + 1 }}</span></div><span class="category-label">{{ category.name }} <b>↗</b></span></button></div></section>

      <section class="product-section" id="products"><div class="section-heading product-heading"><div><span class="eyebrow">PICKED FOR YOU</span><h2>{{ query ? 'Search results' : 'Little things, big joy.' }}</h2></div><div class="filter-chips"><button [class.selected]="activeCategory === 'All'" (click)="selectCategory('All')">For you</button><button [class.selected]="activeCategory === 'New In'" (click)="selectCategory('New In')">New in <span class="new-dot"></span></button><button (click)="sortPopular()">Most loved <span>⌄</span></button></div></div>
        <div class="product-grid"><article class="product-card" *ngFor="let product of visibleProducts"><button class="heart" aria-label="Save to wishlist" (click)="toggleSaved(product)">{{ isSaved(product) ? '♥' : '♡' }}</button><div class="product-image"><img [src]="product.image" [alt]="product.name" loading="lazy"><span *ngIf="product.badge" class="product-badge">{{ product.badge }}</span><button class="quick-add" (click)="addToCart()">+ Quick add</button></div><div class="product-info"><p>{{ product.name }}</p><div class="price-line"><strong>₹{{ product.price }}</strong><del>₹{{ product.oldPrice }}</del><span>{{ discount(product) }}% off</span></div><div class="rating-line"><span class="rating">{{ product.rating }} ★</span><span>{{ product.reviews }} reviews</span><button (click)="addToCart()">＋</button></div></div></article></div>
        <div class="empty-state" *ngIf="visibleProducts.length === 0"><span>⌕</span><b>No finds just yet</b><small>Try another search and we'll keep looking.</small></div>
      </section>
      <section class="bottom-note"><span>Made with a little <b>♡</b> for you</span><span>Scroll less. Smile more.</span></section>
    </main>
    <div class="toast" *ngIf="toast">{{ toast }} <span>♡</span></div>
  `
})
export class AppComponent {
  query = '';
  cartCount = 0;
  cartOpen = false;
  toast = '';
  activeCategory = 'All';
  saved = new Set<string>();
  categories = ['All', 'Women', 'Men', 'Kids', 'Home & Kitchen', 'Beauty', 'Jewellery', 'Footwear', 'Bags & Accessories'];
  categoryTiles = [
    { name: 'Ethnic wear', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=500&q=80' },
    { name: 'Western wear', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=500&q=80' },
    { name: 'Home & living', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=500&q=80' },
    { name: 'Beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=500&q=80' },
    { name: 'Accessories', image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=500&q=80' }
  ];
  products: Product[] = [
    { name: 'Floral printed cotton kurta set', price: 499, oldPrice: 1299, rating: '4.7', reviews: '2.4k', badge: 'BESTSELLER', image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=600&q=80' },
    { name: 'Everyday mini shoulder bag', price: 299, oldPrice: 799, rating: '4.5', reviews: '896', badge: 'JUST IN', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80' },
    { name: 'Handcrafted ceramic coffee mug', price: 189, oldPrice: 499, rating: '4.8', reviews: '1.2k', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=600&q=80' },
    { name: 'Minimal gold-tone daily hoops', price: 149, oldPrice: 399, rating: '4.6', reviews: '3.1k', badge: 'TRENDING', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80' },
    { name: 'Soft cotton printed bedsheet', price: 399, oldPrice: 999, rating: '4.4', reviews: '742', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80' },
    { name: 'Classic white everyday sneakers', price: 599, oldPrice: 1499, rating: '4.5', reviews: '1.8k', badge: 'POPULAR', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80' },
    { name: 'Tinted lip balm set of 3', price: 219, oldPrice: 599, rating: '4.7', reviews: '5.2k', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80' },
    { name: 'Textured everyday tote bag', price: 349, oldPrice: 899, rating: '4.6', reviews: '1.1k', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80' }
  ];
  visibleProducts = [...this.products];
  onSearch(event: Event): void {
    this.query = (event.target as HTMLInputElement).value;
    const term = this.query.toLowerCase().trim();
    this.visibleProducts = this.products.filter(product => product.name.toLowerCase().includes(term));
  }
  selectCategory(category: string, event?: Event): void {
    event?.preventDefault();
    this.activeCategory = category;
    if (category === 'All' || category === 'New In' || category === 'Women') this.visibleProducts = this.query ? this.products.filter(p => p.name.toLowerCase().includes(this.query.toLowerCase())) : [...this.products];
    else {
      const term = category.toLowerCase().replace(' wear', '').replace(' & living', '').replace(' & kitchen', '');
      this.visibleProducts = this.products.filter(p => p.name.toLowerCase().includes(term) || (category === 'Ethnic wear' && p.name.includes('kurta')) || (category === 'Accessories' && (p.name.includes('bag') || p.name.includes('hoops'))));
    }
  }
  selectTile(category: string): void { this.selectCategory(category); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); }
  addToCart(): void { this.cartCount++; this.cartOpen = false; this.toast = 'Added to your bag'; setTimeout(() => this.toast = '', 2200); }
  toggleSaved(product: Product): void { this.saved.has(product.name) ? this.saved.delete(product.name) : this.saved.add(product.name); this.saved = new Set(this.saved); }
  isSaved(product: Product): boolean { return this.saved.has(product.name); }
  discount(product: Product): number { return Math.round((1 - product.price / product.oldPrice) * 100); }
  sortPopular(): void { this.visibleProducts = [...this.visibleProducts].sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating)); }
}

bootstrapApplication(AppComponent).catch(error => console.error(error));
