
const express = require('express')
const app = express()
const axios = require('axios')
const cheerio = require('cheerio')

const urlBooksBase = 'https://books.toscrape.com/catalogue/category/books_1/'

app.get('/books/:page', (req, res) => {

    let pageID = req.params.page
    let url = ''

    if(pageID == '1') 
        url = url = urlBooksBase + 'index.html'
    else
        url = urlBooksBase + `page-${pageID}.html`


    axios(urlBooksBase)
    .then (res => {
        const html = res.data
        const dom = cheerio.load(html)
        return dom
    })
    .then (dom => {
        const books = []
        dom('.product_pod').each(function (index) {
            const titulo = dom(this).find('h3 a').text()
            const preco = dom(this).find('.product_price p.price_color').text()
            const estoque = dom(this).find('.product_price p.availability').text()

            books.push({titulo, preco, estoque}) 
            })
            return books
    })
    .then (books => {
        res.json(books)
        })
    .catch(err => {
            res.json ({
                message: `Erro na recuperacao dos dados: ${err.message}`
            })
        })
})

const port = process.env.PORT || 3000
app.listen (port , () => {
    console.log(`Servido rodando em http://localhost:${port}/books/1`)
})
