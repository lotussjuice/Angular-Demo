import { Component } from "@angular/core";
import { ScrollingModule } from "@angular/cdk/scrolling";

@Component({
  selector: "app-number",
  imports: [ScrollingModule],
  templateUrl: "./number.html",
  styleUrl: "./number.css",
})

export class Number {
  numeros = Array(1000).fill(0);
}
  