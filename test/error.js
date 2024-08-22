describe('Error Handling', () => {
    it('should return 404 for a non-existent expense', (done) => {
        const nonExistentId = 3000;
        chai.request(app)
            .get(`/expenses/${nonExistentId}`)
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.have.property('error', 'Expense not found');
                done();
            });
    });
});
