const News = require("../models/News");
const { errorHandler } = require('../auth');

module.exports.addNews = (req, res) => {

    let newNews = new News({
        name : req.body.name,
        description : req.body.description,
        isActive: req.body.isActive
    });

    News.findOne({ name: req.body.name })
    .then(existingNews => {
        if (existingNews) {
            return res.status(409).send({ message: 'News already exists' });
        } else{
            return newNews.save()

            .then(result => res.status(201).send({ 
                    success: true,
                    message: 'News added successfully', 
                    result: result 
                }))
            .catch(error => errorHandler(error, req, res));
        }
    }).catch(error => errorHandler(error, req, res));
};

module.exports.getAllNews = (req, res) => {
    return News.find({})
    .then(result => {
        if(result.length > 0){
            return res.status(200).send(result);
        }
        else{
            return res.status(404).send({ message: 'No news found' });
        }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.getAllActive = (req, res) => {

    News.find({ isActive : true }).then(result => {
        if (result.length > 0){
            return res.status(200).send(result);
        }
        else {
            return res.status(200).send({ message: 'No active news found' });
        }
    }).catch(err => res.status(500).send(err));

};

module.exports.getNews = (req, res) => {
    News.findById(req.params.newsId)
    .then(news => {
        if (news) {
            return res.status(200).send(news);
        } else {
            return res.status(404).send({ message: 'News not found' });
        }
    })
    .catch(error => errorHandler(error, req, res)); 
};

module.exports.updateNews = (req, res)=>{

    let updatedNews = {
        name: req.body.name,
        description: req.body.description,
    }
    return News.findByIdAndUpdate(req.params.newsId, updatedNews)
    .then(news => {
        if (news) {
            res.status(200).send({ success: true, message: 'News updated successfully' });
        } else {
            res.status(404).send({ message: 'News not found' });
        }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.archiveNews = (req, res) => {
  
    let updateActiveField = {
        isActive: false
    };

    News.findByIdAndUpdate(req.params.newsId, updateActiveField)
        .then(news => {
            if (news) {
                if (!news.isActive) {
                    return res.status(200).send({ 
                        message: 'News already archived',
                        news: news
                        });
                }
                return res.status(200).send({ 
                            success: true, 
                            message: 'News archived successfully'
                        });
            } else {
                //if the news is not found, return 'News not found'
                return res.status(404).send({ message: 'News not found' });
            }
        })
        .catch(error => errorHandler(error, req, res));
};

module.exports.activateNews = (req, res) => {
  
    let updateActiveField = {
        isActive: true
    }

    News.findByIdAndUpdate(req.params.newsId, updateActiveField)
        .then(news => {
            if (news) {
                if (news.isActive) {
                    return res.status(200).send({ 
                        message: 'News already activated',
                        news: news
                    });
                }
                return res.status(200).send({
                    success: true,
                    message: 'News activated successfully'
                });
            } else {
                return res.status(404).send({ message: 'News not found' });
            }
        })
        .catch(error => errorHandler(error, req, res));
};