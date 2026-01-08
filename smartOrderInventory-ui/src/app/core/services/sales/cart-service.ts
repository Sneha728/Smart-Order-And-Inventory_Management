import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CartService {
  private key = 'sales_cart';

  get(): any[] {
    try {
      return JSON.parse(localStorage.getItem(this.key) || '[]');
    } catch {
      return [];
    }
  }

  save(items: any[]) {
    localStorage.setItem(this.key, JSON.stringify(items));
  }

  add(item: any) {
    const cart = this.get();
    const found = cart.find(i => i.productId === item.productId);
    found ? found.quantity += item.quantity : cart.push(item);
    this.save(cart);
  }

  update(id: number, qty: number) {
    const cart = this.get();
    const item = cart.find(i => i.productId === id);
    if (item && qty > 0) item.quantity = qty;
    this.save(cart);
  }

  remove(id: number) {
    this.save(this.get().filter(i => i.productId !== id));
  }

  clear() {
    localStorage.removeItem(this.key);
  }
}
