const STAR = "*";
const SPACE = " ";
const DASHES = "-";
const SYMBOLS = [STAR, DASHES, SPACE];

function repeat(character, times) {
  return character.repeat(times);
}

function stars(times) {
  return repeat(STAR, times);
}

function spaces(times) {
  return repeat(SPACE, times);
}

function putCharAtEnd(length, border, character) {
  if (length < 3) {
    return stars(1);
  }

  return border + repeat(character, length - 2) + border;
}

function hollowLine(length) {
  return putCharAtEnd(length, STAR, SPACE);
}

function alignRight(string, padSize) {
  return string.padStart(padSize);
}

function range(from, to, step) {
  const numbers = [];

  for (let number = from; number < to; number += step) {
    numbers.push(number);
  }

  return numbers;
}

function isEven(number) {
  return number % 2 === 0;
}

function convertToOdd(number) {
  const substarctor = isEven(number) ? 1 : 0;
  return number - substarctor;
}

function reverse(array) {
  const reversedMatrix = [];

  for (const row of array) {
    reversedMatrix.unshift(row);
  }

  return reversedMatrix;
}

function concat(array1, array2) {
  const newArray = array1;

  for (const element of array2) {
    newArray.push(element);
  }

  return newArray;
}

function createArrayOf(length, character) {
  const array = [];

  for (let index = 0; index < length; index++) {
    array.push(character);
  }

  return array;
}

// todo: fix this thing
function rectangle(rows, columns, lineStyle) {
  const border = stars(rows);
  const hollow = [border];

  if (rows < 3 || rows < 3) {
    return createArrayOf(columns, border);
  }

  for (const row of range(1, columns - 1, 1)) {
    hollow[row] = lineStyle(rows);
  }

  hollow.push(border);

  return hollow;
}

function alternativeRectangle(rows, columns, length) {
  const frame = [];

  for (const row of range(0, columns, 1)) {
    const character = SYMBOLS[row % length];
    frame.push(repeat(character, rows));
  }

  return frame;
}

function triangle(base) {
  const frame = [];

  for (const line of range(1, base + 1, 1)) {
    frame.push(stars(line));
  }

  return frame;
}

function pyramid(base, [fillent, filler]) {
  const frame = [];
  let padSize = Math.floor(base / 2);

  for (const line of range(1, base + 1, 2)) {
    const row = putCharAtEnd(line, fillent, filler);
    frame.push(alignRight(row, padSize + line));
    padSize--;
  }

  return frame;
}

function diamond(base, characters) {
  const oddBase = convertToOdd(base);

  const top = pyramid(oddBase, characters);
  const bottom = reverse(pyramid(oddBase - 1, characters));

  return concat(top, bottom);
}

function rectangles(rows, columns, style) {
  if (style === "filled-rectangle") {
    return rectangle(rows, columns, stars);
  }

  if (style === "hollow-rectangle") {
    return rectangle(rows, columns, hollowLine);
  }

  if (style === "alternating-rectangle") {
    return alternativeRectangle(rows, columns, 2);
  }

  if (style === "spaced-alternating-rectangle") {
    return alternativeRectangle(rows, columns, 3);
  }
}

function rightAlignedTriangle(base) {
  const frame = [];

  for (const line of triangle(base)) {
    frame.push(alignRight(line, base));
  }

  return frame;
}

function singleDimension(base, style) {
  if (style === "triangle") {
    return triangle(base);
  }

  if (style === "right-aligned-triangle") {
    return rightAlignedTriangle(base);
  }

  if (style === "diamond") {
    return diamond(base, [STAR, STAR]);
  }

  if (style === "hollow-diamond") {
    return diamond(base, [STAR, SPACE]);
  }

  return [];
}

function patterns(style, dimensions) {
  const rows = dimensions[0];
  const columns = dimensions[1];

  if (dimensions.length === 2) {
    return rectangles(rows, columns, style);
  }

  if (dimensions.length === 1) {
    return singleDimension(rows, style);
  }
}

function merge(array1, array2, size) {
  const newArray = [];

  for (const index of range(0, array1.length, 1)) {
    const element = array1[index].padEnd(size) + array2[index];
    newArray.push(element);
  }

  return newArray;
}

function generatePattern(style1, dimensions, style2) {
  if (dimensions[0] < 1 || dimensions[1] < 1) {
    return '';
  }

  const pattern1 = patterns(style1, dimensions);

  if (style2 === undefined || style2 === "") {
    return pattern1.join("\n");
  }

  const pattern2 = patterns(style2, dimensions);

  return merge(pattern1, pattern2, dimensions[0] + 1).join("\n");

}

// tesing part
function testGeneratePattern(style1, dimensions, style2, expected, failed) {
  const actual = generatePattern(style1, dimensions, style2);
  if (actual !== expected) {
    failed.push([style1, style2, dimensions, actual, expected]);
  }
}

function testFilledRectangle(failed) {
  testGeneratePattern('filled-rectangle', [1, 0], "", '', failed);
  testGeneratePattern('filled-rectangle', [0, 1], "", '', failed);
  testGeneratePattern('filled-rectangle', [1, 1], "", '*', failed);
  testGeneratePattern('filled-rectangle', [2, 1], "", '**', failed);
  testGeneratePattern('filled-rectangle', [2, 2], "", '**\n**', failed);
  testGeneratePattern('filled-rectangle', [3, 2], "", '***\n***', failed);
  testGeneratePattern('filled-rectangle', [3, 3], "", '***\n***\n***', failed);
  testGeneratePattern('filled-rectangle', [3, 4], "", '***\n***\n***\n***', failed);
}

