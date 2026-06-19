import { Component } from "@angular/core";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { faker } from "@faker-js/faker";

@Component({
  selector: "app-user",
  imports: [ScrollingModule],
  templateUrl: "./user.html",
  styleUrl: "./user.css",
})
export class User {
  data;

  constructor(){
    this.data = Array(10000)
      .fill(1)
      .map(_ => {
        return {
          name : faker.person.fullName(),
          email : faker.internet.email(),
          phone : faker.phone.number(),
          avatar : faker.image.avatar()
        }
      })
  }
}
