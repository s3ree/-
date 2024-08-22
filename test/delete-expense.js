describe('DELETE /delete-expense/:id', () => {
    it('should delete an expense', (done) => {
        const expenseId = 1; 
        chai.request(app)
            .delete(`/delete-expense/${expenseId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message', 'Expense deleted successfully');
                done();
            });
    });
});