function testHollow(failed) {
  testGeneratePattern('hollow-rectangle', [1, 0], "", '', failed);
  testGeneratePattern('hollow-rectangle', [0, 1], "", '', failed);
  testGeneratePattern('hollow-rectangle', [1, 1], "", '*', failed);
  testGeneratePattern('hollow-rectangle', [1, 2], "", '*\n*', failed);
  testGeneratePattern('hollow-rectangle', [2, 2], "", '**\n**', failed);
  testGeneratePattern('hollow-rectangle', [2, 3], "", '**\n**\n**', failed);
  testGeneratePattern('hollow-rectangle', [3, 3], "", '***\n* *\n***', failed);
  testGeneratePattern('hollow-rectangle', [3, 3], "", '***\n* *\n***', failed);
  testGeneratePattern('hollow-rectangle', [3, 4], "", '***\n* *\n* *\n***', failed);
  testGeneratePattern('hollow-rectangle', [4, 4], "", '****\n*  *\n*  *\n****', failed);
  testGeneratePattern('hollow-rectangle', [3, 6], "", '***\n* *\n* *\n* *\n* *\n***', failed);
}

function testAlternate(failed) {
  testGeneratePattern('alternating-rectangle', [1, 1], "", '*', failed);
  testGeneratePattern('alternating-rectangle', [1, 1], "", '*', failed);
  testGeneratePattern('alternating-rectangle', [1, 2], "", '*\n-', failed);
  testGeneratePattern('alternating-rectangle', [2, 2], "", '**\n--', failed);
  testGeneratePattern('alternating-rectangle', [2, 3], "", '**\n--\n**', failed);
  testGeneratePattern('alternating-rectangle', [3, 3], "", '***\n---\n***', failed);
  testGeneratePattern('alternating-rectangle', [3, 4], "", '***\n---\n***\n---', failed);
}

function testTriangle(failed) {
  testGeneratePattern('triangle', [0], "", '', failed);
  testGeneratePattern('triangle', [1], "", '*', failed);
  testGeneratePattern('triangle', [2], "", '*\n**', failed);
  testGeneratePattern('triangle', [3], "", '*\n**\n***', failed);
  testGeneratePattern('triangle', [4], "", '*\n**\n***\n****', failed);
  testGeneratePattern('triangle', [5], "", '*\n**\n***\n****\n*****', failed);
}

function testRightAlignedTraiangle(failed) {
  testGeneratePattern('right-aligned-triangle', [0], "", '', failed);
  testGeneratePattern('right-aligned-triangle', [1], "", '*', failed);
  testGeneratePattern('right-aligned-triangle', [2], "", ' *\n**', failed);
  testGeneratePattern('right-aligned-triangle', [3], "", '  *\n **\n***', failed);
  testGeneratePattern('right-aligned-triangle', [4], "", '   *\n  **\n ***\n****', failed);
  testGeneratePattern('right-aligned-triangle', [5], "", '    *\n   **\n  ***\n ****\n*****', failed);
}

function testSpaceAlternateRectangle(failed) {
  testGeneratePattern('spaced-alternating-rectangle', [1, 1], "", '*', failed);
  testGeneratePattern('spaced-alternating-rectangle', [1, 2], "", '*\n-', failed);
  testGeneratePattern('spaced-alternating-rectangle', [1, 3], "", '*\n-\n ', failed);
  testGeneratePattern('spaced-alternating-rectangle', [2, 3], "", '**\n--\n  ', failed);
  testGeneratePattern('spaced-alternating-rectangle', [2, 4], "", '**\n--\n  \n**', failed);
  testGeneratePattern('spaced-alternating-rectangle', [2, 5], "", '**\n--\n  \n**\n--', failed);
  testGeneratePattern('spaced-alternating-rectangle', [2, 6], "", '**\n--\n  \n**\n--\n  ', failed);
}

function testDiamond(failed) {
  testGeneratePattern('diamond', [1], "", '*', failed);
  testGeneratePattern('diamond', [2], "", '*', failed);
  testGeneratePattern('diamond', [3], "", ' *\n***\n *', failed);
  testGeneratePattern('diamond', [4], "", ' *\n***\n *', failed);
  testGeneratePattern('diamond', [5], "", '  *\n ***\n*****\n ***\n  *', failed);
  testGeneratePattern('diamond', [6], "", '  *\n ***\n*****\n ***\n  *', failed);
  testGeneratePattern('diamond', [7], "", '   *\n  ***\n *****\n*******\n *****\n  ***\n   *', failed);
}

function testHollowDiamond(failed) {
  testGeneratePattern('hollow-diamond', [1], "", '*', failed);
  testGeneratePattern('hollow-diamond', [2], "", '*', failed);
  testGeneratePattern('hollow-diamond', [3], "", ' *\n* *\n *', failed);
  testGeneratePattern('hollow-diamond', [4], "", ' *\n* *\n *', failed);
  testGeneratePattern('hollow-diamond', [5], "", "  *\n * *\n*   *\n * *\n  *", failed);
}

function testDoubleThings(failed) {
  testGeneratePattern('filled-rectangle', [3, 3], 'hollow-rectangle', "*** ***\n*** * *\n*** ***", failed);
  testGeneratePattern('diamond', [5], 'hollow-diamond', "  *     *\n ***   * *\n***** *   *\n ***   * *\n  *     *", failed);

}

function testAll() {
  const failed = [];

  testFilledRectangle(failed);
  testHollow(failed);
  testAlternate(failed);
  testTriangle(failed);
  testRightAlignedTraiangle(failed);
  testSpaceAlternateRectangle(failed);
  testDiamond(failed);
  testHollowDiamond(failed);
  testDoubleThings(failed);

  console.table(failed);
}

testAll();

