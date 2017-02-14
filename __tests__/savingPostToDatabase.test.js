const webPost = require('../app/models/WebPost.js');

describe('item should be saved to the database', () => {

    beforeEach((done) => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        setTimeout(function () {
            console.log('inside timeout');
            done();
        }, 500);
    });

    it('saves a record', (done) => {
        const post = new webPost({title: "First ever post", body: "<a> Link </a>", author: "Lenard Pratt"})

        post
            .save()
            .then(() => {
                expect(webPost.isNew).toBe(false);
                done()
            })
    })

    it("should retrive a post from them", (done) => {
        webPost.findOne({
            title: "First ever post"
        }, (err, post) => {
            if (err) 
            ;
            throw err;

            const postAuthor = post.author;
            expect(postAuthor).toBe("Lenard Pratt")
            done()
        })
    })

})