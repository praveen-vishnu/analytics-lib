import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackAnalyticsModule, TrackElementDirective } from 'track-analytics';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, TrackAnalyticsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  activeFilter = 'all';

  products = [
    {
      id: 1,
      name: 'Smartphone X',
      category: 'electronics',
      price: 799.99,
      image: 'https://via.placeholder.com/300x180?text=Smartphone'
    },
    {
      id: 2,
      name: 'Laptop Pro',
      category: 'electronics',
      price: 1299.99,
      image: 'https://via.placeholder.com/300x180?text=Laptop'
    },
    {
      id: 3,
      name: 'Casual T-Shirt',
      category: 'clothing',
      price: 24.99,
      image: 'https://via.placeholder.com/300x180?text=T-Shirt'
    },
    {
      id: 4,
      name: 'Jeans',
      category: 'clothing',
      price: 49.99,
      image: 'https://via.placeholder.com/300x180?text=Jeans'
    },
    {
      id: 5,
      name: 'Programming Guide',
      category: 'books',
      price: 39.99,
      image: 'https://via.placeholder.com/300x180?text=Programming+Book'
    },
    {
      id: 6,
      name: 'Novel',
      category: 'books',
      price: 19.99,
      image: 'https://via.placeholder.com/300x180?text=Novel'
    }
  ];

  get filteredProducts() {
    if (this.activeFilter === 'all') {
      return this.products;
    }

    return this.products.filter(product => product.category === this.activeFilter);
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
  }
}
