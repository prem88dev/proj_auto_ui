import { Injectable } from '@angular/core';
import { Book } from '../models/book';
import { Routes, RouterModule } from '@angular/router';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private books : Book[];
  
  constructor(private newNavLoc : Location) {
    this.books=[
      {bookCode:101,title:'Let Us C',category:'Text Book',subject:'Computers', dateOfPublish:new Date('1996-02-11')},
      {bookCode:102,title:'Let Us C++',category:'Text Book',subject:'Computers', dateOfPublish:new Date('1996-03-11')},
      {bookCode:103,title:'Java - Head First',category:'Book',subject:'Computers', dateOfPublish:new Date('1996-04-11')},
      {bookCode:104,title:'Unfilled Dream',category:'Novel',subject:'Fiction', dateOfPublish:new Date('1996-05-11')},
      {bookCode:105,title:'HTML & CSS',category:'Text Book',subject:'Computer', dateOfPublish:new Date('1996-06-11')}
    ];
  }

  getAll():Book[]{
    return this.books;
  }

  getBookById(id:Number) {
    let index=this.books.findIndex((b)=>b.bookCode===id);
    if (index > -1) {
      return this.books.find((b)=>b.bookCode===id);
    } else {
      alert("No such book found !");
      this.newNavLoc.back();
    }
  }

  addBook(book:Book){
    let index=this.books.findIndex((b)=>b.bookCode===book.bookCode);
    if (index == -1) {
      this.books.push(book);
    } else {
      //reload page with book details that match the code and proceed to edit
    }
  }

  deleteBook(id:Number) {
    let index=this.books.findIndex((b)=>b.bookCode===id);
    if (index > -1) {
      this.books.splice(index,1);
    } else {
      alert("No such book found !");
      this.newNavLoc.back();
    }
  }

  updateBook(book:Book) {
    let index=this.books.findIndex((b)=>b.bookCode===book.bookCode);
    if (index > -1) {
      this.books[index]=book;
    } else {
      alert("No such book found !");
      this.newNavLoc.back();
    }
  }
}