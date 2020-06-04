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

//CREATE a new comment associated with a post
router.post('/:id/comments', (req, res) => {
    //Check to see if the post exists
    Posts.findById(req.params.id)
        .then(post => {
            if (post) {
                if (req.body.text) {
                    //Prepare the comment object and send to the DB
                    Posts.insertComment({
                        text: req.body.text,
                        post_id: Number(req.params.id)
                    })
                        //Return the success code and newly created comment
                        .then(cId => {
                            Posts.findCommentById(cId.id)
                                .then(comment => {
                                    res.status(201).json(comment)
                                })
                        })
                }
                //Return error message Bad Request
                else res.status(400).json({ errorMessage: "Please provide text for the comment." })
            }
            //Return error message Not Found
            else res.status(404).json({ message: "The post with the specified ID does not exist." })

        })
        //Return server error message
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: "There was an error while saving the comment to the database" })
        })
})

//Return all the posts in the DB
router.get('/', (req, res) => {
    Posts.find()
        .then(posts => {
            //Return all posts in the DB
            res.status(200).json(posts)
        })
        //Return the server error message
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: "The posts information could not be retrieved." })
        })
})

//Return a post in the DB by the post id
router.get('/:id', (req, res) => {
    //Search the DB for a post matching the id
    Posts.findById(req.params.id)
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

//Return all the comments for a Post by post ID
router.get('/:id/comments', (req, res) => {
    //CHeck to see if the post exists in the DB
    Posts.findById(req.params.id)
        .then(post => {
            if (post) {
                Posts.findPostComments(req.params.id)
                    .then(comments => {
                        if (comments.length > 0) {
                            res.status(200).json(comments)
                        }
                        else res.status(500).json({ error: "The comments information could not be retrieved." })
                    })
            }
            //Return error message Not Found
            else res.status(404).json({ message: "The post with the specified ID does not exist." })
        })
        //Return the server error message
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: "The comments information could not be retrieved." })
        })



})

//Destroy a post in the DB by post id
router.delete('/:id', (req, res) => {

    Posts.findById(req.params.id)
        .then(post => {
            if (post) {
                Posts.remove(req.params.id)
                    .then(deleted => {
                        if (deleted) {
                            res.status(200).json(post)
                        }
                        //Return error message if user ID cannot be found
                        else res.status(404).json({ message: "The post with the specified ID does not exist." })
                    })
                    //Return server error message
                    .catch(err => {
                        console.log(err)
                        res.status(500).json({ error: "The post could not be removed" })
                    })
            }
            //Return error message if user ID cannot be found
            else res.status(404).json({ message: "The post with the specified ID does not exist." })
        })
        //Return server error message
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: "The post could not be removed" })
        })
})

//Modify a post in the DB by post id
router.put('/:id', (req, res) => {
    Posts.findById(req.params.id)
        .then(post => {
            if (post) {
                if (req.body.title && req.body.contents) {
                    Posts.update(req.params.id, req.body)
                        .then(update => {
                            if (update) {
                                Posts.findById(req.params.id)
                                    .then(post => {
                                        if (post) {
                                            //Return the post
                                            res.status(201).json(post)
                                        }
                                        //Return error message Not Found
                                        else res.status(404).json({ message: "The post with the specified ID does not exist." })
                                    })
                            }
                        })
                }
                //Return error message Bad Request
                else res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
            }
            //Return error message Not Found
            else res.status(404).json({ message: "The post with the specified ID does not exist." })
        })
        //Return server error message
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: "The post information could not be modified." })
        })
})

module.exports = router