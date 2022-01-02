import Movie from '../model/movieModel.js'

exports.postMovie=async (req,res)=>{
    const movie= new Movie({
        title:req.body.title,
        description:req.body.description,
        year:req.body.year,
        duration:req.body.duration,
        genre:req.body.genre,
        rating:req.body.rating,
        owner:req.user._id
    }) 
    try {
        const detail = await movie.save();


        res.send({
            message: 'movie saved successful',
            data: detail
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
}
exports.getMovie = async (req, res) => {
    const movie = await Movie.find({owner:req.user._id}).then((movie) => {
        res.send({
            message:'movies found are:',
            movie
        })
    })
}
exports.getOneMovie = async (req, res,next) => {
    try {
        const movie = await Movie.findOne({ _id: req.params.id, owner: req.user._id })
        if (!movie) {
            res.status(404).send('no movie found ')
        } 
        res.send({
            message:'movie found is:',
            movie
        })
    } catch (error) {
        res.status(500).send(error.message); 
    }
}
exports.deleteMovie = async (req, res) => {
    try {
        const movie = await Movie.findOne({ _id: req.params.id, owner: req.user._id })
        if (!movie) {
            res.send('movie not found')
        }
     
        await Movie.deleteOne({ _id: req.params.id, owner: req.user._id })
        res.send({
            message: " movie deleted successful",
            movie: movie
        })
    } catch (error) {
        res.status(404).send(error.message)
    }
}

exports.updateMovie = async (req, res) => {
    const movie = new Movie({
        _id: req.params.id,
        title:req.body.title,
        description:req.body.description,
        year:req.body.year,
        duration:req.body.duration,
        genre:req.body.genre,
        rating:req.body.rating,
    })

  Movie.updateOne({ _id: req.params.id }, movie).then(() => {
            res.status(201).send({
                message: 'movie updated successfully',
                movie,
            });
        }).catch((error) => {
            res.status(400).json({
                error: error,
                
            });
        })
    }
