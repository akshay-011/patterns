const range = function (start, end, step) {
  const numbers = [];

  for (let number = start; number < end; number += step) {
    numbers.push(number);
  }

  return numbers;
};

const repeat = function (character) {
  return function (times) {
    return character.repeat(times);
  };
};

const stars = repeat("*");
const dashes = repeat("-");
const spaces = repeat(" ");

const hollowLine = function (length) {
  if (length < 3) {
    return stars(length);
  }

  return stars(1) + spaces(length - 2) + stars(1);
};

const filledRectangle = function ([rows, columns]) {
  return Array(columns).fill(rows).map(stars);
};

const hollowRectangle = function ([rows, columns]) {
  const rectangle = filledRectangle([rows, columns]);
  if (rows < 3 || columns < 3) {
    return rectangle;
  }

  return rectangle.fill(hollowLine(rows), 1, -1);
};

const cycle = function (end) {
  let index = -1;

  return function () {
    index = index + 1;
    if (index >= end) {
      index = 0;
    }

    return index;
  };
};

function chooseLine(array) {
  const chooseIndex = cycle(array.length);

  return function (number) {
    return array[chooseIndex()](number);
  };
}

const alternatingRectangle = function ([rows, columns], lines) {
  const alternatingLine = chooseLine(lines);
  return Array(columns).fill(rows).map(alternatingLine);
};

const alignRight = function (length, filler) {
  return function (string) {
    return string.padStart(length, filler);
  };
};

const triangle = function ([base], filler) {
  const aligner = alignRight(base, filler);

  return range(1, base + 1, 1).map(stars).map(aligner);
};

function addContinousCharacter(character, init, incrementor) {
  return function (string) {
    const charCount = init + string.length;
    init += incrementor;

    return string.padStart(charCount, character);
  };
}

const pyramid = function (base, line) {
  const baseFrame = range(1, base + 1, 2).map(line).reverse();
  const aligner = addContinousCharacter(spaces(1), 0, 1);

  return baseFrame.map(aligner).reverse();
};

function diamond([base], lineStyle) {
  const upper = pyramid(base, lineStyle);
  const bottom = upper.slice(0, -1).reverse();

  return [...upper, ...bottom];
}

const rectanglePattern = function (style, dimensions) {
  if (style === "filled-rectangle") {
    return filledRectangle(dimensions);
  }

  if (style === "hollow-rectangle") {
    return hollowRectangle(dimensions);
  }

  if (style === 'alternating-rectangle') {
    return alternatingRectangle(dimensions, [stars, dashes]);
  }

  if (style === 'spaced-alternating-rectangle') {
    return alternatingRectangle(dimensions, [stars, dashes, spaces]);
  }

  return [];
};

const singleDimension = function (style, dimensions) {
  if (style === "triangle") {
    return triangle(dimensions, "");
  }

  if (style === 'right-aligned-triangle') {
    return triangle(dimensions, " ");
  }

  if (style === "diamond") {
    return diamond(dimensions, stars);
  }

  if (style === "hollow-diamond") {
    return diamond(dimensions, hollowLine);
  }

};

const makePatterns = function (style, dimensions) {
  if (dimensions.length === 1) {
    return singleDimension(style, dimensions);
  }

  return rectanglePattern(style, dimensions);
};

function generatePattern(style1, dimensions, style2) {
  if (dimensions[0] === 0 || dimensions[1] === 0) {
    return '';
  }


  return makePatterns(style1, dimensions).join("\n");
}

// tesing part
function testGeneratePattern(failed, [style1, dimensions, style2, expected]) {
  const actual = generatePattern(style1, dimensions, style2);
  if (actual !== expected) {
    failed.push([style1, style2, dimensions, actual, expected]);
  }

  return failed;
}

const filledRectangleTestCases = [
  ['filled-rectangle', [1, 0], "", ''],
  ['filled-rectangle', [0, 1], "", ''],
  ['filled-rectangle', [1, 1], "", '*'],
  ['filled-rectangle', [2, 1], "", '**'],
  ['filled-rectangle', [2, 2], "", '**\n**'],
  ['filled-rectangle', [3, 2], "", '***\n***'],
  ['filled-rectangle', [3, 3], "", '***\n***\n***'],
  ['filled-rectangle', [3, 4], "", '***\n***\n***\n***'],
];

