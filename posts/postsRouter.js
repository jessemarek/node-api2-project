const router = require('express').Router()

const Posts = require('../data/db')


//CREATE a new post in the DB
router.post('/', (req, res) => {

    //Check the data being passed in for required properties
    if (req.body.title && req.body.contents) {
        //Add the data to the DB
        Posts.insert(req.body)
            //Return the newly created object along with status code
            .then(post => {
                //Retrieve the newly created post by the id
                Posts.findById(post.id)
                    .then(post => {
                        //Return the new post
                        res.status(201).json(post)
                    })
                    //Return server error message
                    .catch(err => {
                        console.log(err)
                        res.status(500).json({ error: "There was an error while saving the post to the database" })
                    })
            })
            //Return server error message
            .catch(err => {
                console.log(err)
                res.status(500).json({ error: "There was an error while saving the post to the database" })
            })
    }
    //Return error message
    else res.status(400).json({ errorMessage: "Please provide title and contents for the post." })

})

//Return all the posts in the DB
router.get('/', (req, res) => {
    Posts.find()
        .then(posts => {
            res.status(200).json(posts)
        })
})

//Return a post in the DB by the post id
router.get('/:id', (req, res) => {
    //Search the DB for a post matching the id
    Posts.findById(Number(req.params.id))
        .then(post => {
            if (post) {
                //Return the post
                res.status(201).json(post)
            }
            //Return error message Not Found
            else res.status(404).json({ message: "The post with the specified ID does not exist." })
        })
        //Return server error message
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: "The post information could not be retrieved." })
        })
})

//Destroy a post in the DB by post id
router.delete('/:id', (req, res) => {

})

//Modify a post in the DB by post id
router.put('/:id', (req, res) => {

})

module.exports = router