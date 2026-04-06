import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Product } from './product';
import { ProductList } from "./product/product-list/product-list";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProductList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('mi-app-modS');

  products: Product[] = [
    {
      productId: 1,
      productName: 'Laptop Pro 15',
      productCode: 'LP15-001',
      releaseDate: '2024-01-15',
      description: 'Laptop de alto rendimiento con pantalla de 15 pulgadas.',
      price: 499500,
      starRating: 4.5,
      imageUrl: 'laptop1.jpg'
    },
    {
      productId: 2,
      productName: 'Smartphone X20',
      productCode: 'SMX20-002',
      releaseDate: '2024-03-01',
      description: 'Teléfono inteligente con cámara triple y batería de larga duración.',
      price: 259900,
      starRating: 4.7,
      imageUrl: 'smartphone.jpg'
    },
    {
      productId: 3,
      productName: 'Tablet Ultra 11',
      productCode: 'TU11-003',
      releaseDate: '2024-05-10',
      description: 'Tablet ligera con pantalla de 11 pulgadas y lápiz táctil incluido.',
      price: 189900,
      starRating: 4.4,
      imageUrl: 'tablet.jpg'
    },
    {
      productId: 4,
      productName: 'Auriculares Inalámbricos AirBeat',
      productCode: 'ABI-004',
      releaseDate: '2024-02-20',
      description: 'Auriculares Bluetooth con cancelación de ruido y sonido envolvente.',
      price: 79900,
      starRating: 4.6,
      imageUrl: 'auriculares.jpg'
    },
    {
      productId: 5,
      productName: 'Smartwatch Active',
      productCode: 'SWA-005',
      releaseDate: '2024-04-05',
      description: 'Reloj inteligente con monitoreo de salud y notificaciones en tiempo real.',
      price: 129900,
      starRating: 4.3,
      imageUrl: 'smartwatch.jpg'
    },
    {
      productId: 6,
      productName: 'Monitor 27" 4K',
      productCode: 'MN27-006',
      releaseDate: '2024-06-15',
      description: 'Monitor 4K de 27 pulgadas ideal para diseño y entretenimiento.',
      price: 344900,
      starRating: 4.8,
      imageUrl: 'monitor.jpg'
    }
  ]
}

