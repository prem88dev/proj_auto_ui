import { Component, OnInit } from '@angular/core';
import { Book } from '../models/book';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-list-books',
  templateUrl: './list-books.component.html',
  styleUrls: ['./list-books.component.css']
})
export class ListBooksComponent implements OnInit {

  private books:Book[];

  constructor(private bserv : BookService) { }

  ngOnInit() {
    console.log("list book on init");
    this.books = this.bserv.getAll();
  }
  
}
