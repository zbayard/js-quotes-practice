const quoteList = document.querySelector("#quote-list")
const newQuoteForm = document.querySelector("#new-quote-form")

// *****RENDER FUNCTION*****

function renderQuote(quoteObj) {

    const quoteCard = document.createElement("li")
    quoteCard.id = "quote-card"
    

    quoteCard.innerHTML = `
    
    <blockquote class="blockquote">
    <p class="mb-0">${quoteObj.quote}</p>
    <footer class="blockquote-footer">${quoteObj.author}</footer>
    <br>
    <button class='btn-success'>Likes: <span>${quoteObj.likes.length}</span></button>
    <button class='btn-danger'>Delete</button>
    <button class='btn-update'>Edit</button>
    </blockquote>`
    quoteList.append(quoteCard)
   
    // *****BUTTON EVENT LISTENER*****

    quoteCard.addEventListener("click", function(event){
        if(event.target.matches(".btn-success")){
            likeAQuote(quoteObj)
        } 
        if(event.target.matches(".btn-danger")){
            deleteQuote(quoteObj)
            quoteCard.remove()
        }
        if(event.target.matches(".btn-update")){


            updateQuote(quoteObj)
        }
    })
    

    // *****HELPER FUNCTIONS*****

    function deleteQuote(quoteObj){
        fetch(`http://localhost:3000/quotes/${quoteObj.id}`, {
        method: 'DELETE',
    })
    }

    function likeAQuote(quoteObj) {
        const likeCount = quoteCard.querySelector("span")
        likeCount.innerHTML = quoteObj.likes.length += 1

        fetch('http://localhost:3000/likes', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            likes: quoteObj.likes.length,
            quoteId: quoteObj.id
        }),
        })
        .then(response => response.json())
        .then(data => {

        console.log('Success:', data);
        })

    }
    

    function updateQuote(quoteObj){

        const updateForm = document.createElement("form")
        updateForm.id = "update-form"

        updateForm.innerHTML = `<div class="form-group">
                                    <label for="new-quote">Update Quote</label>
                                    <input name="quote" type="text" class="form-control" id="new-quote" placeholder=${quoteObj.quote}>
                                </div>
                                <div class="form-group">
                                    <label for="Author">Update Author</label>
                                    <input name="author" type="text" class="form-control" id="author" placeholder=${quoteObj.author}>
                                </div>
                                <button type="update" class="btn btn-primary">Update</button>`

        quoteCard.append(updateForm)

        updateForm.addEventListener("submit", event =>{
            event.preventDefault()
        
            const updateQuote = event.target.quote.value
            const updateAuthor = event.target.author.value

            const updateAll = {
                quote: updateQuote,
                author: updateAuthor
            }
            updateForm.reset()
            
            fetch(`http://localhost:3000/quotes/${quoteObj.id}`, {
                method: 'PATCH',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                updateAll
                ),
                })
                .then(response => response.json())
                .then(data => {
                   data.likes = quoteObj.likes
                   quoteCard.innerHTML = `<blockquote class="blockquote">
                   <p class="mb-0">${data.quote}</p>
                   <footer class="blockquote-footer">${data.author}</footer>
                   <br>
                   <button class='btn-success'>Likes: <span>${data.likes.length}</span></button>
                   <button class='btn-danger'>Delete</button>
                   <button class='btn-update'>Edit</button>
                   </blockquote>`
                
            })
               
                
                updateForm.remove()

        })


        
    }

}


// *******CREATE A NEW QUOTE********
newQuoteForm.addEventListener("submit", event => {
    event.preventDefault()

    const newQuote = event.target.quote.value
    const newAuthor = event.target.author.value
    


    fetch('http://localhost:3000/quotes?_embed=likes', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            quote: newQuote,
            author: newAuthor
             
        }),
        })
        .then(response => response.json())
        .then(data => {
            data.likes = []
        renderQuote(data);
        })
})



// *****INITIAL GET FETCH*****

fetch("http://localhost:3000/quotes?_embed=likes")
.then(response => response.json())
.then(quotes => quotes.forEach(quote => {
    renderQuote(quote)
}))


