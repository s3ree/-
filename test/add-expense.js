describe('POST /add-expense', () => {
    it('should add a new expense', (done) => {
        chai.request(app)
            .post('/add-expense')
            .send({
                title: 'Groceries',
                amount: 50.00
            })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('id');
                done();
            });
    });
});
