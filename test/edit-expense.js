describe('PUT /edit-expense/:id', () => {
    it('should update an expense', (done) => {
        const expenseId = 1; 
        chai.request(app)
            .put(`/edit-expense/${expenseId}`)
            .send({
                title: 'Groceries Updated',
                amount: 60.00
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message', 'Expense updated successfully');
                done();
            });
    });
});
