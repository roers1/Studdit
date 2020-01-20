const chai = require('chai')
const expect = chai.expect

const requester = require('./requester.spec')

describe('bad endpoints handling', function() {

  it('POST to unknown endpoint should be handled correctly', async function() {
    const res = await requester.post('/5t34f');
    expect(res).to.have.status(404);
    expect(res.body).to.have.deep.property('error', {
      Message: 'Not found'
    })
  })

  it('GET to unknown endpoint should be handled correctly', async function() {
    const res = await requester.get('/5t3eg4f');
    expect(res).to.have.status(404);
    expect(res.body).to.have.deep.property('error', {
      Message: 'Not found'
    })
  })

  it('PUT to unknown endpoint should be handled correctly', async function() {
    const res = await requester.put('/5th,34f');
    expect(res).to.have.status(404);
    expect(res.body).to.have.deep.property('error', {
      Message: 'Not found'
    })
  })

  it('DELETE to unknown endpoint should be handled correctly', async function() {
    const res = await requester.delete('/5tzcx34f');
    expect(res).to.have.status(404);
    expect(res.body).to.have.deep.property('error', {
      Message: 'Not found'
    })
  })
});
