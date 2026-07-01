import { Component, inject, output, EventEmitter, Output} from "@angular/core";
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl } from "@angular/forms";
import { ProductService } from "../../../services/product";
import { Product } from "../../../interfaces/product";
import { map, Observable, catchError, of } from "rxjs";

@Component({
  selector: "app-modal-add",
  imports: [ReactiveFormsModule],
  templateUrl: "./modal-add.html",
  styleUrl: "./modal-add.css",
})
export class ModalAdd {

  close = output<void>();
  @Output() save = new EventEmitter<Product>();
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);

  formProduct = this.fb.group({
    productName: ['', Validators.required],
    productCode: ['', [Validators.required, Validators.minLength(7), this.codeValidator()]],
    releaseDate: ['', Validators.required],
    price: [0, Validators.required],
    description: ['', Validators.required],
    starRating: [0, [Validators.required, Validators.min(0), Validators.max(200)]],
    imageUrl: [''],
  });

  saveData(){
    if (this.formProduct.valid) {
      const product: Product = {
        productId: 0,
        productName: this.formProduct.value.productName || '',
        productCode: this.formProduct.value.productCode || '',
        releaseDate: this.formProduct.value.releaseDate || '',
        price: this.formProduct.value.price || 0,
        description: this.formProduct.value.description || '',
        starRating: this.formProduct.value.starRating || 0,
        imageUrl: this.formProduct.value.imageUrl || '',
      };
      this.productService.saveProduct(product).subscribe({
        next: () => {
          this.save.emit(product);
          this.ocultarModal();
        },
        error: (err) => console.error('Error al guardar:', err)
      });
    }
  }

  ocultarModal(): void{
    this.close.emit();
  }

  codeValidator(){
    return (control: AbstractControl): Observable<{ [key: string]: any } | null > => {
      let code = control.value;
      if (!code || code.length < 7) {
        return of(null);
      }
      return this.productService.searchProduct(code)
        .pipe(
          map(res => {
            if(res){
              return { codeExists: true};
            }
            return null;
          }),
          catchError(() => of(null))
        )
    }
  }
}
