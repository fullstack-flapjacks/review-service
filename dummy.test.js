test('is true', () => {

  function dummy(){
    return true;
  }

  expect(dummy()).toBe(true);
});