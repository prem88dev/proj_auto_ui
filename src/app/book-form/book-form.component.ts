import { Component, OnInit } from '@angular/core';
import { Book } from '../models/book';
import { BookService } from '../services/book.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit {

  private maxId : Number = 0;
  private allBooks : Book[];
  private bookPubDate : string;
  private bookById = new Book();
  private addBtnShow : boolean;

  pipe = new DatePipe('en-US');

  constructor(private bserv : BookService, private route : ActivatedRoute) { 
  }

  ngOnInit() {
    const bookId = +this.route.snapshot.paramMap.get('id');
    
    if (bookId) {
      this.bookById = this.bserv.getBookById(bookId);
      this.bookPubDate = this.pipe.transform(this.bookById.dateOfPublish, "mm/dd/yyyy");
      console.log(this.bookPubDate);
      this.addBtnShow = false;
    } else {
      this.addBtnShow = true;

      // since we have to add, we are not allowing the user to input text book id
      // get the max value from Book array and add one to it to get the new id
      this.allBooks = this.bserv.getAll();
      console.log(this.allBooks);
      
      for (var index = 0; index < this.allBooks.length; index++) {
        if (this.allBooks[index].bookCode > this.maxId) {
          if (this.maxId < this.allBooks[index].bookCode) {
            this.maxId = this.allBooks[index].bookCode.valueOf();
            this.maxId = this.maxId.valueOf() + 1;
          }
        }
      }
    }
  }

  add() {
    this.bookById.bookCode = this.maxId;
    this.bookById.title = (document.getElementById("bookTitle") as HTMLInputElement).value;
    this.bookById.category = (document.getElementById("bookCatg") as HTMLInputElement).value;
    this.bookById.subject = (document.getElementById("bookSub") as HTMLInputElement).value;
    this.bookById.dateOfPublish = new Date((document.getElementById("bookPub") as HTMLInputElement).value);
    this.bserv.addBook(this.bookById);
    this.maxId = this.maxId.valueOf() + 1;
  }
}