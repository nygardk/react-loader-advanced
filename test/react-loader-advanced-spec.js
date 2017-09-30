import {
  createLoaderStack,
} from 'react-loader-advanced';

describe('loaderStack', () => {
  let loaderStack;

  beforeEach(() => {
    loaderStack = createLoaderStack();
  });

  describe('addLoader()', () => {
    it('should add loader to stack if it doesn`t exist already', () => {
      loaderStack.stack = [];

      loaderStack.addLoader('abc');

      expect(loaderStack.stack).toEqual([{ id: 'abc', priority: 0 }]);
    });

    it('should not add loader to stack if it exists already', () => {
      loaderStack.stack = [
        { id: 'abc', priority: 0 },
        { id: 'bbb', priority: 0 },
      ];

      loaderStack.addLoader('abc');

      expect(loaderStack.stack).toEqual([
        { id: 'abc', priority: 0 },
        { id: 'bbb', priority: 0 },
      ]);
    });
  });

  describe('removeLoader()', () => {
    it('should remove loader from stack', () => {
      loaderStack.stack = [
        { id: 'abc', priority: 0 },
        { id: 'bbb', priority: 0 },
      ];

      loaderStack.removeLoader('abc');

      expect(loaderStack.stack).toEqual([{ id: 'bbb', priority: 0 }]);
    });
  });

  describe('getMaxPriority()', () => {
    it('should return the highest priority from the stack', () => {
      loaderStack.stack = [
        { id: 'abc', priority: 5 },
        { id: 'bbb', priority: 0 },
        { id: 'fgg', priority: 3 },
        { id: 'ccc', priority: 11 },
        { id: 'ddd', priority: 2 },
      ];

      expect(loaderStack.getMaxPriority()).toEqual(11);
    });
  });
});
