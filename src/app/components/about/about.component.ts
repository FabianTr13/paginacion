import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html'
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
}

//   const { Pool, Client } = require('pg');
//
// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'refugio',
//   password: 'fabian',
//   port: 5432,
// })
//
// pool.query('SELECT NOW()', (err, res) => {
//   console.log(err, res)
//   pool.end()
// })