const hollowRectangleTestCases = [
  ['hollow-rectangle', [1, 0], "", ''],
  ['hollow-rectangle', [0, 1], "", ''],
  ['hollow-rectangle', [2, 2], "", '**\n**'],
  ['hollow-rectangle', [2, 3], "", '**\n**\n**'],
  ['hollow-rectangle', [3, 3], "", '***\n* *\n***'],
  ['hollow-rectangle', [3, 3], "", '***\n* *\n***'],
  ['hollow-rectangle', [3, 4], "", '***\n* *\n* *\n***'],
  ['hollow-rectangle', [4, 4], "", '****\n*  *\n*  *\n****'],
  ['hollow-rectangle', [3, 6], "", '***\n* *\n* *\n* *\n* *\n***'],
];

const alternatingRectangleTestCases = [
  ['alternating-rectangle', [1, 1], "", '*'],
  ['alternating-rectangle', [1, 1], "", '*'],
  ['alternating-rectangle', [1, 2], "", '*\n-'],
  ['alternating-rectangle', [2, 2], "", '**\n--'],
  ['alternating-rectangle', [2, 3], "", '**\n--\n**'],
  ['alternating-rectangle', [3, 3], "", '***\n---\n***'],
  ['alternating-rectangle', [3, 4], "", '***\n---\n***\n---'],
];

const triangleTestCase = [
  ['triangle', [0], "", ''],
  ['triangle', [1], "", '*'],
  ['triangle', [2], "", '*\n**'],
  ['triangle', [3], "", '*\n**\n***'],
  ['triangle', [4], "", '*\n**\n***\n****'],
  ['triangle', [5], "", '*\n**\n***\n****\n*****'],
];

const rightAlignedTriangle = [
  ['right-aligned-triangle', [0], "", ''],
  ['right-aligned-triangle', [1], "", '*'],
  ['right-aligned-triangle', [2], "", ' *\n**'],
  ['right-aligned-triangle', [3], "", '  *\n **\n***'],
  ['right-aligned-triangle', [4], "", '   *\n  **\n ***\n****'],
  ['right-aligned-triangle', [5], "", '    *\n   **\n  ***\n ****\n*****'],
];

const spacedAlternatingRectangleTestCases = [
  ['spaced-alternating-rectangle', [1, 1], "", '*'],
  ['spaced-alternating-rectangle', [1, 2], "", '*\n-'],
  ['spaced-alternating-rectangle', [1, 3], "", '*\n-\n '],
  ['spaced-alternating-rectangle', [2, 3], "", '**\n--\n  '],
  ['spaced-alternating-rectangle', [2, 4], "", '**\n--\n  \n**'],
  ['spaced-alternating-rectangle', [2, 5], "", '**\n--\n  \n**\n--'],
  ['spaced-alternating-rectangle', [2, 6], "", '**\n--\n  \n**\n--\n  '],
];

const diamondTestCases = [
  ['diamond', [1], "", '*'],
  ['diamond', [2], "", '*'],
  ['diamond', [3], "", ' *\n***\n *'],
  ['diamond', [4], "", ' *\n***\n *'],
  ['diamond', [5], "", '  *\n ***\n*****\n ***\n  *'],
  ['diamond', [6], "", '  *\n ***\n*****\n ***\n  *'],
  ['diamond', [7], "", '   *\n  ***\n *****\n*******\n *****\n  ***\n   *'],
];

const hollowDiamondTestCases = [
  ['hollow-diamond', [1], "", '*'],
  ['hollow-diamond', [2], "", '*'],
  ['hollow-diamond', [3], "", ' *\n* *\n *'],
  ['hollow-diamond', [4], "", ' *\n* *\n *'],
  ['hollow-diamond', [5], "", "  *\n * *\n*   *\n * *\n  *"],
];

const doubleThings = [
  ['filled-rectangle', [3, 3], 'hollow-rectangle', "*** ***\n*** * *\n*** ***"],
  ['diamond', [5], 'hollow-diamond', ""],
];

const allTestCases = [
  ...filledRectangleTestCases,
  ...hollowRectangleTestCases,
  ...alternatingRectangleTestCases,
  ...triangleTestCase,
  ...rightAlignedTriangle,
  ...spacedAlternatingRectangleTestCases,
  ...diamondTestCases,
  ...hollowDiamondTestCases,
  ...doubleThings
];

const printStatus = function (allTestCases, failed) {
  console.log("Failed :", failed.length, " / ", allTestCases.length);
};

function testAll() {
  const failed = allTestCases.reduce(testGeneratePattern, []);
  console.table(failed);
  printStatus(allTestCases, failed);
}

testAll();
