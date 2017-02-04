const mongoose = require('mongoose');


mongoose.Promise = global.Promise

describe('Connecting to database', ()=>{

    beforeEach(()=>{
         jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
          setTimeout(function () {
            console.log('inside timeout');
            done();
        }, 500);
         mongoose.connect('mongodb://localhost/website')
    })

    it('should connect sucessfully', (done)=>{
       mongoose.connection.once("open",()=>{  
            done()
       }).on("error", (err)=>{
           expect(err).toBeNull()
       })
    })

    

})