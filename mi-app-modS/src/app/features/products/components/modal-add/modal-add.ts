import { Component, inject, output} from "@angular/core";
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl } from "@angular/forms";
import { ProductService } from "../../services/product";
import { map, Observable } from "rxjs";

@Component({
  selector: "app-modal-add",
  imports: [ReactiveFormsModule],
  templateUrl: "./modal-add.html",
  styleUrl: "./modal-add.css",
})
export class ModalAdd {

  close = output<void>();
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);

  formProduct = this.fb.group({
    name: ['', Validators.required],
    code: ['', [Validators.required, Validators.minLength(7), this.codeValidator()]],
    date: ['', Validators.required],
    price: [0, Validators.required],
    description: ['', Validators.required],
    rating: [0, [Validators.required, Validators.min(0), Validators.max(200)]],
  });

  saveData(){
    console.log('Guardando producto: ', this.formProduct.value);
  }

  ocultarModal(): void{
    this.close.emit();
  }

  codeValidator(){
    return (control: AbstractControl): Observable<{ [key: string]: any } | null > => {
      let code = control.value;
      console.log('cliente - code: ', code);
      return this.productService.searchProduct(code)
        .pipe(map(res => {
          if(res){
            console.log('Codigo encontrado: ', res);
            return { codeExists: true};
          }

          console.log('Codigo no encontrado');
          return null;
        }))
    }
  }
}
