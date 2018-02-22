test('is true', () => {

  function dummy(){
    return true;
  }

  expect(dummy()).toBe(true);
});

test('another dummy test', () => {
  expect(true).toBe(true);
});