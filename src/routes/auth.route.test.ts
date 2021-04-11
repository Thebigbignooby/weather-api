describe('/auth', () => {
  describe('/auth/signup', () => {
    it('creates a user in the database', () => {
      
    })
    it('stores a hashed version of a users password', () => {

    })
    it('returns a status:200', () => {

    })
  })

  describe('/auth/signin', () => {
    describe('user exists', () => {
      describe('supplied password is correct', () => {
        it('returns a JWT', () => {
          
        })
      })
      describe('supplied password is incorrect', () => {
        it('returns an error', () => {
          
        })
      })
    })
    describe('user does not exist', () => {
      it('returns an error', () => {
        
      })
    })
  })
})